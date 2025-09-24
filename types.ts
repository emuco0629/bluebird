
export enum BirdCharacterName {
  BlueBird = 'BlueBird',
  Sparrow = 'Sparrow',
  WhiteBird = 'WhiteBird',
  MysterySparrow = 'MysterySparrow', // Renamed from RiddleSparrow
  Hawk = 'Hawk',
}

export interface SparrowProfile {
  id: string;
  name: string;
  username: string;
  personality: string;
}

export enum BirdAnimationState {
  Idle = 'Idle',
  Thinking = 'Thinking',
  Happy = 'Happy',
  Nodding = 'Nodding',
  Sleeping = 'Sleeping',
  Typing = 'Typing',
  Joy = 'Joy', // Added for positive emotion
  Concern = 'Concern', // Added for worried emotion
}

export interface TweetSource {
  uri: string;
  title: string;
}

export interface Tweet {
  id: string;
  character: BirdCharacterName;
  characterProfile?: SparrowProfile; // For individual sparrows
  content: string;
  timestamp: Date;
  sources?: TweetSource[];
}

export enum DiaryEntryType {
  Personal = 'Personal',
  Forest = 'Forest',
}

export interface DiaryEntry {
  id:string;
  originalText: string;
  summarizedText: string;
  timestamp: Date;
  type: DiaryEntryType;
}

export enum ChatMessageType {
    User = 'User',
    Psychological = 'Psychological',
}

export interface ChatMessage {
    id: string;
    text: string;
    timestamp: Date;
    type: ChatMessageType;
}

export enum ItemType {
  Coupon = 'Coupon',
  Junk = 'Junk',
  Hint = 'Hint',
  Affiliate = 'Affiliate', // Added for monetization
}

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  link?: string; // For affiliate links
}