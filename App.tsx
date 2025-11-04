
import React, { useState, useCallback, useEffect } from 'react';
import { User, Role, View, Event, ChatMessage } from './types';
import { USERS, INITIAL_EVENTS, INITIAL_MESSAGES } from './constants';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Profile from './components/Profile';
import Chat from './components/Chat';
import { useLanguage } from './contexts/LanguageContext';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
    const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [users, setUsers] = useState<User[]>(USERS);
    const [loginError, setLoginError] = useState<string | null>(null);
    const { language, t } = useLanguage();

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const handleLogin = useCallback((name: string, password: string) => {
        const user = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.password === password);
        if (user) {
            setCurrentUser(user);
            setLoginError(null);
        } else {
            setLoginError(t('loginError'));
        }
    }, [users, t]);

    const handleSignUp = useCallback((newUser: Omit<User, 'id'>) => {
        const user: User = {
            ...newUser,
            id: `user-${Date.now()}`,
        };
        setUsers(prev => [...prev, user]);
        setCurrentUser(user);
    }, []);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        setCurrentView(View.DASHBOARD);
    }, []);

    const handleUpdateUser = useCallback((updatedUser: User) => {
        setUsers(prevUsers => prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u)));
        if (currentUser?.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
    }, [currentUser]);

    const handleAddEvent = useCallback((event: Omit<Event, 'id' | 'rsvps'>) => {
        setEvents(prevEvents => [
            ...prevEvents,
            {
                ...event,
                id: `evt-${Date.now()}`,
                rsvps: [],
            }
        ]);
    }, []);

    const handleUpdateEvent = useCallback((updatedEvent: Event) => {
        setEvents(prevEvents => prevEvents.map(event => 
            event.id === updatedEvent.id ? updatedEvent : event
        ));
    }, []);

    const handleDeleteEvent = useCallback((eventId: string) => {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    }, []);

    const handleRsvp = useCallback((eventId: string, userId: string, status: 'yes' | 'no' | 'maybe') => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (event.id === eventId) {
                const existingRsvpIndex = event.rsvps.findIndex(rsvp => rsvp.userId === userId);
                const newRsvps = [...event.rsvps];
                if (existingRsvpIndex > -1) {
                    newRsvps[existingRsvpIndex] = { userId, status };
                } else {
                    newRsvps.push({ userId, status });
                }
                return { ...event, rsvps: newRsvps };
            }
            return event;
        }));
    }, []);

    const handleAddMessage = useCallback((message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
    }, []);
    
    if (!currentUser) {
        return <AuthScreen onLogin={handleLogin} onSignUp={handleSignUp} loginError={loginError} />;
    }

    const renderView = () => {
        switch (currentView) {
            case View.DASHBOARD:
                return <Dashboard 
                          user={currentUser} 
                          events={events} 
                          users={users} 
                          onAddEvent={handleAddEvent} 
                          onRsvp={handleRsvp}
                          onUpdateEvent={handleUpdateEvent}
                          onDeleteEvent={handleDeleteEvent}
                       />;
            case View.PROFILE:
                return <Profile user={currentUser} onUpdateUser={handleUpdateUser} />;
            case View.CHAT:
                return <Chat 
                          currentUser={currentUser} 
                          messages={messages} 
                          onAddMessage={handleAddMessage}
                          events={events}
                          users={users}
                       />;
            default:
                return <Dashboard 
                          user={currentUser} 
                          events={events} 
                          users={users} 
                          onAddEvent={handleAddEvent} 
                          onRsvp={handleRsvp} 
                          onUpdateEvent={handleUpdateEvent}
                          onDeleteEvent={handleDeleteEvent}
                       />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            <Header currentView={currentView} setView={setCurrentView} onLogout={handleLogout} />
            <main className="flex-1 p-4 sm:p-6 md:p-10 ml-16 md:ml-20 rtl:ml-0 rtl:mr-16 md:rtl:mr-20">
                {renderView()}
            </main>
        </div>
    );
};

export default App;
