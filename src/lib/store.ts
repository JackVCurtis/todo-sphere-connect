
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TodoList, TodoItem, User, FilterOption, SortOption, VisibilityOption } from './types';
import { v4 as uuidv4 } from 'uuid';

// Mock current user - in a real app this would come from authentication
const CURRENT_USER: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com'
};

// Mock other users for sharing
export const MOCK_USERS: User[] = [
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com' },
];

interface TodoState {
  lists: TodoList[];
  currentList: TodoList | null;
  currentUser: User;
  filter: FilterOption;
  sort: SortOption;
  visibility: VisibilityOption;
  searchQuery: string;

  // Actions
  setCurrentList: (listId: string | null) => void;
  createList: (title: string, description: string, isPublic: boolean) => TodoList;
  updateList: (listId: string, updates: Partial<TodoList>) => void;
  deleteList: (listId: string) => void;
  addTodoItem: (listId: string, content: string) => void;
  toggleTodoItem: (listId: string, itemId: string) => void;
  updateTodoItem: (listId: string, itemId: string, content: string) => void;
  deleteTodoItem: (listId: string, itemId: string) => void;
  shareList: (listId: string, userId: string) => void;
  removeSharedUser: (listId: string, userId: string) => void;
  setFilter: (filter: FilterOption) => void;
  setSort: (sort: SortOption) => void;
  setVisibility: (visibility: VisibilityOption) => void;
  setSearchQuery: (query: string) => void;
}

const defaultLists: TodoList[] = [
  {
    id: '1',
    title: 'Getting Started',
    description: 'Welcome to TodoSphere! Here are some tasks to get you started.',
    isPublic: false,
    items: [
      {
        id: '101',
        content: 'Create your first todo list',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '102',
        content: 'Add some todo items',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '103',
        content: 'Share your list with others',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    ownerId: '1',
    sharedWith: [],
  },
  {
    id: '2',
    title: 'Public Example',
    description: 'This is a public todo list that anyone can view.',
    isPublic: true,
    items: [
      {
        id: '201',
        content: 'This is visible to everyone',
        completed: true,
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    ownerId: '1',
    sharedWith: ['2'],
  },
];

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      lists: defaultLists,
      currentList: null,
      currentUser: CURRENT_USER,
      filter: 'all',
      sort: 'newest',
      visibility: 'all',
      searchQuery: '',

      setCurrentList: (listId) => {
        const list = listId ? get().lists.find(l => l.id === listId) || null : null;
        set({ currentList: list });
      },

      createList: (title, description, isPublic) => {
        const newList: TodoList = {
          id: uuidv4(),
          title,
          description,
          isPublic,
          items: [],
          createdAt: new Date().toISOString(),
          ownerId: get().currentUser.id,
          sharedWith: [],
        };
        set(state => ({ 
          lists: [...state.lists, newList],
          currentList: newList
        }));
        return newList;
      },

      updateList: (listId, updates) => {
        set(state => ({
          lists: state.lists.map(list => 
            list.id === listId ? { ...list, ...updates } : list
          ),
          currentList: state.currentList?.id === listId 
            ? { ...state.currentList, ...updates } 
            : state.currentList
        }));
      },

      deleteList: (listId) => {
        set(state => ({
          lists: state.lists.filter(list => list.id !== listId),
          currentList: state.currentList?.id === listId ? null : state.currentList
        }));
      },

      addTodoItem: (listId, content) => {
        const newItem: TodoItem = {
          id: uuidv4(),
          content,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        set(state => ({
          lists: state.lists.map(list => 
            list.id === listId 
              ? { ...list, items: [...list.items, newItem] } 
              : list
          ),
          currentList: state.currentList?.id === listId 
            ? { ...state.currentList, items: [...state.currentList.items, newItem] } 
            : state.currentList
        }));
      },

      toggleTodoItem: (listId, itemId) => {
        set(state => ({
          lists: state.lists.map(list => 
            list.id === listId 
              ? { 
                  ...list, 
                  items: list.items.map(item => 
                    item.id === itemId 
                      ? { ...item, completed: !item.completed } 
                      : item
                  ) 
                } 
              : list
          ),
          currentList: state.currentList?.id === listId 
            ? { 
                ...state.currentList, 
                items: state.currentList.items.map(item => 
                  item.id === itemId 
                    ? { ...item, completed: !item.completed } 
                    : item
                ) 
              } 
            : state.currentList
        }));
      },

      updateTodoItem: (listId, itemId, content) => {
        set(state => ({
          lists: state.lists.map(list => 
            list.id === listId 
              ? { 
                  ...list, 
                  items: list.items.map(item => 
                    item.id === itemId 
                      ? { ...item, content } 
                      : item
                  ) 
                } 
              : list
          ),
          currentList: state.currentList?.id === listId 
            ? { 
                ...state.currentList, 
                items: state.currentList.items.map(item => 
                  item.id === itemId 
                    ? { ...item, content } 
                    : item
                ) 
              } 
            : state.currentList
        }));
      },

      deleteTodoItem: (listId, itemId) => {
        set(state => ({
          lists: state.lists.map(list => 
            list.id === listId 
              ? { 
                  ...list, 
                  items: list.items.filter(item => item.id !== itemId) 
                } 
              : list
          ),
          currentList: state.currentList?.id === listId 
            ? { 
                ...state.currentList, 
                items: state.currentList.items.filter(item => item.id !== itemId) 
              } 
            : state.currentList
        }));
      },

      shareList: (listId, userId) => {
        set(state => ({
          lists: state.lists.map(list => 
            list.id === listId 
              ? { 
                  ...list, 
                  sharedWith: list.sharedWith.includes(userId) 
                    ? list.sharedWith 
                    : [...list.sharedWith, userId] 
                } 
              : list
          ),
          currentList: state.currentList?.id === listId 
            ? { 
                ...state.currentList, 
                sharedWith: state.currentList.sharedWith.includes(userId) 
                  ? state.currentList.sharedWith 
                  : [...state.currentList.sharedWith, userId] 
              } 
            : state.currentList
        }));
      },

      removeSharedUser: (listId, userId) => {
        set(state => ({
          lists: state.lists.map(list => 
            list.id === listId 
              ? { 
                  ...list, 
                  sharedWith: list.sharedWith.filter(id => id !== userId) 
                } 
              : list
          ),
          currentList: state.currentList?.id === listId 
            ? { 
                ...state.currentList, 
                sharedWith: state.currentList.sharedWith.filter(id => id !== userId) 
              } 
            : state.currentList
        }));
      },

      setFilter: (filter) => set({ filter }),
      setSort: (sort) => set({ sort }),
      setVisibility: (visibility) => set({ visibility }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
    }),
    {
      name: 'todo-storage',
    }
  )
);
