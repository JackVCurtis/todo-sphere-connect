
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodoStore } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateListModal = ({ isOpen, onClose }: CreateListModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const { createList } = useTodoStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for your list');
      return;
    }
    
    const newList = createList(title, description, isPublic);
    toast.success('Todo list created successfully');
    onClose();
    
    // Reset form
    setTitle('');
    setDescription('');
    setIsPublic(false);
    
    // Navigate to the new list
    navigate(`/list/${newList.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl">Create a new todo list</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-3">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter list title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter list description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-switch">Public list</Label>
              <p className="text-sm text-muted-foreground">
                Allow anyone with the link to view this list
              </p>
            </div>
            <Switch
              id="public-switch"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          
          <DialogFooter className="flex sm:justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create List</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListModal;
