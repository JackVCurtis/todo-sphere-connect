
import { useState } from 'react';
import { useTodoStore, MOCK_USERS } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Copy, X, Check, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
}

const ShareModal = ({ isOpen, onClose, listId }: ShareModalProps) => {
  const { lists, updateList, shareList, removeSharedUser } = useTodoStore();
  const list = lists.find(l => l.id === listId);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!list) return null;

  const filteredUsers = MOCK_USERS.filter(user => 
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const shareLink = `${window.location.origin}/list/${list.id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard');
  };
  
  const handleTogglePublic = () => {
    updateList(list.id, { isPublic: !list.isPublic });
  };
  
  const handleShareWithUser = (userId: string) => {
    shareList(list.id, userId);
    toast.success('User added to shared list');
  };
  
  const handleRemoveUser = (userId: string) => {
    removeSharedUser(list.id, userId);
    toast.success('User removed from shared list');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share "{list.title}"
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-3">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-switch">Public list</Label>
                <p className="text-sm text-muted-foreground">
                  Anyone with the link can view this list
                </p>
              </div>
              <Switch
                id="public-switch"
                checked={list.isPublic}
                onCheckedChange={handleTogglePublic}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Share link</Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={shareLink} 
                  readOnly 
                  className="bg-secondary/50"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleCopyLink}
                  className="flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy link</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Invite people to edit</Label>
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {filteredUsers.map(user => {
                const isShared = list.sharedWith.includes(user.id);
                
                return (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    <Button
                      variant={isShared ? "outline" : "default"}
                      size="sm"
                      onClick={() => isShared 
                        ? handleRemoveUser(user.id) 
                        : handleShareWithUser(user.id)
                      }
                      className="ml-2"
                    >
                      {isShared ? (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
              
              {searchQuery && filteredUsers.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No users found matching "{searchQuery}"
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex sm:justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm">
                {list.sharedWith.length} people have access
              </Label>
            </div>
            <Button type="button" onClick={onClose}>Done</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
