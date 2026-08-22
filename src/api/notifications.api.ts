export interface RawPolledPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const notificationsApi = {
  pollNotifications: async (): Promise<RawPolledPost[]> => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    if (!response.ok) {
      throw new Error('Failed to poll notifications endpoint');
    }
    return response.json();
  }
};
