import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { Post, CreatePostData, UpdatePostData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostData | UpdatePostData) => Promise<void>;
  editingPost?: Post | null;
  isSubmitting?: boolean;
}

export function PostForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingPost, 
  isSubmitting = false 
}: PostFormProps) {
  const [title, setTitle] = useState(editingPost?.title || '');
  const [content, setContent] = useState(editingPost?.content || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await onSubmit({ title: title.trim(), content: content.trim() });
    
    if (!editingPost) {
      setTitle('');
      setContent('');
    }
  };

  const handleClose = () => {
    if (!editingPost) {
      setTitle('');
      setContent('');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-2xl"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Post title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={isSubmitting}
                      autoFocus
                      maxLength={200}
                    />
                  </div>
                  
                  <div>
                    <Textarea
                      placeholder="What's on your mind?"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      disabled={isSubmitting}
                      rows={4}
                      maxLength={1000}
                      className="resize-none"
                    />
                    <div className="text-right text-sm text-muted-foreground mt-1">
                      {content.length}/1000
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={!title.trim() || !content.trim() || isSubmitting}
                      className="min-w-24"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {editingPost ? 'Update' : 'Post'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}