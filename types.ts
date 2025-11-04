export enum Role {
    COACH = 'Coach',
    PLAYER = 'Player',
}

export enum View {
    DASHBOARD = 'Dashboard',
    PROFILE = 'Profile',
    CHAT = 'Chat',
}

export interface User {
    id: string;
    name: string;
    password: string;
    role: Role;
    avatar: string;
    position?: string;
    jerseyNumber?: number;
}

export interface RSVP {
    userId: string;
    status: 'yes' | 'no' | 'maybe';
}

export interface Event {
    id: string;
    type: 'practice' | 'game';
    title: string;
    date: string; 
    time: string;
    location: string;
    details?: string;
    rsvps: RSVP[];
}

export interface ChatMessage {
    id: string;
    userId: string;
    text: string;
    timestamp: number;
}