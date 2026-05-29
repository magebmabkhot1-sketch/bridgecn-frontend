export type StudentType = 'CHINESE' | 'INTERNATIONAL';

export type University = {
  id: string;
  slug: string;
  name: string;
  city: string;
  logoUrl?: string | null;
  description: string;
  studentsCount: number;
  activeUsers: number;
  eventsThisMonth: number;
};

export type User = {
  id: string;
  email: string;
  fullName: string;
  studentType: StudentType;
  yearOfStudy: string;
  interestsJson: string[] | any;
  bio: string;
  avatarUrl?: string | null;
  language: 'en' | 'zh';
  isVerified: boolean;
  role: 'USER' | 'ORGANIZER' | 'ADMIN';
  profileCompletion: number;
  online: boolean;
  universityId?: string | null;
  university?: University | null;
  createdAt?: string;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  attendeesCount: number;
  university?: University | null;
  organizer?: User | null;
  rsvps?: { id: string; status: 'GOING' | 'INTERESTED' | 'NOT_GOING'; userId: string }[];
};

export type Post = {
  id: string;
  content: string;
  imageUrl?: string | null;
  tagsJson: string[] | any;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  author: User;
  comments?: { id: string; content: string; author: User; createdAt: string }[];
};

export type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: User;
};

export type Conversation = {
  id: string;
  participantA: User;
  participantB: User;
  messages: Message[];
};
