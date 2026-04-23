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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          actor_user_id: string | null
          created_at: string
          enterprise_id: string | null
          event_type: Database["public"]["Enums"]["analytics_event_type"]
          id: string
          metadata: Json
          product_id: string | null
          service_id: string | null
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          enterprise_id?: string | null
          event_type: Database["public"]["Enums"]["analytics_event_type"]
          id?: string
          metadata?: Json
          product_id?: string | null
          service_id?: string | null
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          enterprise_id?: string | null
          event_type?: Database["public"]["Enums"]["analytics_event_type"]
          id?: string
          metadata?: Json
          product_id?: string | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "enterprise_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "enterprise_services"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          message: string
          sender_user_id: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          message: string
          sender_user_id: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          message?: string
          sender_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string
          created_by_user_id: string
          enterprise_id: string | null
          id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by_user_id: string
          enterprise_id?: string | null
          id?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string
          enterprise_id?: string | null
          id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_requests_to_city_admin: {
        Row: {
          created_at: string
          enterprise_id: string | null
          id: string
          message: string
          sender_email: string
          sender_name: string
          sender_phone: string | null
          sender_user_id: string
          status: Database["public"]["Enums"]["contact_request_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          enterprise_id?: string | null
          id?: string
          message: string
          sender_email: string
          sender_name: string
          sender_phone?: string | null
          sender_user_id: string
          status?: Database["public"]["Enums"]["contact_request_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          enterprise_id?: string | null
          id?: string
          message?: string
          sender_email?: string
          sender_name?: string
          sender_phone?: string | null
          sender_user_id?: string
          status?: Database["public"]["Enums"]["contact_request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_to_city_admin_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_branches: {
        Row: {
          address: string
          branch_name: string
          created_at: string
          enterprise_id: string
          id: string
          map_url: string | null
          phone: string | null
          updated_at: string
          working_hours: string | null
        }
        Insert: {
          address: string
          branch_name: string
          created_at?: string
          enterprise_id: string
          id?: string
          map_url?: string | null
          phone?: string | null
          updated_at?: string
          working_hours?: string | null
        }
        Update: {
          address?: string
          branch_name?: string
          created_at?: string
          enterprise_id?: string
          id?: string
          map_url?: string | null
          phone?: string | null
          updated_at?: string
          working_hours?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_branches_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_products: {
        Row: {
          category: string | null
          created_at: string
          currency: string
          enterprise_id: string
          id: string
          image_url: string | null
          is_active: boolean
          price: number | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          currency?: string
          enterprise_id: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          price?: number | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          currency?: string
          enterprise_id?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          price?: number | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_products_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_services: {
        Row: {
          category: string | null
          created_at: string
          enterprise_id: string
          id: string
          is_active: boolean
          price_from: number | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          enterprise_id: string
          id?: string
          is_active?: boolean
          price_from?: number | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          enterprise_id?: string
          id?: string
          is_active?: boolean
          price_from?: number | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_services_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprises: {
        Row: {
          activity_description: string | null
          address: string | null
          categories: string[]
          cover_image_url: string | null
          created_at: string
          email: string | null
          google_map_url: string | null
          id: string
          is_featured: boolean
          logo_url: string | null
          name: string
          owner_user_id: string
          phone: string | null
          service_mode: Database["public"]["Enums"]["service_mode"]
          short_summary: string | null
          slug: string
          social_links: Json
          status: Database["public"]["Enums"]["enterprise_status"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          activity_description?: string | null
          address?: string | null
          categories?: string[]
          cover_image_url?: string | null
          created_at?: string
          email?: string | null
          google_map_url?: string | null
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          name: string
          owner_user_id: string
          phone?: string | null
          service_mode?: Database["public"]["Enums"]["service_mode"]
          short_summary?: string | null
          slug: string
          social_links?: Json
          status?: Database["public"]["Enums"]["enterprise_status"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          activity_description?: string | null
          address?: string | null
          categories?: string[]
          cover_image_url?: string | null
          created_at?: string
          email?: string | null
          google_map_url?: string | null
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          name?: string
          owner_user_id?: string
          phone?: string | null
          service_mode?: Database["public"]["Enums"]["service_mode"]
          short_summary?: string | null
          slug?: string
          social_links?: Json
          status?: Database["public"]["Enums"]["enterprise_status"]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      loyalty_programs: {
        Row: {
          benefit_type: string | null
          benefit_value: string | null
          created_at: string
          enterprise_id: string
          id: string
          summary: string | null
          terms: string | null
          tier_name: string | null
          title: string
          updated_at: string
        }
        Insert: {
          benefit_type?: string | null
          benefit_value?: string | null
          created_at?: string
          enterprise_id: string
          id?: string
          summary?: string | null
          terms?: string | null
          tier_name?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          benefit_type?: string | null
          benefit_value?: string | null
          created_at?: string
          enterprise_id?: string
          id?: string
          summary?: string | null
          terms?: string | null
          tier_name?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_programs_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
        ]
      }
      news_items: {
        Row: {
          author_user_id: string | null
          content: string | null
          created_at: string
          event_date: string | null
          id: string
          image_url: string | null
          is_event: boolean
          published: boolean
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_user_id?: string | null
          content?: string | null
          created_at?: string
          event_date?: string | null
          id?: string
          image_url?: string | null
          is_event?: boolean
          published?: boolean
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_user_id?: string | null
          content?: string | null
          created_at?: string
          event_date?: string | null
          id?: string
          image_url?: string | null
          is_event?: boolean
          published?: boolean
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      partnership_offers: {
        Row: {
          created_at: string
          created_by_user_id: string
          cta_note: string | null
          id: string
          partnership_type: string | null
          source_enterprise_id: string
          status: Database["public"]["Enums"]["partnership_status"]
          summary: string
          target_enterprise_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by_user_id: string
          cta_note?: string | null
          id?: string
          partnership_type?: string | null
          source_enterprise_id: string
          status?: Database["public"]["Enums"]["partnership_status"]
          summary: string
          target_enterprise_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string
          cta_note?: string | null
          id?: string
          partnership_type?: string | null
          source_enterprise_id?: string
          status?: Database["public"]["Enums"]["partnership_status"]
          summary?: string
          target_enterprise_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnership_offers_source_enterprise_id_fkey"
            columns: ["source_enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnership_offers_target_enterprise_id_fkey"
            columns: ["target_enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          job_title: string | null
          phone: string | null
          preferred_language: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          role?: Database["public"]["Enums"]["app_role"]
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
      analytics_event_type:
        | "enterprise_view"
        | "product_view"
        | "service_view"
        | "partnership_click"
        | "chat_started"
        | "contact_sent"
      app_role: "admin" | "moderator" | "user"
      contact_request_status: "new" | "in_progress" | "resolved"
      enterprise_status: "draft" | "published" | "archived"
      partnership_status: "suggested" | "requested" | "accepted" | "declined"
      service_mode: "service_provider" | "product_manufacturer" | "both"
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
      analytics_event_type: [
        "enterprise_view",
        "product_view",
        "service_view",
        "partnership_click",
        "chat_started",
        "contact_sent",
      ],
      app_role: ["admin", "moderator", "user"],
      contact_request_status: ["new", "in_progress", "resolved"],
      enterprise_status: ["draft", "published", "archived"],
      partnership_status: ["suggested", "requested", "accepted", "declined"],
      service_mode: ["service_provider", "product_manufacturer", "both"],
    },
  },
} as const
