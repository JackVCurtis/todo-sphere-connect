
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTodoStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Home, ListChecks } from 'lucide-react';
import CreateListModal from './CreateListModal';

const Navbar = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useTodoStore();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-background/80">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="text-xl font-semibold tracking-tight transition-colors hover:text-primary/80"
          >
            TodoSphere
          </Link>
        </div>

        {!isHome && (
          <div className="hidden md:flex flex-1 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search todos..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          {!isHome && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden md:flex"
            >
              <Link to="/">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </Link>
            </Button>
          )}
          
          {!isDashboard && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden md:flex"
            >
              <Link to="/dashboard">
                <ListChecks className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </Button>
          )}
          
          {!isHome && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="group"
            >
              <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              New List
            </Button>
          )}
        </div>
      </div>

      <CreateListModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </header>
  );
};

export default Navbar;
