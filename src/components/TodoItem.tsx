
import { useState, useRef, useEffect } from 'react';
import { useTodoStore } from '@/lib/store';
import { TodoItem as TodoItemType } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  listId: string;
  item: TodoItemType;
}

const TodoItem = ({ listId, item }: TodoItemProps) => {
  const { toggleTodoItem, updateTodoItem, deleteTodoItem } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    toggleTodoItem(listId, item.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(item.content);
  };

  const handleSave = () => {
    if (editedContent.trim()) {
      updateTodoItem(listId, item.id, editedContent);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDelete = () => {
    deleteTodoItem(listId, item.id);
  };

  return (
    <div 
      className={cn(
        "group flex items-center gap-2 p-3 rounded-lg transition-all duration-200",
        "hover:bg-secondary/50 focus-within:bg-secondary/50 todo-item-appear",
        "border border-transparent hover:border-border/50"
      )}
    >
      <Checkbox 
        checked={item.completed} 
        onCheckedChange={handleToggle}
        className="h-5 w-5 transition-all data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      />
      
      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 py-1"
            autoFocus
          />
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSave}
              className="h-8 w-8"
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Save</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCancel}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel</span>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <span 
            className={cn(
              "flex-1 transition-all duration-200",
              item.completed && "text-muted-foreground line-through"
            )}
          >
            {item.content}
          </span>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleEdit}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDelete}
              className="h-8 w-8 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
