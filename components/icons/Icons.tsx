
import React from 'react';
import { BirdCharacterName, SparrowProfile } from '../../types';
import { BIRD_DETAILS } from '../../constants';

export const ChatIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

export const TimelineIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export const ForestIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 13a4 4 0 100-8 4 4 0 000 8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 14a7 7 0 0014 0" />
    </svg>
);


export const LogIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-4 9 4M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2" />
    </svg>
);

export const ItemIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);

export const SearchIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export const ShareIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4m0 0L8 6m4-4v12" />
    </svg>
);

export const TargetIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);


export const BirdAvatar: React.FC<{ character: BirdCharacterName; characterProfile?: SparrowProfile }> = ({ character, characterProfile }) => {
  const details = BIRD_DETAILS[character];
  const initial = characterProfile ? characterProfile.name.charAt(0) : details.name.charAt(0);
  return <div className={`w-10 h-10 rounded-full ${details.color} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>{initial}</div>;
};

export const BlueBirdIcon: React.FC = () => (
    <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M75.5 52.5c-2.5 5-7 9-12.5 11s-11.5 2-17-1c-5.5-3-9.5-8-11.5-14s-2-12.5 1-18c3-5.5 8-9.5 14-11.5s12.5-2 18 1c5.5 3 9.5 8 11.5 14s2 12.5-1 18z" />
        <path d="M85 45c-5-10-15-15-25-15s-20 5-25 15c-5 10-5 20 0 30 5 10 15 15 25 15s20-5 25-15c5-10 5-20 0-30z" fill="#fff" opacity="0.2" />
        <circle cx="70" cy="40" r="5" fill="#1e293b" />
        <path d="M80 60c-10 15-30 15-40 0 10-15 30-15 40 0z" transform="rotate(-15 60 60)" fill="#87CEEB"/>
    </svg>
);

export const JunkIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
export const CouponIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>;
export const HintIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
export const AffiliateIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;

export const WhiteBirdIcon: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => (
    <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M75.5 52.5c-2.5 5-7 9-12.5 11s-11.5 2-17-1c-5.5-3-9.5-8-11.5-14s-2-12.5 1-18c3-5.5 8-9.5 14-11.5s12.5-2 18 1c5.5 3 9.5 8 11.5 14s2 12.5-1 18z" />
        <path d="M85 45c-5-10-15-15-25-15s-20 5-25 15c-5 10-5 20 0 30 5 10 15 15 25 15s20-5 25-15c5-10 5-20 0-30z" fill="#000" opacity="0.1" />
        <circle cx="70" cy="40" r="5" fill="#1e293b" />
        <path d="M80 60c-10 15-30 15-40 0 10-15 30-15 40 0z" transform="rotate(-15 60 60)" fill="#E5E7EB"/>
    </svg>
);
