import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  GraduationCap, 
  ArrowLeft, 
  Upload, 
  Download, 
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Save
} from "lucide-react";
import Papa from 'papaparse';

interface CSVRow {
  matric_number: string;
  course_code: string;
  ca_score: string;
  exam_score: string;
  session: string;
}

interface ProcessedResult {
  student_id?: string;
  course_id?: string;
  matric_number: string;
  course_code: string;
  ca_score: number;
  exam_score: number;
  total_score: number;
  session: string;
  status: 'valid' | 'error';
  error_message?: string;
}

const AdminBulkUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [processedResults, setProcessedResults] = useState<ProcessedResult[]>([]);
  const [validResults, setValidResults] = useState<ProcessedResult[]>([]);
  const [errors, setErrors] = useState<ProcessedResult[]>([]);

  const downloadTemplate = () => {
    const templateData = [
      {
        matric_number: 'ND/CS/2024/001',
        course_code: 'CSC101',
        ca_score: '20',
        exam_score: '45',
        session: '2024/2025'
      },
      {
        matric_number: 'ND/CS/2024/002',
        course_code: 'CSC101',
        ca_score: '25',
        exam_score: '50',
        session: '2024/2025'
      }
    ];

    const csv = Papa.unparse(templateData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: "Use this template to format your results data",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data as CSVRow[];
        const filteredData = data.filter(row => 
          row.matric_number && row.course_code && row.ca_score && row.exam_score
        );
        setCsvData(filteredData);
        processResults(filteredData);
      },
      error: (error) => {
        toast({
          title: "File Error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const processResults = async (data: CSVRow[]) => {
    setLoading(true);

    try {
      const processed: ProcessedResult[] = [];

      for (const row of data) {
        const result: ProcessedResult = {
          matric_number: row.matric_number.trim(),
          course_code: row.course_code.trim(),
          ca_score: parseInt(row.ca_score) || 0,
          exam_score: parseInt(row.exam_score) || 0,
          total_score: (parseInt(row.ca_score) || 0) + (parseInt(row.exam_score) || 0),
          session: row.session.trim() || '2024/2025',
          status: 'valid'
        };

        // Validate scores
        if (result.ca_score < 0 || result.ca_score > 30) {
          result.status = 'error';
          result.error_message = 'CA score must be between 0 and 30';
        } else if (result.exam_score < 0 || result.exam_score > 70) {
          result.status = 'error';
          result.error_message = 'Exam score must be between 0 and 70';
        } else {
          // Find student
          const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select('id')
            .eq('matric_number', result.matric_number)
            .single();

          if (studentError || !studentData) {
            result.status = 'error';
            result.error_message = 'Student not found';
          } else {
            result.student_id = studentData.id;

            // Find course
            const { data: courseData, error: courseError } = await supabase
              .from('courses')
              .select('id')
              .eq('course_code', result.course_code)
              .single();

            if (courseError || !courseData) {
              result.status = 'error';
              result.error_message = 'Course not found';
            } else {
              result.course_id = courseData.id;
            }
          }
        }

        processed.push(result);
      }

      setProcessedResults(processed);
      setValidResults(processed.filter(r => r.status === 'valid'));
      setErrors(processed.filter(r => r.status === 'error'));

    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process the uploaded file",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveValidResults = async () => {
    if (validResults.length === 0) {
      toast({
        title: "No Valid Results",
        description: "Please fix errors before saving",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const resultsToInsert = validResults.map(result => ({
        student_id: result.student_id!,
        course_id: result.course_id!,
        ca_score: result.ca_score,
        exam_score: result.exam_score,
        total_score: result.total_score,
        session: result.session
      }));

      const { error } = await supabase
        .from('results')
        .insert(resultsToInsert);

      if (error) {
        toast({
          title: "Save Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Results Saved",
        description: `Successfully saved ${validResults.length} results`,
      });

      // Reset state
      setCsvData([]);
      setProcessedResults([]);
      setValidResults([]);
      setErrors([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/admin/dashboard")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Dashboard
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Bulk Upload Results</h1>
                <p className="text-sm text-muted-foreground">Import results from CSV file</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={downloadTemplate} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
              {validResults.length > 0 && (
                <Button onClick={saveValidResults} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : `Save ${validResults.length} Results`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Upload Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Upload CSV File
            </CardTitle>
            <CardDescription>
              Upload a CSV file containing student results. Download the template to see the required format.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>CSV Format Requirements:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Columns: matric_number, course_code, ca_score, exam_score, session</li>
                    <li>CA scores should be between 0-30</li>
                    <li>Exam scores should be between 0-70</li>
                    <li>Student matric numbers and course codes must exist in the system</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-background hover:bg-accent/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">CSV files only</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {processedResults.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{processedResults.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valid Records</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{validResults.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Errors</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{errors.length}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Table */}
        {processedResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Processed Results</CardTitle>
              <CardDescription>
                Review the processed results before saving. Fix any errors shown below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Matric Number</TableHead>
                    <TableHead>Course Code</TableHead>
                    <TableHead className="text-center">CA Score</TableHead>
                    <TableHead className="text-center">Exam Score</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge 
                          variant={result.status === 'valid' ? 'default' : 'destructive'}
                        >
                          {result.status === 'valid' ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Valid
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Error
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{result.matric_number}</TableCell>
                      <TableCell className="font-mono">{result.course_code}</TableCell>
                      <TableCell className="text-center">{result.ca_score}</TableCell>
                      <TableCell className="text-center">{result.exam_score}</TableCell>
                      <TableCell className="text-center font-semibold">{result.total_score}</TableCell>
                      <TableCell>{result.session}</TableCell>
                      <TableCell className="text-red-600 text-sm">
                        {result.error_message || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminBulkUpload;