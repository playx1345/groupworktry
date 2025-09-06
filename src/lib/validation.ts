import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  middleName?: string;
  matricNumber: string;
  email: string;
  phone?: string;
  level: string;
  department?: string;
  faculty?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  stateOfOrigin?: string;
  lga?: string;
}

export interface AuditLogData {
  action: string;
  tableName: string;
  recordId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

// Validation utilities
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const validateMatricNumber = (matricNumber: string): ValidationResult => {
  if (!matricNumber) {
    return { isValid: false, error: 'Matric number is required' };
  }
  
  // Basic format validation (adjust as needed)
  const matricRegex = /^[A-Z0-9\/]+$/i;
  if (!matricRegex.test(matricNumber)) {
    return { isValid: false, error: 'Matric number format is invalid' };
  }
  
  if (matricNumber.length < 6) {
    return { isValid: false, error: 'Matric number is too short' };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  
  // Check for at least one number and one letter for stronger passwords
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  
  if (!hasNumber || !hasLetter) {
    return { isValid: false, error: 'Password must contain both letters and numbers' };
  }
  
  return { isValid: true };
};

export const validateName = (name: string, fieldName: string): ValidationResult => {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (name.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  
  // Only allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: true }; // Phone is optional
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { isValid: false, error: 'Phone number must be between 10 and 15 digits' };
  }
  
  return { isValid: true };
};

// Database validation functions
export const checkEmailUniqueness = async (email: string, excludeUserId?: string): Promise<ValidationResult> => {
  try {
    const { data, error } = await supabase.rpc('validate_unique_email', {
      p_email: email,
      p_exclude_user_id: excludeUserId || null
    });

    if (error) {
      console.error('Error checking email uniqueness:', error);
      return { isValid: false, error: 'Unable to validate email uniqueness' };
    }

    if (!data) {
      return { isValid: false, error: 'This email address is already in use' };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Error checking email uniqueness:', error);
    return { isValid: false, error: 'Unable to validate email uniqueness' };
  }
};

export const checkMatricNumberUniqueness = async (matricNumber: string, excludeUserId?: string): Promise<ValidationResult> => {
  try {
    const { data, error } = await supabase.rpc('validate_unique_matric_number', {
      p_matric_number: matricNumber,
      p_exclude_user_id: excludeUserId || null
    });

    if (error) {
      console.error('Error checking matric number uniqueness:', error);
      return { isValid: false, error: 'Unable to validate matric number uniqueness' };
    }

    if (!data) {
      return { isValid: false, error: 'This matric number is already in use' };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Error checking matric number uniqueness:', error);
    return { isValid: false, error: 'Unable to validate matric number uniqueness' };
  }
};

// Comprehensive validation for user creation
export const validateUserCreationData = async (data: CreateUserData): Promise<ValidationResult> => {
  // Basic field validations
  const firstNameValidation = validateName(data.firstName, 'First name');
  if (!firstNameValidation.isValid) return firstNameValidation;

  const lastNameValidation = validateName(data.lastName, 'Last name');
  if (!lastNameValidation.isValid) return lastNameValidation;

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) return emailValidation;

  const matricValidation = validateMatricNumber(data.matricNumber);
  if (!matricValidation.isValid) return matricValidation;

  if (data.phone) {
    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.isValid) return phoneValidation;
  }

  // Database uniqueness checks
  const emailUniquenessCheck = await checkEmailUniqueness(data.email);
  if (!emailUniquenessCheck.isValid) return emailUniquenessCheck;

  const matricUniquenessCheck = await checkMatricNumberUniqueness(data.matricNumber);
  if (!matricUniquenessCheck.isValid) return matricUniquenessCheck;

  return { isValid: true };
};

// Audit logging function
export const logAuditEvent = async (auditData: AuditLogData): Promise<void> => {
  try {
    const { error } = await supabase.rpc('log_audit_event', {
      p_action: auditData.action,
      p_table_name: auditData.tableName,
      p_record_id: auditData.recordId || null,
      p_old_values: auditData.oldValues || null,
      p_new_values: auditData.newValues || null
    });

    if (error) {
      console.error('Error logging audit event:', error);
    }
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
};

// Password strength checker
export const getPasswordStrength = (password: string): { 
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number;
  feedback: string[];
} => {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Use at least 8 characters');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include uppercase letters');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include numbers');
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include special characters');
  }

  let strength: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak';
  if (score >= 5) strength = 'very-strong';
  else if (score >= 4) strength = 'strong';
  else if (score >= 3) strength = 'medium';

  return { strength, score, feedback };
};