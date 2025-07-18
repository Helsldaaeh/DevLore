// src/api/topic.ts
export interface UserDTO {
  id?: number | null;
  Username?: string | null;
  Hash_password?: string | null;
  Profile?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export const fetchUsers = async (): Promise<UserDTO[]> => {
  const response = await fetch(`/api/user`, { method: "GET" });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch users');
  }
  return response.json();
};

export const createOrUpdateUsers = async (posts: UserDTO[]): Promise<boolean> => {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(posts)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to save users');
  }
  
  return true;
};

export const deleteUsers = async (ids: number[]): Promise<boolean> => {
  const response = await fetch('/api/user', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ids)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete users');
  }
  
  return true;
};