
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTodoStore } from '@/lib/store';
import { FilterOption } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Plus, 
  MoreHorizontal, 
  Share2, 
  Pencil, 
  Trash2, 
  Globe, 
  Lock, 
  CheckCircle2, 
  CircleX,
  ListChecks
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import TodoItem from '@/components/TodoItem';
import ShareModal from '@/components/ShareModal';
import EmptyState from '@/components/EmptyState';

const TodoList = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    lists, 
    setCurrentList, 
    currentList, 
    addTodoItem, 
    deleteList, 
    updateList,
    filter,
    setFilter
  } = useTodoStore();
  
  const [newTodoContent, setNewTodoContent] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  
  useEffect(() => {
    if (id) {
      setCurrentList(id);
    }
    
    return () => {
      setCurrentList(null);
    };
  }, [id, setCurrentList]);
  
  if (!id || !currentList) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto max-w-4xl py-8 px-4">
          <EmptyState type="not-found" />
        </main>
      </div>
    );
  }
  
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTodoContent.trim()) return;
    
    addTodoItem(currentList.id, newTodoContent);
    setNewTodoContent('');
    toast.success('Task added successfully');
  };
  
  const handleDeleteList = () => {
    deleteList(currentList.id);
    toast.success('Todo list deleted successfully');
    navigate('/dashboard');
  };
  
  const handleTogglePublic = () => {
    updateList(currentList.id, { isPublic: !currentList.isPublic });
    toast.success(`List is now ${!currentList.isPublic ? 'public' : 'private'}`);
  };
  
  const handleEditList = () => {
    setEditedTitle(currentList.title);
    setEditedDescription(currentList.description);
    setIsEditing(true);
  };
  
  const handleSaveEdit = () => {
    if (!editedTitle.trim()) {
      toast.error('Title cannot be empty');
      return;
    }
    
    updateList(currentList.id, {
      title: editedTitle,
      description: editedDescription
    });
    
    setIsEditing(false);
    toast.success('List updated successfully');
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  // Filter todos based on the active filter
  const filteredTodos = currentList.items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'active') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  });
  
  // Calculate completion percentage
  const completedCount = currentList.items.filter(item => item.completed).length;
  const totalCount = currentList.items.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-4xl py-6 px-4 md:px-6">
        <div className="mb-6 animate-fade-in">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="group mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-xl font-bold"
                      placeholder="List Title"
                      autoFocus
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input
                      id="description"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      placeholder="List Description"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit}>Save</Button>
                    <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {currentList.title}
                    </h1>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleEditList}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </div>
                  
                  {currentList.description && (
                    <p className="text-muted-foreground">
                      {currentList.description}
                    </p>
                  )}
                </>
              )}
              
              <div className="flex flex-wrap gap-2">
                {currentList.isPublic ? (
                  <Badge variant="outline" className="bg-primary/5">
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-primary/5">
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </Badge>
                )}
                
                {currentList.sharedWith.length > 0 && (
                  <Badge variant="outline" className="bg-primary/5">
                    <Share2 className="h-3 w-3 mr-1" />
                    Shared with {currentList.sharedWith.length} users
                  </Badge>
                )}
              </div>
            </div>
            
            {!isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>List Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsShareModalOpen(true)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share List
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleTogglePublic}>
                    {currentList.isPublic ? (
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
                  <DropdownMenuItem onClick={handleEditList}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit List
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleDeleteList}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        <div className="mb-6 animate-fade-in">
          <Card className="overflow-hidden border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg">Progress</CardTitle>
                <div className="text-sm font-medium">
                  {completedCount} of {totalCount} tasks completed
                </div>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalCount}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{completedCount}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalCount - completedCount}</div>
                  <div className="text-xs text-muted-foreground">Remaining</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <form onSubmit={handleAddTodo} className="mb-6 animate-fade-in">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTodoContent}
              onChange={(e) => setNewTodoContent(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!newTodoContent.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </form>
        
        <div className="space-y-4 animate-fade-in">
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between mb-2">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setFilter('all')}>
                  <ListChecks className="h-4 w-4 mr-2" />
                  All
                </TabsTrigger>
                <TabsTrigger value="active" onClick={() => setFilter('active')}>
                  <CircleX className="h-4 w-4 mr-2" />
                  Active
                </TabsTrigger>
                <TabsTrigger value="completed" onClick={() => setFilter('completed')}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Completed
                </TabsTrigger>
              </TabsList>
              
              <div className="text-sm text-muted-foreground">
                {filteredTodos.length} {filteredTodos.length === 1 ? 'item' : 'items'}
              </div>
            </div>
            
            <TabsContent value="all" className="space-y-2 mt-2">
              {filteredTodos.length > 0 ? (
                filteredTodos.map(item => (
                  <TodoItem key={item.id} listId={currentList.id} item={item} />
                ))
              ) : (
                <EmptyState type="no-todos" />
              )}
            </TabsContent>
            
            <TabsContent value="active" className="space-y-2 mt-2">
              {filteredTodos.length > 0 ? (
                filteredTodos.map(item => (
                  <TodoItem key={item.id} listId={currentList.id} item={item} />
                ))
              ) : (
                <EmptyState type="no-todos" />
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-2 mt-2">
              {filteredTodos.length > 0 ? (
                filteredTodos.map(item => (
                  <TodoItem key={item.id} listId={currentList.id} item={item} />
                ))
              ) : (
                <EmptyState type="no-todos" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        listId={currentList.id} 
      />
    </div>
  );
};

export default TodoList;
