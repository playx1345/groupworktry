import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  isSystemTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get initial theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') || 'system';
    setCurrentTheme(savedTheme);
    
    // Determine if we're in dark mode
    const checkDarkMode = () => {
      if (savedTheme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return savedTheme === 'dark';
    };
    
    setIsDarkMode(checkDarkMode());
    
    // Apply theme to document
    applyTheme(savedTheme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (currentTheme === 'system') {
        const isDark = mediaQuery.matches;
        setIsDarkMode(isDark);
        applyThemeClass(isDark);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const applyThemeClass = (isDark: boolean) => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
      applyThemeClass(isDark);
    } else {
      const isDark = theme === 'dark';
      setIsDarkMode(isDark);
      applyThemeClass(isDark);
    }
  };

  const setTheme = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  };

  const toggleTheme = () => {
    if (currentTheme === 'system') {
      // If system, toggle to opposite of current system preference
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemDark ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
    }
  };

  const value: ThemeContextType = {
    theme: currentTheme,
    setTheme,
    toggleTheme,
    isDarkMode,
    isSystemTheme: currentTheme === 'system',
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
    </NextThemeProvider>
  );
};