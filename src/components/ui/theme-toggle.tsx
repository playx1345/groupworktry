import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export const ThemeToggle = ({ 
  className, 
  variant = "outline", 
  size = "icon" 
}: ThemeToggleProps) => {
  const { theme, setTheme, isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={cn("relative", className)}
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const getIcon = () => {
    if (theme === 'system') {
      return <Monitor className="h-4 w-4" />;
    }
    return isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  };

  const getLabel = () => {
    if (theme === 'system') return 'System theme';
    return isDarkMode ? 'Dark theme' : 'Light theme';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={cn(
            "relative transition-all duration-200 hover:scale-105",
            className
          )}
          aria-label={`Current theme: ${getLabel()}. Click to change theme.`}
        >
          <div className="relative flex items-center justify-center">
            {getIcon()}
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[140px] animate-in slide-in-from-top-2 duration-200"
      >
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={cn(
            "flex items-center gap-2 cursor-pointer transition-colors duration-150",
            theme === 'light' && "bg-accent"
          )}
          aria-label="Switch to light theme"
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && (
            <div className="ml-auto h-2 w-2 bg-primary rounded-full" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={cn(
            "flex items-center gap-2 cursor-pointer transition-colors duration-150",
            theme === 'dark' && "bg-accent"
          )}
          aria-label="Switch to dark theme"
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && (
            <div className="ml-auto h-2 w-2 bg-primary rounded-full" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className={cn(
            "flex items-center gap-2 cursor-pointer transition-colors duration-150",
            theme === 'system' && "bg-accent"
          )}
          aria-label="Switch to system theme"
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === 'system' && (
            <div className="ml-auto h-2 w-2 bg-primary rounded-full" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};