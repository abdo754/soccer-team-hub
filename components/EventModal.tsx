
import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Omit<Event, 'id' | 'rsvps'> | Event) => void;
    eventToEdit?: Event | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, eventToEdit }) => {
    const [type, setType] = useState<'practice' | 'game'>('practice');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [details, setDetails] = useState('');
    const { t } = useLanguage();

    const isEditing = !!eventToEdit;

    useEffect(() => {
        if (isEditing && isOpen) {
            setType(eventToEdit.type);
            setTitle(eventToEdit.title);
            setDate(eventToEdit.date);
            setTime(eventToEdit.time);
            setLocation(eventToEdit.location);
            setDetails(eventToEdit.details || '');
        } else if (!isEditing) {
            setType('practice');
            setTitle('');
            setDate('');
            setTime('');
            setLocation('');
            setDetails('');
        }
    }, [eventToEdit, isEditing, isOpen]);


    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const eventData = { type, title, date, time, location, details };
        if (isEditing) {
            onSave({ ...eventToEdit, ...eventData });
        } else {
            onSave(eventData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all">
                <h2 className="text-2xl font-bold mb-6 text-emerald-400">{isEditing ? t('editEventTitle') : t('addEventTitle')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4 text-left rtl:text-right">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">{t('eventType')}</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'practice' | 'game')}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option value="practice">{t('practice')}</option>
                            <option value="game">{t('game')}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">{t('title')}</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">{t('date')}</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">{t('time')}</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">{t('location')}</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">{t('detailsOptional')}</label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold transition"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition"
                        >
                            {isEditing ? t('saveChanges') : t('saveEvent')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal;