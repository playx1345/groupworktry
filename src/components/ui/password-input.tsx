import { useEffect, useState } from 'react';
import { Eye, EyeOff, Shield, ShieldCheck, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { getPasswordStrength } from '@/lib/validation';
import { cn } from '@/lib/utils';

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onValidation?: (isValid: boolean, error?: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showStrengthMeter?: boolean;
  className?: string;
  autoComplete?: string;
  'aria-describedby'?: string;
}

export const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  onValidation,
  placeholder = "Enter password",
  required = false,
  disabled = false,
  showStrengthMeter = true,
  className,
  autoComplete = "new-password",
  'aria-describedby': ariaDescribedBy,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strengthData, setStrengthData] = useState({
    strength: 'weak' as const,
    score: 0,
    feedback: [] as string[],
  });

  useEffect(() => {
    if (value) {
      const result = getPasswordStrength(value);
      setStrengthData(result);
      
      // Validate password
      const isValid = result.score >= 3; // Medium strength or better
      const error = isValid ? undefined : 'Password is too weak';
      onValidation?.(isValid, error);
    } else {
      setStrengthData({ strength: 'weak', score: 0, feedback: [] });
      onValidation?.(required ? false : true, required ? 'Password is required' : undefined);
    }
  }, [value, onValidation, required]);

  const getStrengthColor = () => {
    switch (strengthData.strength) {
      case 'very-strong':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'strong':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      default:
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
    }
  };

  const getStrengthIcon = () => {
    switch (strengthData.strength) {
      case 'very-strong':
      case 'strong':
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      case 'medium':
        return <Shield className="h-4 w-4 text-yellow-500" />;
      default:
        return <ShieldX className="h-4 w-4 text-red-500" />;
    }
  };

  const getProgressValue = () => {
    return (strengthData.score / 5) * 100;
  };

  const getProgressClassName = () => {
    switch (strengthData.strength) {
      case 'very-strong':
        return '[&>div]:bg-green-500';
      case 'strong':
        return '[&>div]:bg-blue-500';
      case 'medium':
        return '[&>div]:bg-yellow-500';
      default:
        return '[&>div]:bg-red-500';
    }
  };

  const strengthId = showStrengthMeter ? `${id}-strength` : undefined;
  const feedbackId = showStrengthMeter && strengthData.feedback.length > 0 ? `${id}-feedback` : undefined;
  const ariaDescribedByValue = [ariaDescribedBy, strengthId, feedbackId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id}
        className="text-sm font-medium"
      >
        {label}
        {required && <span className="ml-1 text-destructive" aria-label="required">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={cn("pr-20 transition-all duration-200", className)}
          aria-describedby={ariaDescribedByValue}
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <div className="mr-1">
              {getStrengthIcon()}
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {showStrengthMeter && value && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Progress 
              value={getProgressValue()} 
              className={cn("flex-1 h-1.5 mr-3", getProgressClassName())}
              aria-label="Password strength"
            />
            <span 
              id={strengthId}
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full capitalize transition-colors duration-200",
                getStrengthColor()
              )}
            >
              {strengthData.strength.replace('-', ' ')}
            </span>
          </div>

          {strengthData.feedback.length > 0 && (
            <div 
              id={feedbackId}
              className="text-xs text-muted-foreground space-y-1"
              aria-label="Password requirements"
            >
              <p className="font-medium">To improve your password:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                {strengthData.feedback.map((feedback, index) => (
                  <li key={index} className="animate-in slide-in-from-left-2 duration-200" style={{animationDelay: `${index * 50}ms`}}>
                    {feedback}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};