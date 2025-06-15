export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: number
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: number
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: number
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      call_logs: {
        Row: {
          agent_id: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          lead_id: number | null
          notes: string | null
          phone_number: string | null
          status: Database["public"]["Enums"]["call_status"]
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          lead_id?: number | null
          notes?: string | null
          phone_number?: string | null
          status: Database["public"]["Enums"]["call_status"]
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          lead_id?: number | null
          notes?: string | null
          phone_number?: string | null
          status?: Database["public"]["Enums"]["call_status"]
        }
        Relationships: [
          {
            foreignKeyName: "call_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_permissions: {
        Row: {
          created_at: string
          group_id: string
          permission_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          permission_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          permission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_permissions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          agent_id: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          notes: string | null
          phone_number: string
          status: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          phone_number: string
          status?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          phone_number?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          sip_number: string | null
          sip_password: string | null
          updated_at: string
          username: string | null
          webrtc_number: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          sip_number?: string | null
          sip_password?: string | null
          updated_at?: string
          username?: string | null
          webrtc_number?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          sip_number?: string | null
          sip_password?: string | null
          updated_at?: string
          username?: string | null
          webrtc_number?: string | null
        }
        Relationships: []
      }
      remote_db_integration: {
        Row: {
          created_at: string
          db_name: string
          db_password: string
          db_user: string
          host: string
          id: string
          port: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          db_name: string
          db_password: string
          db_user: string
          host: string
          id?: string
          port: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          db_name?: string
          db_password?: string
          db_user?: string
          host?: string
          id?: string
          port?: number
          updated_at?: string
        }
        Relationships: []
      }
      sip_integration: {
        Row: {
          ami_host: string | null
          ami_port: number | null
          ami_secret: string | null
          ami_user: string | null
          created_at: string
          id: string
          sip_password: string | null
          sip_protocol: string
          sip_server_domain: string
          sip_server_port: number
          sip_username: string | null
          updated_at: string
        }
        Insert: {
          ami_host?: string | null
          ami_port?: number | null
          ami_secret?: string | null
          ami_user?: string | null
          created_at?: string
          id?: string
          sip_password?: string | null
          sip_protocol: string
          sip_server_domain: string
          sip_server_port: number
          sip_username?: string | null
          updated_at?: string
        }
        Update: {
          ami_host?: string | null
          ami_port?: number | null
          ami_secret?: string | null
          ami_user?: string | null
          created_at?: string
          id?: string
          sip_password?: string | null
          sip_protocol?: string
          sip_server_domain?: string
          sip_server_port?: number
          sip_username?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sip_trunks: {
        Row: {
          allow_codecs: string[] | null
          created_at: string
          dtmf_mode: string
          from_domain: string | null
          from_user: string | null
          host: string
          id: string
          insecure: string[] | null
          is_active: boolean
          nat: string
          port: number
          protocol: string
          qualify: boolean
          registration: string
          secret: string | null
          trunk_name: string
          updated_at: string
          username: string | null
        }
        Insert: {
          allow_codecs?: string[] | null
          created_at?: string
          dtmf_mode?: string
          from_domain?: string | null
          from_user?: string | null
          host: string
          id?: string
          insecure?: string[] | null
          is_active?: boolean
          nat?: string
          port?: number
          protocol?: string
          qualify?: boolean
          registration?: string
          secret?: string | null
          trunk_name: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          allow_codecs?: string[] | null
          created_at?: string
          dtmf_mode?: string
          from_domain?: string | null
          from_user?: string | null
          host?: string
          id?: string
          insecure?: string[] | null
          is_active?: boolean
          nat?: string
          port?: number
          protocol?: string
          qualify?: boolean
          registration?: string
          secret?: string | null
          trunk_name?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      system_health_logs: {
        Row: {
          component: string
          created_at: string
          details: string | null
          id: number
          status: Database["public"]["Enums"]["health_status"]
        }
        Insert: {
          component: string
          created_at?: string
          details?: string | null
          id?: number
          status: Database["public"]["Enums"]["health_status"]
        }
        Update: {
          component?: string
          created_at?: string
          details?: string | null
          id?: number
          status?: Database["public"]["Enums"]["health_status"]
        }
        Relationships: []
      }
      user_groups: {
        Row: {
          created_at: string
          group_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vicidial_integration: {
        Row: {
          api_password: string
          api_user: string
          created_at: string
          id: string
          ports: string | null
          updated_at: string
          vicidial_domain: string
        }
        Insert: {
          api_password: string
          api_user: string
          created_at?: string
          id?: string
          ports?: string | null
          updated_at?: string
          vicidial_domain: string
        }
        Update: {
          api_password?: string
          api_user?: string
          created_at?: string
          id?: string
          ports?: string | null
          updated_at?: string
          vicidial_domain?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_agent_call_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          status_name: Database["public"]["Enums"]["call_status"]
          status_count: number
        }[]
      }
      get_agent_lead_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          new_leads_today: number
          leads_in_progress: number
          leads_converted: number
          avg_handle_time_seconds: number
        }[]
      }
      get_agent_weekly_call_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          day_of_week: string
          calls_count: number
        }[]
      }
      get_users_for_management: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          full_name: string
          roles: Database["public"]["Enums"]["app_role"][]
          groups: string[]
          sip_number: string
          webrtc_number: string
          sip_password: string
        }[]
      }
      grant_admin_to_self: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: {
          p_user_id: string
          p_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_user_supervisor_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_user_details: {
        Args: {
          p_user_id: string
          p_full_name: string
          p_sip_number: string
          p_webrtc_number: string
          p_sip_password: string
          p_roles: Database["public"]["Enums"]["app_role"][]
          p_group_ids: string[]
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "agent" | "supervisor" | "admin"
      call_status: "ANSWERED" | "ABANDONED" | "MISSED" | "FAILED" | "IN_QUEUE"
      health_status: "ok" | "warning" | "error"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["agent", "supervisor", "admin"],
      call_status: ["ANSWERED", "ABANDONED", "MISSED", "FAILED", "IN_QUEUE"],
      health_status: ["ok", "warning", "error"],
    },
  },
} as const
