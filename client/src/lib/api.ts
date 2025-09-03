const API_BASE = 'http://127.0.0.1:8000/api';

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
}

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(`API Error: ${errorText}`, response.status);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

export const api = {
  async getAllPosts(): Promise<Post[]> {
    const response = await fetch(`${API_BASE}/posts/`);
    return handleResponse(response);
  },

  async createPost(data: CreatePostData): Promise<Post> {
    const response = await fetch(`${API_BASE}/posts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updatePost(id: number, data: UpdatePostData): Promise<Post> {
    const response = await fetch(`${API_BASE}/posts/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deletePost(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/posts/${id}/`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(`API Error: ${errorText}`, response.status);
    }
  },
};