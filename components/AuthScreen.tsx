
import React, { useState, FormEvent } from 'react';
import { User, Role } from '../types';
import { TeamIcon } from './icons/TeamIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageIcon } from './icons/LanguageIcon';
import { CameraIcon } from './icons/CameraIcon';

const AuthInput: React.FC<React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement>> = (props) => (
    <input
        {...props}
        className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-emerald-500 focus:border-emerald-500 text-white ${props.className}`}
    />
);

const AuthSelect: React.FC<React.InputHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select
        {...props}
        className={`mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-emerald-500 focus:border-emerald-500 text-white ${props.className}`}
    >
        {props.children}
    </select>
);

const AuthLabel: React.FC<{ htmlFor: string, children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 text-left rtl:text-right">{children}</label>
);

interface LoginFormProps {
    onLogin: (name: string, password: string) => void;
    toggleView: () => void;
    error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, toggleView, error }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const { t } = useLanguage();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onLogin(name, password);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-center text-white mb-2">{t('welcomeBack')}</h2>
            <p className="text-center text-gray-400 mb-8">{t('loginPrompt')}</p>
            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md mb-4 text-center">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <AuthLabel htmlFor="name">{t('fullName')}</AuthLabel>
                    <AuthInput id="name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Alex Johnson" />
                </div>
                <div>
                    <AuthLabel htmlFor="password">{t('password')}</AuthLabel>
                    <AuthInput id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                </div>
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                    {t('login')}
                </button>
            </form>
            <p className="text-center mt-6 text-gray-400">
                {t('dontHaveAccount')}{' '}
                <button onClick={toggleView} className="font-semibold text-emerald-400 hover:underline">
                    {t('signUp')}
                </button>
            </p>
        </div>
    );
};

interface SignUpFormProps {
    onSignUp: (data: Omit<User, 'id'>) => void;
    toggleView: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUp, toggleView }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>(Role.PLAYER);
    const [position, setPosition] = useState('');
    const [jerseyNumber, setJerseyNumber] = useState('');
    const [avatar, setAvatar] = useState<string>('');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarError, setAvatarError] = useState<string | null>(null);
    const { t } = useLanguage();

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setAvatar(result);
                setAvatarPreview(result);
                setAvatarError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!avatar) {
            setAvatarError(t('profilePictureRequired'));
            return;
        }
        const newUser: Omit<User, 'id'> = {
            name,
            password,
            role,
            avatar,
            ...(role === Role.PLAYER && { position, jerseyNumber: parseInt(jerseyNumber, 10) || undefined })
        };
        onSignUp(newUser);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-center text-white mb-2">{t('createAccount')}</h2>
            <p className="text-center text-gray-400 mb-8">{t('joinTeamHub')}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <AuthLabel htmlFor="avatar">{t('profilePicture')}</AuthLabel>
                    <div className="mt-1 flex justify-center">
                        <label htmlFor="avatar-upload" className="cursor-pointer group">
                            <div className={`w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-dashed ${avatarError ? 'border-red-500' : 'border-gray-500'} group-hover:border-emerald-400 transition relative`}>
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="text-center p-2">
                                        <CameraIcon className="w-8 h-8 mx-auto text-gray-500 group-hover:text-emerald-400 transition" />
                                        <span className="text-xs mt-1 block">{t('uploadPicture')}</span>
                                    </div>
                                )}
                            </div>
                        </label>
                        <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} required />
                    </div>
                     {avatarError && <p className="text-red-400 text-xs text-center mt-1">{avatarError}</p>}
                </div>
                <div>
                    <AuthLabel htmlFor="signup-name">{t('fullName')}</AuthLabel>
                    <AuthInput id="signup-name" type="text" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                    <AuthLabel htmlFor="signup-password">{t('password')}</AuthLabel>
                    <AuthInput id="signup-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div>
                    <AuthLabel htmlFor="role">{t('iAmA')}</AuthLabel>
                    <AuthSelect id="role" value={role} onChange={e => setRole(e.target.value as Role)}>
                        <option value={Role.PLAYER}>{t('player')}</option>
                        <option value={Role.COACH}>{t('coach')}</option>
                    </AuthSelect>
                </div>
                {role === Role.PLAYER && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <AuthLabel htmlFor="position">{t('position')}</AuthLabel>
                                <AuthInput id="position" type="text" value={position} onChange={e => setPosition(e.target.value)} />
                            </div>
                            <div>
                                <AuthLabel htmlFor="jerseyNumber">{t('jerseyNumber')}</AuthLabel>
                                <AuthInput id="jerseyNumber" type="number" value={jerseyNumber} onChange={e => setJerseyNumber(e.target.value)} />
                            </div>
                        </div>
                    </>
                )}
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 mt-6 !mb-4">
                    {t('signUp')}
                </button>
            </form>
            <p className="text-center mt-6 text-gray-400">
                {t('alreadyHaveAccount')}{' '}
                <button onClick={toggleView} className="font-semibold text-emerald-400 hover:underline">
                    {t('login')}
                </button>
            </p>
        </div>
    );
};


interface AuthScreenProps {
    onLogin: (name: string, password: string) => void;
    onSignUp: (data: Omit<User, 'id'>) => void;
    loginError: string | null;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onSignUp, loginError }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative">
            <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
                 <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-gray-700 hover:text-white"
                    aria-label="Toggle Language"
                >
                    <LanguageIcon className="h-6 w-6" />
                    <span className="text-sm font-semibold">{language === 'en' ? 'العربية' : 'English'}</span>
                </button>
            </div>

            <div className="text-center mb-10">
                <TeamIcon className="w-20 h-20 mx-auto text-emerald-400" />
                <h1 className="text-4xl sm:text-5xl font-black text-white mt-4 tracking-tight">{t('soccerTeamHub')}</h1>
            </div>

            <div className="w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-2xl">
                {isLoginView ?
                    <LoginForm onLogin={onLogin} error={loginError} toggleView={() => setIsLoginView(false)} /> :
                    <SignUpForm onSignUp={onSignUp} toggleView={() => setIsLoginView(true)} />
                }
            </div>
        </div>
    );
};

export default AuthScreen;
