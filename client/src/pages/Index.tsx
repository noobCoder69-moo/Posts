import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RefreshCw, MessageSquare } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Post } from '@/lib/api';
import { PostCard } from '@/components/PostCard';
import { PostForm } from '@/components/PostForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

function SocialApp() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: posts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: api.getAllPosts,
  });

  const createPostMutation = useMutation({
    mutationFn: api.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setIsFormOpen(false);
      toast({
        title: "Post created!",
        description: "Your post has been published successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating post",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setEditingPost(null);
      setIsFormOpen(false);
      toast({
        title: "Post updated!",
        description: "Your changes have been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating post",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: api.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Post deleted",
        description: "The post has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting post",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = async (data: any) => {
    await createPostMutation.mutateAsync(data);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleUpdatePost = async (data: any) => {
    if (editingPost) {
      await updatePostMutation.mutateAsync({ id: editingPost.id, data });
    }
  };

  const handleDeletePost = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePostMutation.mutateAsync(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Unable to load posts</h2>
          <p className="text-muted-foreground mb-4">
            Please check your connection and try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">Social</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setIsFormOpen(true)}
                size="sm"
                className="gradient-primary text-white border-0 hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="post-card animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                  <div className="h-3 bg-muted rounded w-20 mt-4"></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No posts yet</h2>
              <p className="text-muted-foreground mb-6">
                Be the first to share something with the community!
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                />
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </main>

      {/* Post Form Modal */}
      <PostForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
        editingPost={editingPost}
        isSubmitting={createPostMutation.isPending || updatePostMutation.isPending}
      />
    </div>
  );
}

const Index = () => {
  return (
    <ThemeProvider>
      <SocialApp />
    </ThemeProvider>
  );
};

export default Index;