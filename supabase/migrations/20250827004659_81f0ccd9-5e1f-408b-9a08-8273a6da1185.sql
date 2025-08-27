-- Create enum types for various fields
CREATE TYPE public.student_level AS ENUM ('ND1', 'ND2');
CREATE TYPE public.semester AS ENUM ('First', 'Second');
CREATE TYPE public.fee_status AS ENUM ('paid', 'unpaid', 'partial');
CREATE TYPE public.user_role AS ENUM ('student', 'admin');

-- Create students table
CREATE TABLE public.students (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    matric_number TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    middle_name TEXT,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    level student_level NOT NULL,
    department TEXT DEFAULT 'Computer Science',
    faculty TEXT DEFAULT 'School of Information and Communication Technology',
    date_of_birth DATE,
    gender TEXT,
    address TEXT,
    state_of_origin TEXT,
    lga TEXT,
    password_changed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admins table
CREATE TABLE public.admins (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    staff_id TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'admin',
    department TEXT DEFAULT 'Computer Science',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    course_code TEXT NOT NULL,
    course_title TEXT NOT NULL,
    credit_unit INTEGER NOT NULL,
    level student_level NOT NULL,
    semester semester NOT NULL,
    department TEXT DEFAULT 'Computer Science',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(course_code, level, semester)
);

-- Create results table
CREATE TABLE public.results (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    session TEXT NOT NULL,
    ca_score INTEGER CHECK (ca_score >= 0 AND ca_score <= 30),
    exam_score INTEGER CHECK (exam_score >= 0 AND exam_score <= 70),
    total_score INTEGER GENERATED ALWAYS AS (COALESCE(ca_score, 0) + COALESCE(exam_score, 0)) STORED,
    grade TEXT,
    grade_point DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(student_id, course_id, session)
);

-- Create fee_payments table
CREATE TABLE public.fee_payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    session TEXT NOT NULL,
    level student_level NOT NULL,
    semester semester NOT NULL,
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    status fee_status NOT NULL DEFAULT 'unpaid',
    payment_date DATE,
    reference_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(student_id, session, level, semester)
);

-- Create announcements table
CREATE TABLE public.announcements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_level student_level,
    is_general BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for students
CREATE POLICY "Students can view their own profile" ON public.students
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own profile" ON public.students
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for admins
CREATE POLICY "Admins can view all students" ON public.students
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admins can view their own profile" ON public.admins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can update their own profile" ON public.admins
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for courses
CREATE POLICY "Everyone can view courses" ON public.courses
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage courses" ON public.courses
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    ));

-- Create RLS policies for results
CREATE POLICY "Students can view their own results" ON public.results
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.students 
        WHERE id = results.student_id AND user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage all results" ON public.results
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    ));

-- Create RLS policies for fee payments
CREATE POLICY "Students can view their own fee status" ON public.fee_payments
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.students 
        WHERE id = fee_payments.student_id AND user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage all fee payments" ON public.fee_payments
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    ));

-- Create RLS policies for announcements
CREATE POLICY "Students can view relevant announcements" ON public.announcements
    FOR SELECT USING (
        is_general = true OR 
        target_level = (
            SELECT level FROM public.students WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage announcements" ON public.announcements
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    ));

-- Create function to calculate grade and grade point
CREATE OR REPLACE FUNCTION public.calculate_grade(total_score INTEGER)
RETURNS TABLE(grade TEXT, grade_point DECIMAL(3,2))
LANGUAGE plpgsql
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

-- Create trigger to auto-update grade and grade_point
CREATE OR REPLACE FUNCTION public.update_result_grade()
RETURNS TRIGGER
LANGUAGE plpgsql
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

CREATE TRIGGER update_result_grade_trigger
    BEFORE INSERT OR UPDATE ON public.results
    FOR EACH ROW
    EXECUTE FUNCTION public.update_result_grade();

-- Create trigger to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON public.admins
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_payments_updated_at
    BEFORE UPDATE ON public.fee_payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();