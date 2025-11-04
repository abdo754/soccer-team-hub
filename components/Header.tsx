
import React from 'react';
import { View } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';
import { ChatIcon } from './icons/ChatIcon';
import { ProfileIcon } from './icons/ProfileIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { TeamIcon } from './icons/TeamIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageIcon } from './icons/LanguageIcon';

interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
    onLogout: () => void;
}

const NavButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
            isActive ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
        aria-label={label}
    >
        {icon}
        <span className="text-xs mt-1 hidden md:inline">{label}</span>
    </button>
);


const Header: React.FC<HeaderProps> = ({ currentView, setView, onLogout }) => {
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <header className="fixed top-0 left-0 rtl:left-auto rtl:right-0 h-full w-16 md:w-20 bg-gray-800 flex flex-col items-center justify-between p-2 md:p-3 z-10 shadow-lg">
            <div>
                <div className="p-2 mb-6 text-emerald-400">
                   <TeamIcon className="h-8 w-8 md:h-10 md:w-10" />
                </div>
                <nav className="flex flex-col items-center space-y-4">
                    <NavButton
                        label={t('dashboard')}
                        icon={<CalendarIcon className="h-6 w-6" />}
                        isActive={currentView === View.DASHBOARD}
                        onClick={() => setView(View.DASHBOARD)}
                    />
                    <NavButton
                        label={t('chat')}
                        icon={<ChatIcon className="h-6 w-6" />}
                        isActive={currentView === View.CHAT}
                        onClick={() => setView(View.CHAT)}
                    />
                    <NavButton
                        label={t('profile')}
                        icon={<ProfileIcon className="h-6 w-6" />}
                        isActive={currentView === View.PROFILE}
                        onClick={() => setView(View.PROFILE)}
                    />
                </nav>
            </div>
            <div className="w-full space-y-2">
                 <button
                    onClick={toggleLanguage}
                    className="w-full flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-gray-700 hover:text-white"
                    aria-label="Toggle Language"
                >
                    <LanguageIcon className="h-6 w-6" />
                    <span className="text-xs mt-1 hidden md:inline">{language === 'en' ? 'العربية' : 'English'}</span>
                </button>
                <NavButton
                    label={t('logout')}
                    icon={<LogoutIcon className="h-6 w-6" />}
                    isActive={false}
                    onClick={onLogout}
                />
            </div>
        </header>
    );
};

export default Header;