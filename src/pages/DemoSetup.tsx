import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DemoSetup() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ step: string; success: boolean }[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const addStatus = (step: string, success: boolean) => {
    setStatus(prev => [...prev, { step, success }]);
  };

  const setupDemo = async () => {
    setLoading(true);
    setStatus([]);

    try {
      // Create demo admin
      addStatus('Creating demo admin account...', true);
      const { data: adminAuth, error: adminAuthError } = await supabase.auth.admin.createUser({
        email: 'demo.admin@plasu.edu.ng',
        password: 'demo123',
        email_confirm: true,
        user_metadata: { full_name: 'Demo Administrator' }
      });

      if (adminAuthError) {
        addStatus('Demo admin creation failed', false);
        throw adminAuthError;
      }

      const { error: adminError } = await supabase.from('admins').insert({
        user_id: adminAuth.user.id,
        first_name: 'Demo',
        last_name: 'Administrator',
        email: 'demo.admin@plasu.edu.ng',
        staff_id: 'PLASU-ADMIN-001',
        department: 'Computer Science',
        role: 'Super Admin'
      });

      if (adminError) throw adminError;
      addStatus('Demo admin created successfully', true);

      // Create demo student 1 (ND1)
      addStatus('Creating demo student 1 (ND1)...', true);
      const { data: student1Auth, error: student1AuthError } = await supabase.auth.admin.createUser({
        email: 'john.doe@student.plasu.edu.ng',
        password: '2233',
        email_confirm: true,
        user_metadata: { full_name: 'John Emeka Doe' }
      });

      if (student1AuthError) throw student1AuthError;

      const { error: student1Error, data: student1Data } = await supabase.from('students').insert({
        user_id: student1Auth.user.id,
        matric_number: 'PLASU/CS/ND1/2024/001',
        first_name: 'John Emeka',
        last_name: 'Doe',
        email: 'john.doe@student.plasu.edu.ng',
        phone_number: '08123456789',
        level: 'ND1',
        password_changed: false
      }).select().single();

      if (student1Error) throw student1Error;
      addStatus('Demo student 1 created successfully', true);

      // Create demo student 2 (ND2)
      addStatus('Creating demo student 2 (ND2)...', true);
      const { data: student2Auth, error: student2AuthError } = await supabase.auth.admin.createUser({
        email: 'sarah.johnson@student.plasu.edu.ng',
        password: '2233',
        email_confirm: true,
        user_metadata: { full_name: 'Sarah Kemi Johnson' }
      });

      if (student2AuthError) throw student2AuthError;

      const { error: student2Error, data: student2Data } = await supabase.from('students').insert({
        user_id: student2Auth.user.id,
        matric_number: 'PLASU/CS/ND2/2023/002',
        first_name: 'Sarah Kemi',
        last_name: 'Johnson',
        email: 'sarah.johnson@student.plasu.edu.ng',
        phone_number: '08198765432',
        level: 'ND2',
        password_changed: false
      }).select().single();

      if (student2Error) throw student2Error;
      addStatus('Demo student 2 created successfully', true);

      // Create sample courses
      addStatus('Creating sample courses...', true);
      const { error: coursesError } = await supabase.from('courses').insert([
        { course_code: 'CSC101', course_title: 'Introduction to Computer Science', credit_unit: 3, level: 'ND1', semester: 'First' },
        { course_code: 'CSC102', course_title: 'Computer Programming I', credit_unit: 4, level: 'ND1', semester: 'First' },
        { course_code: 'MTH101', course_title: 'General Mathematics I', credit_unit: 3, level: 'ND1', semester: 'First' },
        { course_code: 'CSC103', course_title: 'Computer Programming II', credit_unit: 4, level: 'ND1', semester: 'Second' },
        { course_code: 'CSC104', course_title: 'Data Structures', credit_unit: 3, level: 'ND1', semester: 'Second' },
        { course_code: 'MTH102', course_title: 'General Mathematics II', credit_unit: 3, level: 'ND1', semester: 'Second' },
        { course_code: 'CSC201', course_title: 'Database Management Systems', credit_unit: 4, level: 'ND2', semester: 'First' },
        { course_code: 'CSC202', course_title: 'Web Technologies', credit_unit: 3, level: 'ND2', semester: 'First' },
        { course_code: 'CSC203', course_title: 'Operating Systems', credit_unit: 3, level: 'ND2', semester: 'First' },
        { course_code: 'CSC204', course_title: 'Software Engineering', credit_unit: 4, level: 'ND2', semester: 'Second' },
        { course_code: 'CSC205', course_title: 'Network Fundamentals', credit_unit: 3, level: 'ND2', semester: 'Second' },
        { course_code: 'CSC206', course_title: 'Project', credit_unit: 6, level: 'ND2', semester: 'Second' }
      ]);

      if (coursesError) throw coursesError;
      addStatus('Sample courses created successfully', true);

      // Get course IDs
      const { data: courses } = await supabase.from('courses').select('id, course_code');

      // Create fee payments
      addStatus('Creating fee payment records...', true);
      const { error: feeError } = await supabase.from('fee_payments').insert([
        { student_id: student1Data.id, level: 'ND1', semester: 'First', session: '2024/2025', amount_due: 50000.00, amount_paid: 50000.00, payment_date: new Date().toISOString(), status: 'paid' },
        { student_id: student1Data.id, level: 'ND1', semester: 'Second', session: '2024/2025', amount_due: 50000.00, amount_paid: 50000.00, payment_date: new Date().toISOString(), status: 'paid' },
        { student_id: student2Data.id, level: 'ND2', semester: 'First', session: '2023/2024', amount_due: 50000.00, amount_paid: 0, payment_date: null, status: 'unpaid' }
      ]);

      if (feeError) throw feeError;
      addStatus('Fee payment records created successfully', true);

      // Create results
      addStatus('Creating sample results...', true);
      const csc101 = courses?.find(c => c.course_code === 'CSC101');
      const csc102 = courses?.find(c => c.course_code === 'CSC102');
      const mth101 = courses?.find(c => c.course_code === 'MTH101');
      const csc201 = courses?.find(c => c.course_code === 'CSC201');
      const csc202 = courses?.find(c => c.course_code === 'CSC202');
      const csc203 = courses?.find(c => c.course_code === 'CSC203');

      const { error: resultsError } = await supabase.from('results').insert([
        { student_id: student1Data.id, course_id: csc101?.id, session: '2024/2025', ca_score: 25, exam_score: 50, total_score: 75, grade: 'A', grade_point: 5 },
        { student_id: student1Data.id, course_id: csc102?.id, session: '2024/2025', ca_score: 22, exam_score: 46, total_score: 68, grade: 'B', grade_point: 4 },
        { student_id: student1Data.id, course_id: mth101?.id, session: '2024/2025', ca_score: 28, exam_score: 54, total_score: 82, grade: 'A', grade_point: 5 },
        { student_id: student2Data.id, course_id: csc201?.id, session: '2023/2024', ca_score: 15, exam_score: 20, total_score: 35, grade: 'F', grade_point: 0 },
        { student_id: student2Data.id, course_id: csc202?.id, session: '2023/2024', ca_score: 24, exam_score: 46, total_score: 70, grade: 'B', grade_point: 4 },
        { student_id: student2Data.id, course_id: csc203?.id, session: '2023/2024', ca_score: 22, exam_score: 43, total_score: 65, grade: 'C', grade_point: 3 }
      ]);

      if (resultsError) throw resultsError;
      addStatus('Sample results created successfully', true);

      // Create announcements
      addStatus('Creating sample announcements...', true);
      const { error: announcementsError } = await supabase.from('announcements').insert([
        { 
          title: 'Welcome to 2024/2025 Academic Session', 
          content: 'All students are welcome to the new academic session. Classes commence on Monday, September 18th, 2025.', 
          is_general: true,
          created_by: adminAuth.user.id
        },
        { 
          title: 'ND1 Students: Course Registration', 
          content: 'ND1 students are required to complete their course registration before September 30th, 2025.', 
          target_level: 'ND1',
          is_general: false,
          created_by: adminAuth.user.id
        },
        { 
          title: 'ND2 Project Submission Deadline', 
          content: 'ND2 students must submit their final year projects by December 15th, 2025.', 
          target_level: 'ND2',
          is_general: false,
          created_by: adminAuth.user.id
        }
      ]);

      if (announcementsError) throw announcementsError;
      addStatus('Sample announcements created successfully', true);

      toast({
        title: "Demo Setup Complete!",
        description: "All demo accounts and data have been created successfully.",
      });

      setTimeout(() => navigate('/'), 2000);

    } catch (error: any) {
      console.error('Demo setup error:', error);
      toast({
        title: "Setup Failed",
        description: error.message || "An error occurred during demo setup.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Demo Setup</h1>
          <p className="text-muted-foreground">
            Click the button below to create demo accounts and sample data
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Demo Credentials:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Admin:</strong><br />
                Email: demo.admin@plasu.edu.ng<br />
                Password: demo123
              </div>
              <div>
                <strong>Student 1 (ND1 - Fees Paid):</strong><br />
                Email: john.doe@student.plasu.edu.ng<br />
                Matric: PLASU/CS/ND1/2024/001<br />
                PIN: 2233
              </div>
              <div>
                <strong>Student 2 (ND2 - Fees Unpaid):</strong><br />
                Email: sarah.johnson@student.plasu.edu.ng<br />
                Matric: PLASU/CS/ND2/2023/002<br />
                PIN: 2233
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={setupDemo} 
          disabled={loading}
          className="w-full mb-6"
          size="lg"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Setting up demo data...' : 'Create Demo Data'}
        </Button>

        {status.length > 0 && (
          <div className="space-y-2 bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
            {status.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {item.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>{item.step}</span>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="w-full mt-4"
        >
          Back to Home
        </Button>
      </Card>
    </div>
  );
}
