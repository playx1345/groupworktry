-- Create audit logging table
CREATE TABLE public.audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for performance
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_action ON public.audit_logs(table_name, action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit logs
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    ));

-- Function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
    p_action TEXT,
    p_table_name TEXT,
    p_record_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    audit_id UUID;
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values
    ) VALUES (
        auth.uid(),
        p_action,
        p_table_name,
        p_record_id,
        p_old_values,
        p_new_values
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$;

-- Function to validate unique email
CREATE OR REPLACE FUNCTION public.validate_unique_email(
    p_email TEXT,
    p_exclude_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if email exists in students table
    IF EXISTS (
        SELECT 1 FROM public.students 
        WHERE email = p_email 
        AND (p_exclude_user_id IS NULL OR user_id != p_exclude_user_id)
    ) THEN
        RETURN FALSE;
    END IF;
    
    -- Check if email exists in admins table
    IF EXISTS (
        SELECT 1 FROM public.admins 
        WHERE email = p_email 
        AND (p_exclude_user_id IS NULL OR user_id != p_exclude_user_id)
    ) THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$;

-- Function to validate unique matric number
CREATE OR REPLACE FUNCTION public.validate_unique_matric_number(
    p_matric_number TEXT,
    p_exclude_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM public.students 
        WHERE matric_number = p_matric_number 
        AND (p_exclude_user_id IS NULL OR user_id != p_exclude_user_id)
    );
END;
$$;

-- Create triggers for audit logging on students table
CREATE OR REPLACE FUNCTION public.audit_students_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM public.log_audit_event(
            'INSERT',
            'students',
            NEW.id,
            NULL,
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM public.log_audit_event(
            'UPDATE',
            'students',
            NEW.id,
            to_jsonb(OLD),
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM public.log_audit_event(
            'DELETE',
            'students',
            OLD.id,
            to_jsonb(OLD),
            NULL
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_audit_students ON public.students;
CREATE TRIGGER trigger_audit_students
    AFTER INSERT OR UPDATE OR DELETE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.audit_students_changes();

-- Create trigger for password changes (on auth.users would require different approach)
-- We'll handle this in the application layer for password changes