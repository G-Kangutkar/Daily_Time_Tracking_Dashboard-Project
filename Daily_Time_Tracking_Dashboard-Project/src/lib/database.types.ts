export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          activity_name: string;
          category: string;
          duration_minutes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          activity_name: string;
          category: string;
          duration_minutes: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          activity_name?: string;
          category?: string;
          duration_minutes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Activity = Database['public']['Tables']['activities']['Row'];
