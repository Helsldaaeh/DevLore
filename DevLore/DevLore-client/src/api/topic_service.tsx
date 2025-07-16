// src/api/topic.ts
export interface TopicDTO {
  id?: number | null;
  title?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export const fetchTopics = async (): Promise<TopicDTO[]> => {
  const response = await fetch(`/api/topic`, { method: "GET" });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch topics');
  }
  return response.json();
};

export const createOrUpdateTopics = async (topics: TopicDTO[]): Promise<boolean> => {
  const response = await fetch('/api/topic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(topics)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to save topics');
  }
  
  return true;
};

export const deleteTopics = async (ids: number[]): Promise<boolean> => {
  const response = await fetch('/api/topic', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ids)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete topics');
  }
  
  return true;
};