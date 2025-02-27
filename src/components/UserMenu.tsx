
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Settings } from 'lucide-react';
import { toast } from 'sonner';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('You have been signed out');
      navigate('/auth');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  if (!user) {
    return (
      <Button 
        variant="default" 
        size="sm" 
        onClick={() => navigate('/auth')}
      >
        Sign In
      </Button>
    );
  }

  // Get user's initials from email
  const getUserInitials = () => {
    if (!user?.email) return '?';
    
    const parts = user.email.split('@')[0].split(/[._-]/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const userEmail = user.email || 'User';
  const truncatedEmail = userEmail.length > 20 
    ? `${userEmail.substring(0, 20)}...` 
    : userEmail;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{truncatedEmail}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.id.substring(0, 8)}...
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
