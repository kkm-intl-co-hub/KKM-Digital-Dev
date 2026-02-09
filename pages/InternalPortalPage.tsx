import * as React from 'react';
import { useLanguage } from '../LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '../types';

// Types
type UserRole = 'Admin' | 'Manager' | 'Employee' | 'Reviewer' | 'Contributor' | 'Guest';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department: string;
    status: 'Active' | 'Inactive';
    passwordHash: string;
    salt: string;
    requiresPasswordChange: boolean;
    lastLogin?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    error: string | null;
}

// --- SECURITY UTILS ---

const generateSalt = (): string => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const hashPassword = async (password: string, salt: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

// Helper to generate email based on format: first_initial.lastname@kkm-intl.org
const generateEmail = (fullName: string): string => {
    const cleanName = fullName.replace(/^(Dr\.|Mr\.|Ms\.)\s+/i, '').trim();
    const parts = cleanName.split(' ');
    if (parts.length < 2) return `${cleanName.toLowerCase()}@kkm-intl.org`;
    
    const firstInitial = parts[0][0].toLowerCase();
    const lastName = parts[parts.length - 1].toLowerCase();
    return `${firstInitial}.${lastName}@kkm-intl.org`;
};

// Initial Personnel Data
const PERSONNEL_DATA = [
    { name: 'Gino Ayyoubian', role: 'Admin', dept: 'Executive Office' },
    { name: 'Reza Asakereh', role: 'Admin', dept: 'Technology & AI' },
    { name: 'Khosro Jarrahian', role: 'Admin', dept: 'Science & Sustainability' },
    { name: 'Farid Imani', role: 'Admin', dept: 'Investment' },
    { name: 'Pedram Abdarzadeh', role: 'Admin', dept: 'Finance' },
    { name: 'HeidarYarveicy', role: 'Admin', dept: 'Operations' },
    { name: 'Salar Hashemi', role: 'Manager', dept: 'Energy Systems' },
    { name: 'Mahdi Ghiasy', role: 'Manager', dept: 'BIM & Digital Twin' },
    { name: 'Ashkan Tofangchiha', role: 'Manager', dept: 'QA/QC' },
    { name: 'Mostafa Sharifi', role: 'Manager', dept: 'OpEx' },
    { name: 'Badie Razi', role: 'Manager', dept: 'Process Engineering' },
    { name: 'Masoumeh Moshar', role: 'Manager', dept: 'Public Relations' },
    { name: 'Hamed Zatajam', role: 'Manager', dept: 'Legal' },
    { name: 'Seyed Jasem Hosseini', role: 'Manager', dept: 'HSE' },
    { name: 'Masoumeh Einabadi', role: 'Employee', dept: 'Biomedical R&D' },
    { name: 'Sina Ayyoubian', role: 'Employee', dept: 'R&D Innovation' },
    { name: 'Reza Baghdadchi', role: 'Reviewer', dept: 'Regulatory Affairs' },
];

// --- LOGIN COMPONENT ---
interface LoginViewProps {
    onLogin: (user: User) => void;
    userDatabase: User[];
    onUpdateUser: (updatedUser: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, userDatabase, onUpdateUser }) => {
    const { t } = useLanguage();
    const [viewMode, setViewMode] = React.useState<'login' | 'setup'>('login');
    const [loading, setLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [pendingUser, setPendingUser] = React.useState<User | null>(null);

    // Initial password from Env or fallback for the 'first login' simulation
    const initialTempPassword = process.env.REACT_APP_INITIAL_PASSWORD || "KKM-Temp-2025";

    const handleVerifyCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const foundUser = userDatabase.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
            
            if (!foundUser) {
                // Artificial delay to prevent timing attacks
                await new Promise(r => setTimeout(r, 800));
                throw new Error(t('LoginFailed'));
            }

            if (foundUser.status !== 'Active') {
                await new Promise(r => setTimeout(r, 800));
                throw new Error("Account is inactive. Contact Administrator.");
            }

            const hash = await hashPassword(password, foundUser.salt);
            
            if (hash !== foundUser.passwordHash) {
                await new Promise(r => setTimeout(r, 800));
                throw new Error(t('LoginFailed'));
            }

            // Credentials Valid
            if (foundUser.requiresPasswordChange) {
                setPendingUser(foundUser);
                setViewMode('setup');
                setLoading(false);
            } else {
                onLogin(foundUser);
            }

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSetNewPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pendingUser) return;
        
        setError('');
        
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            // Re-hash new password with existing salt (or generate new one for rotation)
            const newHash = await hashPassword(newPassword, pendingUser.salt);
            
            const updatedUser: User = {
                ...pendingUser,
                passwordHash: newHash,
                requiresPasswordChange: false,
                lastLogin: new Date().toISOString()
            };

            onUpdateUser(updatedUser);
            
            // Auto login after update
            setTimeout(() => {
                onLogin(updatedUser);
            }, 500);

        } catch (err) {
            setError("Failed to update password.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 px-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl max-w-md w-full border-t-4 border-primary relative overflow-hidden"
            >
                <div className="text-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-primary/5 dark:bg-secondary/5 rounded-full flex items-center justify-center mx-auto mb-4 text-primary dark:text-secondary shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-display font-bold text-text-dark dark:text-white tracking-tight">
                        {viewMode === 'login' ? t('InternalPortalLoginTitle') : 'Security Setup'}
                    </h1>
                    <p className="text-text-light dark:text-slate-400 mt-2 text-xs uppercase tracking-widest">
                        {viewMode === 'login' ? t('InternalPortalLoginSubtitle') : 'Create a new secure password'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {viewMode === 'login' ? (
                        <motion.form 
                            key="login-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleVerifyCredentials} 
                            className="space-y-5 relative z-10"
                        >
                            <div>
                                <label className="block text-sm font-bold text-text-dark dark:text-slate-300 mb-1">{t('EmployeeID')}</label>
                                <input 
                                    type="email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all text-text-dark" 
                                    placeholder="user@kkm-intl.org"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-dark dark:text-slate-300 mb-1">{t('Password')}</label>
                                <input 
                                    type="password" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all text-text-dark" 
                                    placeholder="••••••••"
                                />
                            </div>
                            
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg flex items-center gap-2 animate-pulse">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                     {error}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-3 bg-primary hover:bg-secondary text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : t('LoginButton')}
                            </button>
                            
                            <div className="text-center mt-4 border-t border-gray-200 dark:border-slate-700 pt-4">
                                <p className="text-xs text-text-light dark:text-slate-500 mb-2">
                                    Initial Setup? Use temporary credential provided by IT.
                                    <br/><span className="font-mono text-xs opacity-50 select-all">({initialTempPassword})</span>
                                </p>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="setup-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSetNewPassword}
                            className="space-y-5 relative z-10"
                        >
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-sm text-yellow-800 dark:text-yellow-200 mb-4">
                                For your security, you must update your password before proceeding.
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-dark dark:text-slate-300 mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    required 
                                    value={newPassword}
                                    onChange={(e) => setNewUserPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all text-text-dark" 
                                    placeholder="Min 8 characters"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-dark dark:text-slate-300 mb-1">Confirm Password</label>
                                <input 
                                    type="password" 
                                    required 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all text-text-dark" 
                                    placeholder="Re-enter password"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg flex items-center gap-2">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                     {error}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 flex justify-center items-center"
                            >
                                {loading ? 'Updating...' : 'Update & Login'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );

    // Wrapper for setting password state to allow validation logic inside render if needed
    function setNewUserPassword(val: string) {
        setNewPassword(val);
        // Real-time strength check could go here
    }
};

// --- WIDGETS ---
const DashboardWidget: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-6 flex flex-col ${className}`}>
        <h3 className="font-display font-bold text-lg text-primary-dark dark:text-secondary mb-4 pb-2 border-b dark:border-slate-700 flex justify-between items-center">
            {title}
            <div className="h-1.5 w-1.5 rounded-full bg-accent-yellow"></div>
        </h3>
        <div className="flex-grow">{children}</div>
    </div>
);

const TaskItem: React.FC<{ title: string; subtitle: string; t: (key: string) => string }> = ({ title, subtitle, t }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg mb-2 last:mb-0 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-400 group-hover:bg-primary transition-colors"></div>
            <div>
                <p className="font-semibold text-sm text-text-dark dark:text-slate-200">{title}</p>
                <p className="text-xs text-text-light dark:text-slate-400">{subtitle}</p>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded" title={t('Approve')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </button>
            <button className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded" title={t('Reject')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
        </div>
    </div>
);

const DeskIcon: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <button className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-slate-600">
        <div className="text-primary-dark dark:text-secondary group-hover:scale-110 transition-transform duration-300 mb-2">
            {icon}
        </div>
        <span className="text-xs font-medium text-text-light dark:text-slate-300">{label}</span>
    </button>
);

// --- USER MANAGEMENT (ADMIN) ---
interface UserManagementProps {
    users: User[];
    onCreateUser: (newUser: Partial<User>) => void;
}

const UserManagementView: React.FC<UserManagementProps> = ({ users, onCreateUser }) => {
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [newUser, setNewUser] = React.useState<Partial<User>>({ role: 'Employee', status: 'Active' });
    const [successMsg, setSuccessMsg] = React.useState('');

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUser.name) {
            onCreateUser(newUser);
            setNewUser({ role: 'Employee', status: 'Active', name: '', email: '', department: '' });
            setSuccessMsg(t('Msg_UserCreated'));
            setTimeout(() => {
                setSuccessMsg('');
                setIsModalOpen(false);
            }, 1500);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-display font-bold text-text-dark dark:text-white">{t('UserManagementTitle')}</h2>
                    <p className="text-text-light dark:text-slate-400 text-sm">{t('UserManagementSubtitle')}</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2 bg-primary hover:bg-secondary text-white font-bold rounded-lg shadow-md transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    {t('CreateUser')}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="p-4 text-xs font-bold text-text-light dark:text-slate-400 uppercase tracking-wider">{t('Tbl_Name')}</th>
                                <th className="p-4 text-xs font-bold text-text-light dark:text-slate-400 uppercase tracking-wider">{t('Tbl_Email')}</th>
                                <th className="p-4 text-xs font-bold text-text-light dark:text-slate-400 uppercase tracking-wider">{t('Tbl_Role')}</th>
                                <th className="p-4 text-xs font-bold text-text-light dark:text-slate-400 uppercase tracking-wider">{t('Tbl_Department')}</th>
                                <th className="p-4 text-xs font-bold text-text-light dark:text-slate-400 uppercase tracking-wider">{t('Tbl_Status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4 font-semibold text-text-dark dark:text-white">{user.name}</td>
                                    <td className="p-4 text-text-light dark:text-slate-300 font-mono text-sm">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-text-light dark:text-slate-300">{user.department}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                            {t(`Status_${user.status}`)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6 relative"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            
                            <h3 className="text-xl font-display font-bold text-primary dark:text-white mb-6">{t('Modal_CreateUserTitle')}</h3>
                            
                            {successMsg ? (
                                <div className="p-4 bg-green-100 text-green-700 rounded-lg text-center font-bold mb-4">{successMsg}</div>
                            ) : (
                                <form onSubmit={handleCreateUser} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-light dark:text-slate-300 mb-1">{t('Lbl_FullName')}</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={newUser.name || ''}
                                            onChange={e => setNewUser({...newUser, name: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-light dark:text-slate-300 mb-1">{t('Lbl_Email')}</label>
                                        <input 
                                            type="email" 
                                            placeholder="Optional (Auto-generated if blank)"
                                            value={newUser.email || ''}
                                            onChange={e => setNewUser({...newUser, email: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text-light dark:text-slate-300 mb-1">{t('Lbl_Role')}</label>
                                            <select 
                                                value={newUser.role}
                                                onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                            >
                                                <option value="Employee">Employee</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-light dark:text-slate-300 mb-1">{t('Lbl_Dept')}</label>
                                            <input 
                                                type="text" 
                                                value={newUser.department || ''}
                                                onChange={e => setNewUser({...newUser, department: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button type="submit" className="w-full py-2 bg-primary hover:bg-secondary text-white font-bold rounded-lg shadow transition-colors">
                                            {t('Btn_Generate')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const OverviewView: React.FC = () => {
    const { t } = useLanguage();
    const [isRemote, setIsRemote] = React.useState(true);
    const [isCheckedIn, setIsCheckedIn] = React.useState(true);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <DashboardWidget title={t('RemoteWork')}>
                <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between mb-6 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                        <span className={`text-sm font-bold ${isRemote ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                            {isRemote ? t('WorkingRemotely') : t('InOffice')}
                        </span>
                        <div 
                            className={`w-12 h-6 flex items-center bg-gray-300 dark:bg-slate-600 rounded-full p-1 cursor-pointer transition-colors ${isRemote ? 'bg-primary dark:bg-secondary' : ''}`}
                            onClick={() => setIsRemote(!isRemote)}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isRemote ? 'translate-x-6' : ''}`}></div>
                        </div>
                    </div>
                    
                    <div className="text-center mb-6">
                        <div className="text-3xl font-mono font-bold text-text-dark dark:text-white mb-1">04:32:15</div>
                        <div className="text-xs text-text-light dark:text-slate-400 uppercase tracking-wider">{t('CurrentSession')}</div>
                    </div>

                    <button 
                        onClick={() => setIsCheckedIn(!isCheckedIn)}
                        className={`w-full py-2 rounded-lg font-bold transition-colors ${isCheckedIn ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'}`}
                    >
                        {isCheckedIn ? t('CheckOut') : t('CheckIn')}
                    </button>
                </div>
            </DashboardWidget>

            <DashboardWidget title={t('AdminAutomation')}>
                <div className="mb-3 flex justify-between items-center">
                    <span className="text-xs font-semibold uppercase text-text-light dark:text-slate-400">{t('PendingTasks')}</span>
                    <span className="bg-accent-yellow text-text-dark text-xs font-bold px-2 py-0.5 rounded-full">3</span>
                </div>
                <div className="space-y-1">
                    <TaskItem title={t('Task_LeaveRequest')} subtitle="Ali Rezaei - 3 Days" t={t} />
                    <TaskItem title={t('Task_PurchaseOrder')} subtitle="IT Dept - Monitors" t={t} />
                    <TaskItem title={t('Task_TravelExp')} subtitle="Site Visit - Qeshm" t={t} />
                </div>
                <button className="w-full mt-4 py-2 border border-gray-200 dark:border-slate-600 rounded text-sm font-medium text-text-light dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    View All Tasks
                </button>
            </DashboardWidget>

            <DashboardWidget title={t('ElectronicDesk')}>
                <div className="grid grid-cols-3 gap-2">
                    <DeskIcon label={t('Tool_Mail')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
                    <DeskIcon label={t('Tool_Calendar')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                    <DeskIcon label={t('Tool_Drive')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>} />
                    <DeskIcon label={t('Tool_DMS')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
                    <DeskIcon label={t('Tool_HR')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                    <DeskIcon label={t('Tool_IT')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>} />
                </div>
            </DashboardWidget>
        </motion.div>
    );
}

// --- MAIN PORTAL PAGE (Container) ---
const InternalPortalPage: React.FC = () => {
    const { t } = useLanguage();
    const [auth, setAuth] = React.useState<AuthState>({ isAuthenticated: false, user: null, error: null });
    const [currentView, setCurrentView] = React.useState<'Dashboard' | 'UserManagement' | 'Automation'>('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [userDatabase, setUserDatabase] = React.useState<User[]>([]);
    const [dbInitialized, setDbInitialized] = React.useState(false);

    // Initialize Mock Database in LocalStorage securely
    React.useEffect(() => {
        const initDB = async () => {
            try {
                const storedUsers = localStorage.getItem('kkm_portal_users');
                if (storedUsers) {
                    setUserDatabase(JSON.parse(storedUsers));
                } else {
                    // Seed initial data with hashed passwords
                    const initialTempPassword = process.env.REACT_APP_INITIAL_PASSWORD || "KKM-Temp-2025";
                    
                    const seededUsers: User[] = await Promise.all(PERSONNEL_DATA.map(async (person, index) => {
                        const salt = generateSalt();
                        const passwordHash = await hashPassword(initialTempPassword, salt);
                        return {
                            id: (index + 1).toString(),
                            name: person.name,
                            email: generateEmail(person.name),
                            role: person.role as UserRole,
                            department: person.dept,
                            status: 'Active',
                            passwordHash: passwordHash,
                            salt: salt,
                            requiresPasswordChange: true // Force rotation on first login
                        };
                    }));
                    
                    localStorage.setItem('kkm_portal_users', JSON.stringify(seededUsers));
                    setUserDatabase(seededUsers);
                }
                setDbInitialized(true);
            } catch (e) {
                console.error("Failed to initialize secure DB", e);
            }
        };
        initDB();
    }, []);

    const handleUpdateUser = (updatedUser: User) => {
        const newDb = userDatabase.map(u => u.id === updatedUser.id ? updatedUser : u);
        setUserDatabase(newDb);
        localStorage.setItem('kkm_portal_users', JSON.stringify(newDb));
        if (auth.user && auth.user.id === updatedUser.id) {
            setAuth(prev => ({ ...prev, user: updatedUser }));
        }
    };

    const handleCreateUser = async (newUserPartial: Partial<User>) => {
        if (!newUserPartial.name) return;
        
        const initialTempPassword = process.env.REACT_APP_INITIAL_PASSWORD || "KKM-Temp-2025";
        const salt = generateSalt();
        const hash = await hashPassword(initialTempPassword, salt);
        
        const newUser: User = {
            id: (Date.now()).toString(),
            name: newUserPartial.name,
            email: newUserPartial.email && newUserPartial.email.includes('@') ? newUserPartial.email : generateEmail(newUserPartial.name),
            role: newUserPartial.role || 'Employee',
            department: newUserPartial.department || 'General',
            status: 'Active',
            passwordHash: hash,
            salt: salt,
            requiresPasswordChange: true
        };

        const newDb = [...userDatabase, newUser];
        setUserDatabase(newDb);
        localStorage.setItem('kkm_portal_users', JSON.stringify(newDb));
    };

    const handleLogout = () => {
        setAuth({ isAuthenticated: false, user: null, error: null });
        setCurrentView('Dashboard');
    };

    if (!dbInitialized) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Initializing Secure Vault...</div>;

    if (!auth.isAuthenticated || !auth.user) {
        return (
            <LoginView 
                onLogin={(user) => setAuth({ isAuthenticated: true, user, error: null })} 
                userDatabase={userDatabase}
                onUpdateUser={handleUpdateUser}
            />
        );
    }

    const isAdmin = auth.user.role === 'Admin';

    const NavItem: React.FC<{ view: typeof currentView; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
        <button
            onClick={() => { setCurrentView(view); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === view ? 'bg-primary text-white shadow-md' : 'text-text-light dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">
            {/* Sidebar Mobile Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-800 shadow-xl lg:shadow-none border-r border-gray-200 dark:border-slate-700 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                    <h2 className="text-xl font-display font-bold text-primary dark:text-white tracking-wide">KKM PORTAL</h2>
                    <button className="lg:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}>&times;</button>
                </div>
                
                <div className="p-4 space-y-2">
                    <div className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-4 mt-4">Main Menu</div>
                    <NavItem 
                        view="Dashboard" 
                        label={t('Nav_Dashboard')} 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                    />
                    <NavItem 
                        view="Automation" 
                        label={t('Nav_Automation')} 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />

                    {isAdmin && (
                        <>
                        <div className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-4 mt-6">Administration</div>
                        <NavItem 
                            view="UserManagement" 
                            label={t('Nav_UserMgmt')} 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                        />
                        </>
                    )}
                </div>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                     <a href="https://portal.kkm-intl.org" target="_blank" rel="noopener noreferrer" className="block w-full text-center text-xs font-bold text-accent-dark dark:text-accent-yellow hover:underline mb-3">
                        Go to Legacy Portal &rarr;
                     </a>
                     <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        {t('Logout')}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Topbar */}
                <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 p-4 flex justify-between items-center">
                    <button className="lg:hidden p-2 text-gray-600 dark:text-slate-200" onClick={() => setIsSidebarOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    
                    <div className="flex-grow lg:flex-grow-0"></div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-text-dark dark:text-white">{auth.user.name}</p>
                            <p className="text-xs text-text-light dark:text-slate-400">{auth.user.role} &bull; {auth.user.department}</p>
                        </div>
                        <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {auth.user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Dashboard Viewport */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentView}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {currentView === 'Dashboard' && <OverviewView />}
                            {currentView === 'UserManagement' && <UserManagementView users={userDatabase} onCreateUser={handleCreateUser} />}
                            {currentView === 'Automation' && (
                                <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-xl shadow border border-gray-200 dark:border-slate-700">
                                    <h2 className="text-2xl font-bold text-text-dark dark:text-white mb-2">Automation Module</h2>
                                    <p className="text-text-light dark:text-slate-400">Full HR and Expense automation workflows coming in the next release.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default InternalPortalPage;