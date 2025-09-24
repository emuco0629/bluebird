
import React from 'react';
import { WhiteBirdIcon } from '../components/icons/Icons';

interface OnboardingPageProps {
  onStart: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onStart }) => {
  return (
    <div className="bg-sky-50 text-gray-800 min-h-screen font-sans flex flex-col items-center justify-center text-center p-4">
      <div className="text-gray-300">
        <WhiteBirdIcon className="w-32 h-32" />
      </div>
      <p className="text-xl text-gray-600 mt-4">アノヒトの青い鳥になりたい</p>
      
      <div className="mt-12">
        <p className="text-lg text-sky-700 font-semibold">お迎えしますか？</p>
        <button
          onClick={onStart}
          className="mt-4 bg-sky-500 text-white font-bold py-3 px-12 rounded-full text-lg shadow-lg hover:bg-sky-600 transition-all transform hover:scale-105"
          aria-label="はい"
        >
          はい
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
