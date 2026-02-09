import * as React from 'react';

interface AvatarProps {
    name: string;
    className?: string;
    textSize?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, className = "w-12 h-12", textSize = "text-lg" }) => {
    const initials = React.useMemo(() => {
        if (!name) return 'KK';
        const parts = name.split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }, [name]);

    // Generate a consistent color based on the name
    const colorIndex = React.useMemo(() => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }, [name]);

    const gradients = [
        'from-blue-400 to-blue-600',
        'from-emerald-400 to-emerald-600',
        'from-amber-400 to-amber-600',
        'from-purple-400 to-purple-600',
        'from-rose-400 to-rose-600',
        'from-cyan-400 to-cyan-600',
        'from-indigo-400 to-indigo-600',
        'from-teal-400 to-teal-600'
    ];

    const gradient = gradients[colorIndex % gradients.length];

    return (
        <div className={`${className} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold shadow-inner ${textSize}`} aria-label={name}>
            {initials}
        </div>
    );
};

export default Avatar;