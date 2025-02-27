
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface TodoItem {
  id: string;
  content: string;
  completed: boolean;
  createdAt: string;
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

export type SortOption = 'newest' | 'oldest' | 'alphabetical';
export type FilterOption = 'all' | 'active' | 'completed';
export type VisibilityOption = 'all' | 'private' | 'public' | 'shared';
