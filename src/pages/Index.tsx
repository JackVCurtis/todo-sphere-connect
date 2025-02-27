
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Users, Lock, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CreateListModal from '@/components/CreateListModal';

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col items-center text-center animate-fade-in">
              <div className="mb-6 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium">
                Simple, Elegant, Productive
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Manage your tasks with <span className="text-primary">purpose</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8">
                TodoSphere helps you organize your life with beautiful, shareable todo lists.
                Stay focused on what matters most.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button 
                  size="lg" 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="group transition-all"
                >
                  Create Your First List
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-background hover:bg-secondary/80"
                >
                  Explore Dashboard
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-secondary/50">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Features designed for clarity
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our minimalist approach puts the focus on your tasks, not on the interface.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<CheckCircle className="h-8 w-8" />}
                title="Simple Task Management"
                description="Create, edit, and complete tasks with an intuitive interface designed for efficiency."
              />
              <FeatureCard 
                icon={<Users className="h-8 w-8" />}
                title="Collaborative Lists"
                description="Share your lists with others and work together on projects, shopping, or any task."
              />
              <FeatureCard 
                icon={<Lock className="h-8 w-8" />}
                title="Private & Public Lists"
                description="Keep your personal tasks private or make lists public to share with the world."
              />
              <FeatureCard 
                icon={<Sparkles className="h-8 w-8" />}
                title="Beautiful Experience"
                description="Enjoy a thoughtfully designed interface with smooth animations and intuitive controls."
              />
              <FeatureCard 
                icon={<Lock className="h-8 w-8" />}
                title="Access Control"
                description="Choose who can view or edit your shared lists with granular permissions."
              />
              <FeatureCard 
                icon={<CheckCircle className="h-8 w-8" />}
                title="Cross-Device Sync"
                description="Access your todos anywhere, with seamless synchronization across all your devices."
              />
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 border-t">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              © 2023 TodoSphere. All rights reserved.
            </p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
      
      <CreateListModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => {
  return (
    <div className="rounded-xl p-6 bg-background border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
      <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
