
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import TweetCard from '../components/TweetCard';

const TimelinePage: React.FC = () => {
    const { timelineTweets, isLoading } = useAppContext();
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const hasSeenTooltip = localStorage.getItem('hasSeenTimelineTooltip');
        if (!hasSeenTooltip) {
            setShowTooltip(true);
        }
    }, []);

    const handleCloseTooltip = () => {
        localStorage.setItem('hasSeenTimelineTooltip', 'true');
        setShowTooltip(false);
    };


    return (
        <div className="relative flex flex-col gap-4">
            {showTooltip && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xs text-center animate-fade-in-subtle">
                        <p className="text-gray-700">電線で鳥たちがおしゃべりしている。</p>
                        <p className="text-gray-700 mt-1">話を聞いてみようかな。</p>
                        <button
                            onClick={handleCloseTooltip}
                            className="mt-6 bg-sky-500 text-white font-bold py-2 px-8 rounded-full text-base shadow-md hover:bg-sky-600 transition-colors"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
            {isLoading && timelineTweets.length === 0 && (
                <p className="text-center text-gray-500 mt-8">鳥たちが集まってきています...</p>
            )}
            {timelineTweets.length > 0 ? (
                timelineTweets.map(tweet => <TweetCard key={tweet.id} tweet={tweet} />)
            ) : (
                !isLoading && <p className="text-center text-gray-500 mt-8">タイムラインはまだ静かです...</p>
            )}
        </div>
    );
};

export default TimelinePage;