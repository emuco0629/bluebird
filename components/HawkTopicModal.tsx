
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const HawkTopicModal: React.FC = () => {
    const { isHawkModalOpen, closeHawkModal, hawkTopic, setHawkTopic } = useAppContext();
    const [topicInput, setTopicInput] = useState('');

    useEffect(() => {
        if (isHawkModalOpen) {
            setTopicInput(hawkTopic || '');
        }
    }, [isHawkModalOpen, hawkTopic]);

    if (!isHawkModalOpen) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setHawkTopic(topicInput);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeHawkModal}
        >
            <div 
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold text-red-800 mb-2">鷹との約束</h2>
                <p className="text-sm text-gray-600 mb-4">
                    鷹に継続して追いかけてほしいテーマを一つだけ設定できます。設定すると、鷹が毎日新しい情報を探してきてくれます。
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        placeholder="例：好きなアイドルの名前、趣味など"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    />
                     <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={closeHawkModal}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors"
                        >
                            約束する
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HawkTopicModal;
