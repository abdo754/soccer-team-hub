
import React, { useState } from 'react';
import { User, Event, Role } from '../types';
import EventModal from './EventModal';
import Calendar from './Calendar';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
    user: User;
    events: Event[];
    users: User[];
    onAddEvent: (event: Omit<Event, 'id' | 'rsvps'>) => void;
    onUpdateEvent: (event: Event) => void;
    onDeleteEvent: (eventId: string) => void;
    onRsvp: (eventId: string, userId: string, status: 'yes' | 'no' | 'maybe') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, events, users, onAddEvent, onUpdateEvent, onDeleteEvent, onRsvp }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const { t } = useLanguage();

    const handleOpenAddModal = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (event: Event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
    };

    const handleSaveEvent = (eventData: Omit<Event, 'id' | 'rsvps'> | Event) => {
        if ('id' in eventData && eventData.id) {
            onUpdateEvent(eventData as Event);
        } else {
            onAddEvent(eventData as Omit<Event, 'id' | 'rsvps'>);
        }
        handleCloseModal();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">{t('teamDashboard')}</h1>
                    <p className="text-gray-400 mt-1">{t('welcomeUser')}, {user.name.split(' ')[0]}!</p>
                </div>
                {user.role === Role.COACH && (
                    <button
                        onClick={handleOpenAddModal}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        {t('addEvent')}
                    </button>
                )}
            </div>

            <Calendar 
              user={user} 
              events={events} 
              users={users} 
              onRsvp={onRsvp} 
              onEdit={handleOpenEditModal}
              onDelete={onDeleteEvent}
            />

            {isModalOpen && user.role === Role.COACH && (
                <EventModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveEvent}
                    eventToEdit={editingEvent}
                />
            )}
        </div>
    );
};

export default Dashboard;