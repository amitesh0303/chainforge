export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          wallet_address: string | null;
          google_id: string | null;
          username: string | null;
          avatar_url: string | null;
          elo_rating: number;
          total_xp: number;
          current_streak: number;
          longest_streak: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      problems: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          difficulty: 'easy' | 'medium' | 'hard';
          chain: 'evm' | 'solana' | 'move';
          initial_code: string;
          test_cases: Json;
          xp_reward: number;
          tags: string[] | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['problems']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['problems']['Insert']>;
      };
      submissions: {
        Row: {
          id: string;
          user_id: string;
          problem_id: string;
          code: string;
          status: 'pending' | 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'compilation_error' | 'runtime_error';
          execution_time_ms: number | null;
          gas_used: number | null;
          earned_xp: number | null;
          submitted_at: string;
        };
        Insert: Omit<Database['public']['Tables']['submissions']['Row'], 'id' | 'submitted_at'>;
        Update: Partial<Database['public']['Tables']['submissions']['Insert']>;
      };
      contests: {
        Row: {
          id: string;
          title: string;
          start_time: string;
          duration_minutes: number;
          problem_ids: string[];
          status: 'upcoming' | 'active' | 'completed';
        };
        Insert: Omit<Database['public']['Tables']['contests']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['contests']['Insert']>;
      };
      contest_participants: {
        Row: {
          id: string;
          contest_id: string;
          user_id: string;
          score: number;
          problems_solved: number;
          rating_change: number | null;
        };
        Insert: Omit<Database['public']['Tables']['contest_participants']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['contest_participants']['Insert']>;
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_type: string;
          minted_at: string;
          token_id: string | null;
        };
        Insert: Omit<Database['public']['Tables']['user_badges']['Row'], 'id' | 'minted_at'>;
        Update: Partial<Database['public']['Tables']['user_badges']['Insert']>;
      };
    };
  };
}
