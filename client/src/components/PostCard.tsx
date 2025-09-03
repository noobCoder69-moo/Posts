import { motion } from 'framer-motion';
import { Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import { Post } from '@/lib/api';
import { formatRelativeTime } from '@/lib/date-utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2 }}
      className="post-card group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-card-foreground mb-2 break-words">
            {post.title}
          </h3>
          <p className="text-muted-foreground mb-4 whitespace-pre-wrap break-words">
            {post.content}
          </p>
          <time className="text-sm text-muted-foreground">
            {formatRelativeTime(post.created_at)}
          </time>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Post options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(post)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(post.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.article>
  );
}