// src/api/topic.ts
export interface PostDTO {
  id?: number | null;
  UserId?: number | null;
  Content?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export const fetchPosts = async (): Promise<PostDTO[]> => {
  const response = await fetch(`/api/post`, { method: "GET" });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch posts');
  }
  return response.json();
};

export const createOrUpdatePosts = async (posts: PostDTO[]): Promise<boolean> => {
  const response = await fetch('/api/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(posts)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to save posts');
  }
  
  return true;
};

export const deletePosts = async (ids: number[]): Promise<boolean> => {
  const response = await fetch('/api/post', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ids)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete posts');
  }
  
  return true;
};