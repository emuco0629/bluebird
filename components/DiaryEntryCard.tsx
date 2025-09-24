
import React, { useState } from 'react';
import { DiaryEntry, DiaryEntryType } from '../types';
import { ForestIcon } from './icons/Icons';

const DiaryEntryCard: React.FC<{ entry: DiaryEntry }> = ({ entry }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isForestEntry = entry.type === DiaryEntryType.Forest;

    return (
        <div className={`p-4 rounded-lg shadow-sm ${isForestEntry ? 'bg-emerald-50 border-emerald-200 border' : 'bg-white'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2">
                         {isForestEntry && <ForestIcon className="text-emerald-600 h-5 w-5 flex-shrink-0" />}
                        <p className={`font-semibold ${isForestEntry ? 'text-emerald-800' : 'text-sky-800'}`}>
                            {entry.summarizedText}
                        </p>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                        {entry.timestamp.toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'long',
                        })}
                    </p>
                </div>
                {!isForestEntry && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs text-sky-600 hover:text-sky-800 p-1 flex-shrink-0 ml-2"
                    >
                        {isExpanded ? '隠す' : '詳細'}
                    </button>
                )}
            </div>
            {isExpanded && !isForestEntry && (
                <div className="mt-3 pt-3 border-t border-sky-100">
                    <p className="text-sm text-gray-700 italic">「{entry.originalText}」</p>
                </div>
            )}
        </div>
    );
};

export default DiaryEntryCard;