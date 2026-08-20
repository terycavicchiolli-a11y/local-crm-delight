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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          affected_record_id: string | null
          company_id: string | null
          details: string | null
          id: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          action: string
          affected_record_id?: string | null
          company_id?: string | null
          details?: string | null
          id?: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          action?: string
          affected_record_id?: string | null
          company_id?: string | null
          details?: string | null
          id?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          commercial_id: string
          company_id: string
          created_at: string | null
          document: string
          email: string | null
          id: string
          name: string
          notes: string | null
          origin: string | null
          partner_id: string | null
          phone: string
          status: string
          whatsapp: string
        }
        Insert: {
          address?: string | null
          commercial_id: string
          company_id: string
          created_at?: string | null
          document: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          origin?: string | null
          partner_id?: string | null
          phone: string
          status?: string
          whatsapp: string
        }
        Update: {
          address?: string | null
          commercial_id?: string
          company_id?: string
          created_at?: string | null
          document?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          origin?: string | null
          partner_id?: string | null
          phone?: string
          status?: string
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          company_id: string
          financial_id: string
          id: string
          payment_date: string | null
          process_id: string
          rate: number
          responsible_id: string
          status: string
          value: number
        }
        Insert: {
          company_id: string
          financial_id: string
          id?: string
          payment_date?: string | null
          process_id: string
          rate: number
          responsible_id: string
          status?: string
          value: number
        }
        Update: {
          company_id?: string
          financial_id?: string
          id?: string
          payment_date?: string | null
          process_id?: string
          rate?: number
          responsible_id?: string
          status?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "commissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_financial_id_fkey"
            columns: ["financial_id"]
            isOneToOne: false
            referencedRelation: "financials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          corporate_name: string
          created_at: string | null
          document: string
          email: string
          id: string
          phone: string | null
          status: string
          trade_name: string
        }
        Insert: {
          corporate_name: string
          created_at?: string | null
          document: string
          email: string
          id?: string
          phone?: string | null
          status?: string
          trade_name: string
        }
        Update: {
          corporate_name?: string
          created_at?: string | null
          document?: string
          email?: string
          id?: string
          phone?: string | null
          status?: string
          trade_name?: string
        }
        Relationships: []
      }
      financials: {
        Row: {
          company_id: string
          date: string
          id: string
          invoice_number: string | null
          invoice_url: string | null
          process_id: string
          status: string
          type: string
          value: number
        }
        Insert: {
          company_id: string
          date: string
          id?: string
          invoice_number?: string | null
          invoice_url?: string | null
          process_id: string
          status?: string
          type: string
          value: number
        }
        Update: {
          company_id?: string
          date?: string
          id?: string
          invoice_number?: string | null
          invoice_url?: string | null
          process_id?: string
          status?: string
          type?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "financials_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financials_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          category: string
          company_id: string | null
          content: string
          created_at: string | null
          id: string
          title: string
        }
        Insert: {
          category: string
          company_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          title: string
        }
        Update: {
          category?: string
          company_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          commission_agreement: string | null
          company_id: string
          contact: string
          email: string
          id: string
          name: string
          status: string
          type: string
        }
        Insert: {
          commission_agreement?: string | null
          company_id: string
          contact: string
          email: string
          id?: string
          name: string
          status?: string
          type: string
        }
        Update: {
          commission_agreement?: string | null
          company_id?: string
          contact?: string
          email?: string
          id?: string
          name?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "partners_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      processes: {
        Row: {
          client_id: string
          commercial_id: string
          company_id: string
          entry_date: string | null
          id: string
          last_move: string | null
          next_action: string | null
          notes: string | null
          partner_id: string | null
          status: string
          step: string
          value: number | null
        }
        Insert: {
          client_id: string
          commercial_id: string
          company_id: string
          entry_date?: string | null
          id?: string
          last_move?: string | null
          next_action?: string | null
          notes?: string | null
          partner_id?: string | null
          status: string
          step?: string
          value?: number | null
        }
        Update: {
          client_id?: string
          commercial_id?: string
          company_id?: string
          entry_date?: string | null
          id?: string
          last_move?: string | null
          next_action?: string | null
          notes?: string | null
          partner_id?: string | null
          status?: string
          step?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "processes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          last_access: string | null
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id: string
          last_access?: string | null
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          last_access?: string | null
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          client_id: string | null
          company_id: string
          completed_at: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          id: string
          priority: string
          process_id: string | null
          responsible_id: string
          status: string
          title: string
        }
        Insert: {
          client_id?: string | null
          company_id: string
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: string
          process_id?: string | null
          responsible_id: string
          status?: string
          title: string
        }
        Update: {
          client_id?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: string
          process_id?: string | null
          responsible_id?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          commission_rate: number | null
          company_id: string
          email: string
          id: string
          name: string
          phone: string | null
          role: string
          status: string
        }
        Insert: {
          commission_rate?: number | null
          company_id: string
          email: string
          id?: string
          name: string
          phone?: string | null
          role: string
          status?: string
        }
        Update: {
          commission_rate?: number | null
          company_id?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "OWNER" | "MASTER" | "COMMON"
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
      app_role: ["OWNER", "MASTER", "COMMON"],
    },
  },
} as const
