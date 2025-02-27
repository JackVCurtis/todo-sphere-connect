
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodoStore } from '@/lib/store';
import { TodoList as TodoListType, SortOption, FilterOption, VisibilityOption } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MoreHorizontal, 
  Plus, 
  List, 
  ListFilter, 
  Globe, 
  Lock, 
  Users, 
  Trash2, 
  Share2, 
  Eye,
  EyeOff,
  Clock,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import CreateListModal from '@/components/CreateListModal';
import ShareModal from '@/components/ShareModal';
import EmptyState from '@/components/EmptyState';

const Dashboard = () => {
  const { 
    lists, 
    currentUser, 
    filter, 
    setFilter, 
    sort, 
    setSort, 
    visibility, 
    setVisibility, 
    searchQuery, 
    setSearchQuery,
    deleteList,
    updateList
  } = useTodoStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [shareListId, setShareListId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter and sort lists
  const filteredLists = lists.filter(list => {
    const matchesSearch = list.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       list.description.toLowerCase().includes(searchQuery.toLowerCase());
                       
    const matchesVisibility = 
      visibility === 'all' || 
      (visibility === 'private' && !list.isPublic) || 
      (visibility === 'public' && list.isPublic) ||
      (visibility === 'shared' && list.sharedWith.length > 0);
      
    return matchesSearch && matchesVisibility;
  });
  
  const sortedLists = [...filteredLists].sort((a, b) => {
    switch (sort) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleCreateList = () => {
    setIsCreateModalOpen(true);
  };
  
  const handleShareList = (listId: string) => {
    setShareListId(listId);
  };
  
  const handleDeleteList = (listId: string) => {
    deleteList(listId);
    toast.success('Todo list deleted successfully');
  };
  
  const handleTogglePublic = (list: TodoListType) => {
    updateList(list.id, { isPublic: !list.isPublic });
    toast.success(`List is now ${!list.isPublic ? 'public' : 'private'}`);
  };
  
  const getCompletedTasksCount = (list: TodoListType) => {
    return list.items.filter(item => item.completed).length;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-6 px-4 md:px-6 lg:px-8 container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Your Todo Lists</h1>
            <p className="text-muted-foreground mt-1 animate-fade-in">
              Manage and organize all your tasks in one place
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto animate-fade-in">
            <div className="flex-1 md:w-auto">
              <Select value={visibility} onValueChange={(value) => setVisibility(value as VisibilityOption)}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <ListFilter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Lists</SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Private
                    </div>
                  </SelectItem>
                  <SelectItem value="public">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Public
                    </div>
                  </SelectItem>
                  <SelectItem value="shared">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Shared
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 md:w-auto">
              <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleCreateList}>
              <Plus className="h-4 w-4 mr-2" />
              New List
            </Button>
          </div>
        </div>
        
        {/* Mobile search (visible only on mobile) */}
        <div className="mb-6 md:hidden animate-fade-in">
          <Input
            placeholder="Search todo lists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        {sortedLists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {sortedLists.map((list) => (
              <Card key={list.id} className="group overflow-hidden hover:shadow-md transition-shadow duration-300 border animate-scale-in">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      {list.isPublic ? (
                        <Badge variant="outline" className="mb-2 bg-primary/5">
                          <Globe className="h-3 w-3 mr-1" />
                          Public
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="mb-2 bg-primary/5">
                          <Lock className="h-3 w-3 mr-1" />
                          Private
                        </Badge>
                      )}
                      {list.sharedWith.length > 0 && (
                        <Badge variant="outline" className="ml-2 mb-2 bg-primary/5">
                          <Users className="h-3 w-3 mr-1" />
                          Shared ({list.sharedWith.length})
                        </Badge>
                      )}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel>List Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate(`/list/${list.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View List
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShareList(list.id)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share List
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTogglePublic(list)}>
                          {list.isPublic ? (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Make Private
                            </>
                          ) : (
                            <>
                              <Globe className="h-4 w-4 mr-2" />
                              Make Public
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteList(list.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete List
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <CardTitle className="text-xl mt-2 group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/list/${list.id}`)}>
                    {list.title}
                  </CardTitle>
                  
                  {list.description && (
                    <CardDescription className="line-clamp-2">
                      {list.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{list.items.length} items</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{getCompletedTasksCount(list)}/{list.items.length} completed</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-3 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleShareList(list.id)}
                    className="text-xs"
                  >
                    <Share2 className="h-3.5 w-3.5 mr-1" />
                    Share
                  </Button>
                  
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => navigate(`/list/${list.id}`)}
                    className="text-xs"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState 
            type={searchQuery ? 'no-results' : 'no-lists'} 
            onCreateNew={handleCreateList} 
          />
        )}
      </main>
      
      <CreateListModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      {shareListId && (
        <ShareModal 
          isOpen={!!shareListId} 
          onClose={() => setShareListId(null)} 
          listId={shareListId} 
        />
      )}
    </div>
  );
};

export default Dashboard;
