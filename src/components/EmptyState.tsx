
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, List, Search, Share2 } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-lists' | 'no-todos' | 'no-results' | 'not-found';
  onCreateNew?: () => void;
}

const EmptyState = ({ type, onCreateNew }: EmptyStateProps) => {
  const content = {
    'no-lists': {
      icon: <List className="h-12 w-12 text-muted-foreground/50" />,
      title: 'No todo lists yet',
      description: 'Create your first todo list to get started.',
      action: onCreateNew ? (
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create new list
        </Button>
      ) : (
        <Button asChild>
          <Link to="/dashboard">
            <Plus className="h-4 w-4 mr-2" />
            Create new list
          </Link>
        </Button>
      )
    },
    'no-todos': {
      icon: <List className="h-12 w-12 text-muted-foreground/50" />,
      title: 'No tasks yet',
      description: 'Add your first task to this list.',
      action: null
    },
    'no-results': {
      icon: <Search className="h-12 w-12 text-muted-foreground/50" />,
      title: 'No matching results',
      description: 'Try adjusting your search or filter to find what you\'re looking for.',
      action: null
    },
    'not-found': {
      icon: <Share2 className="h-12 w-12 text-muted-foreground/50" />,
      title: 'Todo list not found',
      description: 'The todo list you\'re looking for doesn\'t exist or you don\'t have access to it.',
      action: (
        <Button asChild>
          <Link to="/dashboard">
            Go to dashboard
          </Link>
        </Button>
      )
    }
  };

  const { icon, title, description, action } = content[type];

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in">
      <div className="rounded-full bg-secondary/80 p-4 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mt-2">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-md">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
