import { User, Role, Event, ChatMessage } from './types';

export const USERS: User[] = [
    { id: 'user-1', name: 'Coach Miller', password: 'password123', role: Role.COACH, avatar: 'https://i.pravatar.cc/150?u=coach-miller' },
    { id: 'user-2', name: 'Alex Johnson', password: 'password123', role: Role.PLAYER, avatar: 'https://i.pravatar.cc/150?u=alex-j', position: 'Forward', jerseyNumber: 10 },
    { id: 'user-3', name: 'Maria Garcia', password: 'password123', role: Role.PLAYER, avatar: 'https://i.pravatar.cc/150?u=maria-g', position: 'Midfielder', jerseyNumber: 8 },
    { id: 'user-4', name: 'Sam Chen', password: 'password123', role: Role.PLAYER, avatar: 'https://i.pravatar.cc/150?u=sam-c', position: 'Defender', jerseyNumber: 4 },
    { id: 'user-5', name: 'Jessica Brown', password: 'password123', role: Role.PLAYER, avatar: 'https://i.pravatar.cc/150?u=jess-b', position: 'Goalkeeper', jerseyNumber: 1 },
    { id: 'assistant-1', name: 'Team Assistant', password: 'N/A', role: Role.COACH, avatar: 'https://i.pravatar.cc/150?u=assistant' }
];

const today = new Date();
const getFutureDate = (days: number) => {
    const future = new Date(today);
    future.setDate(today.getDate() + days);
    return future.toISOString().split('T')[0];
};

export const INITIAL_EVENTS: Event[] = [
    {
        id: 'evt-1',
        type: 'practice',
        title: 'Drills & Conditioning',
        date: getFutureDate(2),
        time: '18:00',
        location: 'North Park Field 3',
        details: 'Focus on passing drills and stamina.',
        rsvps: [{ userId: 'user-3', status: 'yes' }, { userId: 'user-4', status: 'yes' }],
    },
    {
        id: 'evt-2',
        type: 'game',
        title: 'Game vs. Eagles',
        date: getFutureDate(5),
        time: '14:00',
        location: 'City Stadium',
        details: 'League match. Wear away kits.',
        rsvps: [{ userId: 'user-2', status: 'yes' }, { userId: 'user-3', status: 'maybe' }, { userId: 'user-5', status: 'yes' }],
    },
    {
        id: 'evt-3',
        type: 'practice',
        title: 'Scrimmage Match',
        date: getFutureDate(9),
        time: '17:30',
        location: 'North Park Field 2',
        rsvps: [],
    },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: 'msg-1',
        userId: 'user-1',
        text: 'Hey team, remember to bring both home and away kits for the game on Saturday!',
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
    },
    {
        id: 'msg-2',
        userId: 'user-2',
        text: 'Got it, coach!',
        timestamp: Date.now() - 1000 * 60 * 60 * 1.5,
    },
    {
        id: 'assistant-1',
        text: 'Hello! I am your team assistant. Ask me about the schedule by typing `@assistant` followed by your question.',
        timestamp: Date.now() - 1000 * 60 * 60,
        userId: 'assistant-1',
    }
];