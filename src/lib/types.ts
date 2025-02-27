
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface TodoItem {
  id: string;
  content: string;
  completed: boolean;
  createdAt: string;
  list_id?: string;
}

export interface TodoList {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  items: TodoItem[];
  createdAt: string;
  ownerId: string;
  sharedWith: string[]; // User IDs with edit privileges
}

// Database types matching Supabase schema
export interface DbTodoList {
  id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  owner_id: string;
}

export interface DbTodoItem {
  id: string;
  list_id: string;
  content: string;
  completed: boolean;
  created_at: string;
}

export interface DbSharedList {
  id: string;
  list_id: string;
  user_id: string;
  created_at: string;
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical';
export type FilterOption = 'all' | 'active' | 'completed';
export type VisibilityOption = 'all' | 'private' | 'public' | 'shared';
