
import React, { useState, useEffect, useRef } from 'react';
import { User, Role } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { CameraIcon } from './icons/CameraIcon';
import { EditIcon } from './icons/EditIcon';

interface ProfileProps {
    user: User;
    onUpdateUser: (user: User) => void;
}

const ProfileDetail: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => {
    if ((!value && value !== 0) || value === '') return null;
    return (
        <div className="flex flex-col">
            <span className="text-sm text-gray-400">{label}</span>
            <span className="text-lg font-semibold">{value}</span>
        </div>
    );
};


const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
    const { t } = useLanguage();
    const roleLabel = user.role === Role.COACH ? t('coach') : t('player');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<User>(user);

    useEffect(() => {
        if (!isEditing) {
            setFormData(user);
        }
    }, [user, isEditing]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const newAvatar = reader.result as string;
                onUpdateUser({ ...user, avatar: newAvatar });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'jerseyNumber' ? (value === '' ? undefined : parseInt(value, 10)) : value
        }));
    };

    const handleSave = () => {
        const finalData = { ...formData };
        if (typeof finalData.jerseyNumber === 'number' && isNaN(finalData.jerseyNumber)) {
            finalData.jerseyNumber = undefined;
        }
        onUpdateUser(finalData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
    };
    
    return (
        <div>
            <h1 className="text-4xl font-black tracking-tight mb-8">{t('myProfile')}</h1>
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 relative group">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-emerald-400 object-cover"
                    />
                     <div 
                        onClick={handleAvatarClick}
                        className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center cursor-pointer transition-opacity duration-300"
                        aria-label="Change profile picture"
                    >
                        <CameraIcon className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>
                <div className="w-full text-center md:text-left rtl:md:text-right relative">
                        {isEditing ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">{t('fullName')}</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                {user.role === Role.PLAYER && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="position" className="block text-sm font-medium text-gray-300">{t('position')}</label>
                                            <input
                                                id="position"
                                                name="position"
                                                type="text"
                                                value={formData.position || ''}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="jerseyNumber" className="block text-sm font-medium text-gray-300">{t('jerseyNumber')}</label>
                                            <input
                                                id="jerseyNumber"
                                                name="jerseyNumber"
                                                type="number"
                                                value={formData.jerseyNumber ?? ''}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-end gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold transition"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="py-2 px-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition"
                                    >
                                        {t('saveChanges')}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="absolute -top-4 -right-4 md:top-0 md:right-0 rtl:right-auto rtl:left-0 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition"
                                    aria-label={t('editProfile')}
                                >
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                <div className="text-center md:text-left rtl:md:text-right">
                                    <h2 className="text-3xl font-bold">{user.name}</h2>
                                    <p className={`text-xl font-medium ${user.role === Role.COACH ? 'text-emerald-400' : 'text-gray-300'}`}>
                                        {roleLabel}
                                    </p>
                                    {user.role === Role.PLAYER && (
                                        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4">
                                            <ProfileDetail label={t('position')} value={user.position} />
                                            <ProfileDetail label={t('jerseyNumber')} value={user.jerseyNumber} />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
            </div>
        </div>
    );
};

export default Profile;
