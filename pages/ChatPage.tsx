
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { BirdAnimationState, DiaryEntryType, ChatMessageType } from '../types';
import BirdAnimation from '../components/BirdAnimation';
import ChatMessage from '../components/ChatMessage';

const ChatPage: React.FC = () => {
    const { submitDiary, isLoading, birdAnimation, chatMessages, setBirdAnimation } = useAppContext();
    const [post, setPost] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (post.trim() && !isLoading) {
            submitDiary(post.trim());
            setPost('');
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPost(e.target.value);
        if (e.target.value) {
            setBirdAnimation(BirdAnimationState.Typing);
        } else {
            setBirdAnimation(BirdAnimationState.Idle);
        }
    };
    
    return (
        <div className="flex flex-col h-full w-full">
            <style>{`
                @keyframes fade-in-subtle {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-subtle { animation: fade-in-subtle 0.5s ease-out forwards; }
            `}</style>
            <div className="flex-grow overflow-y-auto px-2 py-4 space-y-4">
                 {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center h-full">
                         <BirdAnimation state={birdAnimation} size="large" />
                         <p className="text-gray-500 mt-4">青い鳥に今日のできごとを伝えてみましょう。</p>
                    </div>
                 )}
                {[...chatMessages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()).map((msg) => {
                     if (msg.type === ChatMessageType.Psychological) {
                        return (
                            <div key={msg.id} className="text-center py-2">
                                <p className="text-sm text-gray-500 italic animate-fade-in-subtle">
                                    {msg.text}
                                </p>
                            </div>
                        );
                    }
                    return (
                        <ChatMessage key={msg.id} entry={{
                            id: msg.id,
                            originalText: msg.text,
                            summarizedText: '', // Not used in chat
                            timestamp: msg.timestamp,
                            type: DiaryEntryType.Personal
                        }} />
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-2 bg-white/80 backdrop-blur-sm border-t border-sky-200">
                <form onSubmit={handleSubmit} className="flex items-end gap-2">
                     <BirdAnimation state={birdAnimation} size="small" />
                    <textarea
                        value={post}
                        onChange={handleInputChange}
                        onBlur={() => { if (!post) setBirdAnimation(BirdAnimationState.Idle)}}
                        placeholder="メッセージ..."
                        className="w-full p-2 text-base border-2 border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition resize-none"
                        rows={1}
                        disabled={isLoading}
                        style={{ maxHeight: '100px', height: 'auto' }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                        }}
                    />
                    <button 
                        type="submit"
                        disabled={isLoading || !post.trim()}
                        className="px-4 py-2 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition-colors disabled:bg-sky-300 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        {isLoading ? '...' : '伝える'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;