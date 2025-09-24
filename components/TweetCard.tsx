
import React from 'react';
import { Tweet, BirdCharacterName } from '../types';
import { BIRD_DETAILS } from '../constants';
import { BirdAvatar, ShareIcon, TargetIcon } from './icons/Icons';
import { useAppContext } from '../context/AppContext';

const TweetCard: React.FC<{ tweet: Tweet }> = ({ tweet }) => {
    const { openHawkModal } = useAppContext();
    const details = tweet.characterProfile 
        ? { name: tweet.characterProfile.name, username: tweet.characterProfile.username, color: BIRD_DETAILS[tweet.character].color }
        : BIRD_DETAILS[tweet.character];

    const formatTime = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return `${seconds}秒`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}分`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}時間`;
        return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    };

    const handleShare = async () => {
        const shareData = {
            title: 'BlueBird',
            text: '青い鳥が、あなたの言葉を待っています。 #BlueBird',
            url: window.location.origin,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for browsers that don't support Web Share API
                alert('このブラウザは共有機能をサポートしていません。');
            }
        } catch (err) {
            console.error('Share failed:', err);
        }
    };


    return (
        <div className="bg-white p-4 rounded-lg shadow-sm flex gap-3">
            <div className="flex-shrink-0">
                 <BirdAvatar character={tweet.character} characterProfile={tweet.characterProfile} />
            </div>
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className="font-bold truncate">{details.name}</span>
                        <span className="text-gray-500 text-sm truncate">{details.username}</span>
                        <span className="text-gray-400 text-sm flex-shrink-0">· {formatTime(tweet.timestamp)}</span>
                    </div>
                    {tweet.character === BirdCharacterName.Hawk && (
                         <button 
                            onClick={openHawkModal}
                            className="text-gray-400 hover:text-red-700 transition-colors p-1 -m-1"
                            title="鷹の追跡テーマを設定"
                            aria-label="鷹の追跡テーマを設定"
                        >
                            <TargetIcon />
                        </button>
                    )}
                </div>

                <p className="mt-1 whitespace-pre-wrap break-words">{tweet.content}</p>
                
                {tweet.sources && tweet.sources.length > 0 && (
                    <div className="mt-3 border-t pt-2">
                        <h4 className="text-xs font-semibold text-gray-600 mb-1">情報源:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {tweet.sources.map((source, index) => (
                                <li key={index}>
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline break-all">
                                        {source.title || source.uri}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {tweet.character === BirdCharacterName.WhiteBird && (
                    <div className="mt-3 pt-2 text-right">
                        <button 
                            onClick={handleShare}
                            className="inline-flex items-center gap-2 px-3 py-1 text-sm text-sky-600 bg-sky-100 hover:bg-sky-200 rounded-full transition-colors"
                        >
                            <ShareIcon />
                            <span>共有する</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TweetCard;
