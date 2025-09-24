
import React from 'react';
import { useAppContext } from '../context/AppContext';
import DiaryEntryCard from '../components/DiaryEntryCard';

const LogPage: React.FC = () => {
    const { diaryEntries } = useAppContext();

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-sky-700">日記ログ</h2>
            {diaryEntries.length > 0 ? (
                diaryEntries.map(entry => <DiaryEntryCard key={entry.id} entry={entry} />)
            ) : (
                <div className="text-center text-gray-500 mt-8 p-6 bg-white rounded-lg shadow-sm">
                    <p>まだ日記がありません。</p>
                    <p className="text-sm mt-2">青い鳥とのやりとりや、森での出来事がここに記録されます。</p>
                </div>
            )}
        </div>
    );
};

export default LogPage;