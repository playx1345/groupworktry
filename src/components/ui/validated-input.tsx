import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ValidatedInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onValidation?: (isValid: boolean, error?: string) => void;
  validator?: (value: string) => Promise<{ isValid: boolean; error?: string }> | { isValid: boolean; error?: string };
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  debounceMs?: number;
  showValidationIcon?: boolean;
  autoComplete?: string;
  'aria-describedby'?: string;
}

export const ValidatedInput = ({
  id,
  label,
  value,
  onChange,
  onValidation,
  validator,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className,
  debounceMs = 300,
  showValidationIcon = true,
  autoComplete,
  'aria-describedby': ariaDescribedBy,
}: ValidatedInputProps) => {
  const [validationState, setValidationState] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    error?: string;
  }>({
    isValidating: false,
    isValid: null,
  });

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!validator || !value) {
      setValidationState({ isValidating: false, isValid: null });
      onValidation?.(true);
      return;
    }

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer
    const timer = setTimeout(async () => {
      setValidationState(prev => ({ ...prev, isValidating: true }));

      try {
        const result = await validator(value);
        setValidationState({
          isValidating: false,
          isValid: result.isValid,
          error: result.error,
        });
        onValidation?.(result.isValid, result.error);
      } catch (error) {
        setValidationState({
          isValidating: false,
          isValid: false,
          error: 'Validation error occurred',
        });
        onValidation?.(false, 'Validation error occurred');
      }
    }, debounceMs);

    setDebounceTimer(timer);

    // Cleanup
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [value, validator, debounceMs, onValidation]);

  const getValidationIcon = () => {
    if (!showValidationIcon || !value) return null;

    if (validationState.isValidating) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }

    if (validationState.isValid === true) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }

    if (validationState.isValid === false) {
      return <XCircle className="h-4 w-4 text-destructive" />;
    }

    return null;
  };

  const getInputClassName = () => {
    let baseClassName = "transition-all duration-200";
    
    if (validationState.isValid === true && value) {
      baseClassName += " border-green-500 focus:border-green-500 focus:ring-green-500/20";
    } else if (validationState.isValid === false && value) {
      baseClassName += " border-destructive focus:border-destructive focus:ring-destructive/20";
    }

    return cn(baseClassName, className);
  };

  const errorId = validationState.error ? `${id}-error` : undefined;
  const ariaDescribedByValue = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id}
        className={cn(
          "text-sm font-medium transition-colors duration-200",
          validationState.isValid === false && value && "text-destructive"
        )}
      >
        {label}
        {required && <span className="ml-1 text-destructive" aria-label="required">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={getInputClassName()}
          aria-invalid={validationState.isValid === false}
          aria-describedby={ariaDescribedByValue}
        />
        
        {showValidationIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getValidationIcon()}
          </div>
        )}
      </div>

      {validationState.error && (
        <div 
          id={errorId}
          className="flex items-center gap-1 text-sm text-destructive animate-in slide-in-from-top-1 duration-200"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          <span>{validationState.error}</span>
        </div>
      )}
    </div>
  );
};