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
      profiles: {
        Row: {
          id: string
          display_name: string | null
          timezone: string
          locale: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          timezone?: string
          locale?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          timezone?: string
          locale?: string
          updated_at?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          owner_id: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          owner_id: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          owner_id?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          organization_id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          organization_id: string
          user_id: string
          role?: string
          created_at?: string
        }
        Update: {
          organization_id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
        Relationships: []
      }
      activity_events: {
        Row: {
          id: string
          organization_id: string
          actor_user_id: string
          event_name: string
          entity_type: string | null
          entity_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          actor_user_id: string
          event_name: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          actor_user_id?: string
          event_name?: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          organization_id: string
          created_by_user_id: string
          full_name: string
          phone: string | null
          email: string | null
          preferred_contact_method: string | null
          status: string
          lead_source: string | null
          created_at: string
          updated_at: string
          archived_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          created_by_user_id: string
          full_name: string
          phone?: string | null
          email?: string | null
          preferred_contact_method?: string | null
          status?: string
          lead_source?: string | null
          created_at?: string
          updated_at?: string
          archived_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          created_by_user_id?: string
          full_name?: string
          phone?: string | null
          email?: string | null
          preferred_contact_method?: string | null
          status?: string
          lead_source?: string | null
          created_at?: string
          updated_at?: string
          archived_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      client_notes: {
        Row: {
          id: string
          organization_id: string
          client_id: string
          author_user_id: string
          body: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          client_id: string
          author_user_id: string
          body: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          client_id?: string
          author_user_id?: string
          body?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      create_organization: {
        Args: {
          p_name: string
          p_slug: string
          p_timezone?: string
        }
        Returns: Database['public']['Tables']['organizations']['Row']
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}