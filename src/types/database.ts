// Database types for Jo Terapeuta Capilar platform

export type UserRole = "admin" | "client";
export type ClientStatus = "com_marcacao" | "sem_marcacao";

// Update category types with semantic color mapping
export type UpdateCategory =
  | 'evolucao'      // Verde (success), TrendingUp icon
  | 'rotina'        // Azul (info), Calendar icon
  | 'recomendacao'  // Rose-gold (accent), Lightbulb icon
  | 'agendamento'   // Amarelo (warning), Clock icon
  | 'outro';        // Cinza (default), FileText icon

// Reaction types for client updates
export type ReactionType = 'like' | 'celebrate' | 'helpful' | 'question';

// Emoji mapping for reactions
export const REACTION_EMOJI: Record<ReactionType, string> = {
  like: '❤️',
  celebrate: '🎉',
  helpful: '💡',
  question: '❓'
};

export const REACTION_LABEL: Record<ReactionType, string> = {
  like: 'Gostei',
  celebrate: 'Parabéns',
  helpful: 'Útil',
  question: 'Dúvida'
};

export interface Profile {
    id: string;
    role: UserRole;
    name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    notes: string | null; // Admin notes (only visible to admin)
    first_visit_date: string | null;
    last_appointment_date: string | null;
    next_appointment_date: string | null;
    email_notifications: boolean; // Whether user wants email notifications
    created_at: string;
    updated_at: string;
}

export interface Appointment {
    id: string;
    client_id: string;
    appointment_date: string;
    appointment_type: string;
    notes: string | null;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface ClientUpdate {
    id: string;
    client_id: string;
    admin_id: string;
    title: string;
    content: string;
    category: UpdateCategory; // Required field with default 'outro'
    client_read_at?: string | null;
    client_liked?: boolean;
    created_at: string;
    // Joined data
    attachments?: Attachment[];
    admin?: Pick<Profile, "name" | "avatar_url">;
}

export interface Attachment {
    id: string;
    update_id: string;
    file_url: string;
    file_name: string;
    file_type: "image" | "pdf";
    file_size: number | null;
    created_at: string;
}

export interface UpdateReaction {
    id: string;
    update_id: string;
    user_id: string;
    reaction: ReactionType;
    created_at: string;
}

export interface ReactionCount {
    reaction: ReactionType;
    count: number;
    user_reacted: boolean;
}

export interface Post {
    id: string;
    admin_id: string;
    title: string;
    content: string;
    image_url: string | null;
    published: boolean;
    created_at: string;
    updated_at: string;
    // Joined data
    admin?: Pick<Profile, "name" | "avatar_url">;
}

export interface BeforeAfterComparison {
    id: string;
    client_id: string;
    admin_id: string;
    before_image_url: string;
    before_date: string;
    before_label: string;
    after_image_url: string;
    after_date: string;
    after_label: string;
    title: string | null;
    description: string | null;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

// Database schema type for Supabase client
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, "created_at" | "updated_at">;
                Update: Partial<Omit<Profile, "id" | "created_at">>;
            };
            appointments: {
                Row: Appointment;
                Insert: Omit<Appointment, "id" | "created_at" | "updated_at">;
                Update: Partial<Omit<Appointment, "id" | "created_at">>;
            };
            client_updates: {
                Row: ClientUpdate;
                Insert: Omit<ClientUpdate, "id" | "created_at" | "attachments" | "admin">;
                Update: Partial<Omit<ClientUpdate, "id" | "created_at" | "attachments" | "admin">>;
            };
            attachments: {
                Row: Attachment;
                Insert: Omit<Attachment, "id" | "created_at">;
                Update: Partial<Omit<Attachment, "id" | "created_at">>;
            };
            posts: {
                Row: Post;
                Insert: Omit<Post, "id" | "created_at" | "updated_at" | "admin">;
                Update: Partial<Omit<Post, "id" | "created_at" | "admin">>;
            };
        };
    };
}
