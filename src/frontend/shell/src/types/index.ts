export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Guild {
  id: string;
  name: string;
  icon?: string;
}

export interface Channel {
  id: string;
  name: string;
  type: string;
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  author?: { username: string };
  createdAt: string;
}
