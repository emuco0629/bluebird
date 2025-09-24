
import React from 'react';
import { DiaryEntry } from '../types';

const ChatMessage: React.FC<{ entry: DiaryEntry }> = ({ entry }) => {

    if (entry.type === 'Forest') {
        return null; // Don't show forest entries in the chat
    }

    return (
        <div className="flex flex-col gap-2">
            {/* User's Message */}
            <div className="flex justify-end">
                <div className="bg-sky-500 text-white rounded-lg rounded-br-none px-4 py-2 max-w-[80%]">
                    <p className="whitespace-pre-wrap break-words">{entry.originalText}</p>
                </div>
            </div>
            {/* Bird's text reply is removed per user request */}
        </div>
    );
};

export default ChatMessage;
