
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ForestConsentModal: React.FC = () => {
    const { isForestConsentModalOpen, consentToForest, declineForest } = useAppContext();
    const navigate = useNavigate();

    if (!isForestConsentModalOpen) {
        return null;
    }

    const handleConsent = () => {
        consentToForest();
        navigate('/forest');
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <div 
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold text-emerald-800 mb-2">青い鳥の森へようこそ</h2>
                <p className="text-sm text-gray-600 mb-4">
                    あなたの青い鳥が、他の鳥たちが集まる「森」に参加できるようにしますか？
                </p>
                <p className="text-xs text-gray-500 mb-4">
                    森に参加すると、あなたの青い鳥は日記の要約（個人情報は含みません）を森の仲間と共有します。そして、森で聞いた話を元に、あなたとの日記に新しい気づきを記録してくれることがあります。
                </p>
                <p className="text-xs text-gray-500 mb-4">
                    この約束は、ゆるやかなつながりのためのものです。
                </p>
                 <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={declineForest}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        今はやめておく
                    </button>
                    <button
                        type="button"
                        onClick={handleConsent}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                        約束する
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForestConsentModal;