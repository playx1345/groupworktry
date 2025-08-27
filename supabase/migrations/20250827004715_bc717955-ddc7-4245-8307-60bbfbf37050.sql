-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.calculate_grade(total_score INTEGER)
RETURNS TABLE(grade TEXT, grade_point DECIMAL(3,2))
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF total_score >= 70 THEN
        RETURN QUERY SELECT 'A'::TEXT, 4.0::DECIMAL(3,2);
    ELSIF total_score >= 60 THEN
        RETURN QUERY SELECT 'B'::TEXT, 3.0::DECIMAL(3,2);
    ELSIF total_score >= 50 THEN
        RETURN QUERY SELECT 'C'::TEXT, 2.0::DECIMAL(3,2);
    ELSIF total_score >= 45 THEN
        RETURN QUERY SELECT 'D'::TEXT, 1.0::DECIMAL(3,2);
    ELSE
        RETURN QUERY SELECT 'F'::TEXT, 0.0::DECIMAL(3,2);
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_result_grade()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result_grade RECORD;
BEGIN
    SELECT grade, grade_point INTO result_grade 
    FROM public.calculate_grade(NEW.total_score);
    
    NEW.grade := result_grade.grade;
    NEW.grade_point := result_grade.grade_point;
    NEW.updated_at := now();
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;