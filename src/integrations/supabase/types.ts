export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          department: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          role: string | null
          staff_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          role?: string | null
          staff_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: string | null
          staff_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          is_general: boolean | null
          target_level: Database["public"]["Enums"]["student_level"] | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          is_general?: boolean | null
          target_level?: Database["public"]["Enums"]["student_level"] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          is_general?: boolean | null
          target_level?: Database["public"]["Enums"]["student_level"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          course_code: string
          course_title: string
          created_at: string
          credit_unit: number
          department: string | null
          id: string
          level: Database["public"]["Enums"]["student_level"]
          semester: Database["public"]["Enums"]["semester"]
        }
        Insert: {
          course_code: string
          course_title: string
          created_at?: string
          credit_unit: number
          department?: string | null
          id?: string
          level: Database["public"]["Enums"]["student_level"]
          semester: Database["public"]["Enums"]["semester"]
        }
        Update: {
          course_code?: string
          course_title?: string
          created_at?: string
          credit_unit?: number
          department?: string | null
          id?: string
          level?: Database["public"]["Enums"]["student_level"]
          semester?: Database["public"]["Enums"]["semester"]
        }
        Relationships: []
      }
      fee_payments: {
        Row: {
          amount_due: number
          amount_paid: number | null
          created_at: string
          id: string
          level: Database["public"]["Enums"]["student_level"]
          payment_date: string | null
          reference_number: string | null
          semester: Database["public"]["Enums"]["semester"]
          session: string
          status: Database["public"]["Enums"]["fee_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          amount_due: number
          amount_paid?: number | null
          created_at?: string
          id?: string
          level: Database["public"]["Enums"]["student_level"]
          payment_date?: string | null
          reference_number?: string | null
          semester: Database["public"]["Enums"]["semester"]
          session: string
          status?: Database["public"]["Enums"]["fee_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["student_level"]
          payment_date?: string | null
          reference_number?: string | null
          semester?: Database["public"]["Enums"]["semester"]
          session?: string
          status?: Database["public"]["Enums"]["fee_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          ca_score: number | null
          course_id: string
          created_at: string
          exam_score: number | null
          grade: string | null
          grade_point: number | null
          id: string
          session: string
          student_id: string
          total_score: number | null
          updated_at: string
        }
        Insert: {
          ca_score?: number | null
          course_id: string
          created_at?: string
          exam_score?: number | null
          grade?: string | null
          grade_point?: number | null
          id?: string
          session: string
          student_id: string
          total_score?: number | null
          updated_at?: string
        }
        Update: {
          ca_score?: number | null
          course_id?: string
          created_at?: string
          exam_score?: number | null
          grade?: string | null
          grade_point?: number | null
          id?: string
          session?: string
          student_id?: string
          total_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "results_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          created_at: string
          date_of_birth: string | null
          department: string | null
          email: string
          faculty: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          level: Database["public"]["Enums"]["student_level"]
          lga: string | null
          matric_number: string
          middle_name: string | null
          password_changed: boolean | null
          phone: string | null
          state_of_origin: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          email: string
          faculty?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          level: Database["public"]["Enums"]["student_level"]
          lga?: string | null
          matric_number: string
          middle_name?: string | null
          password_changed?: boolean | null
          phone?: string | null
          state_of_origin?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          email?: string
          faculty?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          level?: Database["public"]["Enums"]["student_level"]
          lga?: string | null
          matric_number?: string
          middle_name?: string | null
          password_changed?: boolean | null
          phone?: string | null
          state_of_origin?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_grade: {
        Args: { total_score: number }
        Returns: {
          grade: string
          grade_point: number
        }[]
      }
      ensure_admin_auth: {
        Args: { admin_email: string; admin_password: string }
        Returns: string
      }
      verify_admin_login: {
        Args: { admin_email: string; admin_password: string }
        Returns: boolean
      }
    }
    Enums: {
      fee_status: "paid" | "unpaid" | "partial"
      semester: "First" | "Second"
      student_level: "ND1" | "ND2"
      user_role: "student" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      fee_status: ["paid", "unpaid", "partial"],
      semester: ["First", "Second"],
      student_level: ["ND1", "ND2"],
      user_role: ["student", "admin"],
    },
  },
} as const
