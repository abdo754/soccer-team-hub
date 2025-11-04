
import React from 'react';
import { User, Event, Role } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CalendarProps {
    user: User;
    events: Event[];
    users: User[];
    onRsvp: (eventId: string, userId: string, status: 'yes' | 'no' | 'maybe') => void;
    onEdit: (event: Event) => void;
    onDelete: (eventId: string) => void;
}

const RSVPButton: React.FC<{
    status: 'yes' | 'no' | 'maybe';
    currentStatus?: 'yes' | 'no' | 'maybe';
    onClick: () => void;
}> = ({ status, currentStatus, onClick }) => {
    const { t } = useLanguage();
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-semibold transition-transform transform hover:scale-110';
    const activeClasses = {
        yes: 'bg-green-500 text-white',
        no: 'bg-red-500 text-white',
        maybe: 'bg-yellow-500 text-white',
    };
    const inactiveClasses = 'bg-gray-600 text-gray-300 hover:bg-gray-500';

    const isActive = status === currentStatus;
    
    const labels = {
        yes: t('yes'),
        no: t('no'),
        maybe: t('maybe'),
    };

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${isActive ? activeClasses[status] : inactiveClasses}`}
        >
            {labels[status]}
        </button>
    );
};


const EventCard: React.FC<{ event: Event; user: User; users: User[]; onRsvp: CalendarProps['onRsvp']; onEdit: CalendarProps['onEdit']; onDelete: CalendarProps['onDelete'] }> = ({ event, user, users, onRsvp, onEdit, onDelete }) => {
    const eventDate = new Date(event.date + 'T00:00:00');
    const day = eventDate.getDate();
    const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    const dayOfWeek = eventDate.toLocaleString('default', { weekday: 'long' });
    const { t } = useLanguage();

    const isPractice = event.type === 'practice';
    const eventTypeLabel = isPractice ? t('practice') : t('game');
    const userRsvp = event.rsvps.find(r => r.userId === user.id)?.status;
    
    const getUsersByRsvp = (status: 'yes' | 'no' | 'maybe') => {
        return event.rsvps
            .filter(r => r.status === status)
            .map(r => users.find(u => u.id === r.userId))
            .filter((u): u is User => !!u);
    };

    const attendingUsers = getUsersByRsvp('yes');
    const maybeUsers = getUsersByRsvp('maybe');
    const notAttendingUsers = getUsersByRsvp('no');


    const PlayerList: React.FC<{players: User[]}> = ({ players }) => (
        <div className="space-y-2">
            {players.map(u => (
                <div key={u.id} className="flex items-center bg-gray-700 rounded-full p-1 pr-2 rtl:pr-1 rtl:pl-2">
                    <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full mr-2 rtl:mr-0 rtl:ml-2" />
                    <span className="text-xs font-medium">{u.name}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-gray-800 rounded-xl shadow-lg flex flex-col sm:flex-row overflow-hidden transform transition-all duration-300 hover:shadow-emerald-500/20 hover:-translate-y-1">
            <div className={`flex-shrink-0 w-full sm:w-24 h-24 sm:h-auto flex sm:flex-col items-center justify-center p-4 text-white ${isPractice ? 'bg-blue-600' : 'bg-red-600'}`}>
                <span className="text-4xl font-black mr-4 sm:mr-0">{day}</span>
                <div className="flex flex-col items-center sm:block">
                    <span className="text-lg font-bold">{month}</span>
                    <span className="text-sm sm:hidden ml-2">{dayOfWeek}</span>
                </div>
            </div>
            <div className="flex-1 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">{eventTypeLabel}</p>
                        <h3 className="text-xl font-bold text-white">{event.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{dayOfWeek} at {event.time} @ {event.location}</p>
                         {event.details && <p className="text-sm text-gray-300 mt-2">{event.details}</p>}
                    </div>
                     <div className="flex space-x-2 rtl:space-x-reverse mt-4 sm:mt-0">
                        {user.role === Role.PLAYER && (
                            <>
                                <RSVPButton status="yes" currentStatus={userRsvp} onClick={() => onRsvp(event.id, user.id, 'yes')} />
                                <RSVPButton status="maybe" currentStatus={userRsvp} onClick={() => onRsvp(event.id, user.id, 'maybe')} />
                                <RSVPButton status="no" currentStatus={userRsvp} onClick={() => onRsvp(event.id, user.id, 'no')} />
                            </>
                        )}
                        {user.role === Role.COACH && (
                            <>
                                <button
                                    onClick={() => onEdit(event)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg text-sm transition-transform transform hover:scale-105"
                                    aria-label={`Edit event: ${event.title}`}
                                >
                                    {t('edit')}
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm(t('cancelEventConfirm', { title: event.title }))) {
                                            onDelete(event.id);
                                        }
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg text-sm transition-transform transform hover:scale-105"
                                    aria-label={`Cancel event: ${event.title}`}
                                >
                                    {t('cancelEvent')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
                
                 {user.role === Role.COACH && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <h4 className="text-sm font-semibold text-green-400 mb-2">{t('attending')} ({attendingUsers.length})</h4>
                                {attendingUsers.length > 0 ? <PlayerList players={attendingUsers} /> : <p className="text-xs text-gray-500">{t('noneYet')}</p>}
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-yellow-400 mb-2">{t('maybe')} ({maybeUsers.length})</h4>
                                {maybeUsers.length > 0 ? <PlayerList players={maybeUsers} /> : <p className="text-xs text-gray-500">{t('noneYet')}</p>}
                            </div>
                             <div>
                                <h4 className="text-sm font-semibold text-red-400 mb-2">{t('notAttending')} ({notAttendingUsers.length})</h4>
                                {notAttendingUsers.length > 0 ? <PlayerList players={notAttendingUsers} /> : <p className="text-xs text-gray-500">{t('noneYet')}</p>}
                            </div>
                        </div>
                    </div>
                 )}
            </div>
        </div>
    );
};

const Calendar: React.FC<CalendarProps> = ({ user, events, users, onRsvp, onEdit, onDelete }) => {
    const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const upcomingEvents = sortedEvents.filter(e => new Date(e.date) >= new Date(new Date().toDateString()));
    const pastEvents = sortedEvents.filter(e => new Date(e.date) < new Date(new Date().toDateString()));
    const { t } = useLanguage();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4 text-emerald-400">{t('upcomingEvents')}</h2>
                {upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingEvents.map(event => (
                            <EventCard key={event.id} event={event} user={user} users={users} onRsvp={onRsvp} onEdit={onEdit} onDelete={onDelete} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 bg-gray-800 p-4 rounded-lg">{t('noUpcomingEvents')}</p>
                )}
            </div>
             <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-500">{t('pastEvents')}</h2>
                {pastEvents.length > 0 ? (
                    <div className="space-y-4 opacity-60">
                        {pastEvents.map(event => (
                            <EventCard key={event.id} event={event} user={user} users={users} onRsvp={onRsvp} onEdit={onEdit} onDelete={onDelete} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 bg-gray-800 p-4 rounded-lg">{t('noPastEvents')}</p>
                )}
            </div>
        </div>
    );
};

export default Calendar;