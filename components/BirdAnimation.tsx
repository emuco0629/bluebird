
import React from 'react';
import { BirdAnimationState } from '../types';
import { BlueBirdIcon } from './icons/Icons';

const BirdAnimation: React.FC<{ state: BirdAnimationState; size?: 'small' | 'large' }> = ({ state, size = 'large' }) => {
    const isSmall = size === 'small';
    
    // Per user request, animations and descriptive text are removed.
    // The 'state' prop is kept for potential future use or logic that depends on it, but doesn't drive animation here.

    return (
        <div className={`flex flex-col items-center ${isSmall ? 'w-10' : ''}`}>
            <div className={`text-sky-500 ${isSmall ? 'w-10 h-10' : 'w-24 h-24'}`}>
                <BlueBirdIcon />
            </div>
            {/* Message removed per user request */}
        </div>
    );
};

export default BirdAnimation;
