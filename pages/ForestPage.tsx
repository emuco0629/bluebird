
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateLiveForestFeedback } from '../services/geminiService';

const sharedDiarySummaries: string[] = [
    "アノヒト、今日は新しいことに挑戦したみたい。少し不安そうだったけど、瞳は輝いていた。",
    "雨の日は、静かでいいな。アノヒトも窓の外を眺めて、何かを考えている。",
    "アノヒトの好きな歌が、風に乗って聞こえてきた。なんだか私まで嬉しくなる。",
    "頑張り屋さんだから、少し心配になる時もある。でも、信じてる。",
    "今日はよく笑っていたな。その顔を見られるだけで、幸せな気持ちになる。",
    "ちょっと落ち込んでるみたい。言葉はなくても、隣にいるよ。"
].sort(() => 0.5 - Math.random());


const ForestPage: React.FC = () => {
    const { hasConsentedToForest, generateForestDiaryEntry } = useAppContext();
    const [liveFeedback, setLiveFeedback] = useState<string | null>(null);
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
    const [bubbles, setBubbles] = useState<{ id: number; text: string; style: React.CSSProperties }[]>([]);
    const chatterPhrases = ["うんうん", "そうなんだ", "うちのアノヒトも…", "わかる", "へぇ！", "すごいね", "よかったね"];

    useEffect(() => {
        // This function will be called when the component unmounts
        return () => {
            if (hasConsentedToForest) {
                generateForestDiaryEntry();
            }
        };
    }, [hasConsentedToForest, generateForestDiaryEntry]);

    useEffect(() => {
        if (hasConsentedToForest && !liveFeedback && !isLoadingFeedback) {
            const timer = setTimeout(async () => {
                setIsLoadingFeedback(true);
                const feedbackText = await generateLiveForestFeedback(sharedDiarySummaries.slice(0, 3));
                setLiveFeedback(feedbackText);
                setIsLoadingFeedback(false);
            }, 5000); // 5 second delay
            return () => clearTimeout(timer);
        }
    }, [hasConsentedToForest, liveFeedback, isLoadingFeedback]);

    useEffect(() => {
        if (!hasConsentedToForest) return;

        const interval = setInterval(() => {
            const id = Date.now() + Math.random();
            const text = chatterPhrases[Math.floor(Math.random() * chatterPhrases.length)];
            const style = {
                left: `${10 + Math.random() * 80}%`,
                animationDuration: `${4 + Math.random() * 4}s`,
            };
            const newBubble = { id, text, style };

            setBubbles(prev => [...prev, newBubble]);

            setTimeout(() => {
                setBubbles(prev => prev.filter(b => b.id !== id));
            }, 8000); // Corresponds to max animation duration
        }, 3000);

        return () => clearInterval(interval);
    }, [hasConsentedToForest]);

    if (hasConsentedToForest === null) {
        return <div className="text-center text-gray-500">読み込み中...</div>
    }
    
    if (!hasConsentedToForest) {
         return (
            <div className="text-center text-gray-500 mt-8 p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-sky-700 mb-4">青い鳥の森</h2>
                <p>ここは、たくさんの青い鳥たちが集う場所。</p>
                <p className="text-sm mt-2">あなたの青い鳥が森に参加すると、他の鳥たちの話を聞いてきてくれるようになります。</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full min-h-[60vh] overflow-hidden rounded-lg flex flex-col items-center justify-center">
             <style>{`
                 @keyframes fade-in-subtle {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .feedback-bubble { animation: fade-in-subtle 0.5s ease-out forwards; }
                
                @keyframes float-up-and-fade {
                    0% { opacity: 0; transform: translateY(0); }
                    20% { opacity: 1; }
                    100% { opacity: 0; transform: translateY(-100px); }
                }
                .chatter-bubble {
                    animation-name: float-up-and-fade;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                }
            `}</style>
             <div className="absolute inset-0 bg-emerald-50 z-0">
                <svg viewBox="0 0 200 200" className="w-full h-full text-emerald-200 opacity-60">
                    <path fill="currentColor" d="M 100,200 C 100,150 20,150 20,100 S 80,0 100,0 s 80,50 80,100 -80,50 -80,100" />
                    <path fill="currentColor" opacity="0.5" d="M 120,200 C 120,160 50,160 50,110 S 100,20 120,20 s 70,40 70,90 -50,40 -70,90" />
                </svg>
            </div>
            
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                {bubbles.map(bubble => (
                    <div
                        key={bubble.id}
                        className="chatter-bubble absolute bottom-0 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-emerald-800 shadow-md"
                        style={bubble.style}
                    >
                        {bubble.text}
                    </div>
                ))}
            </div>

             <div className="relative z-20 text-center p-4">
                 <div className="h-20"> {/* Spacer for feedback bubble */}
                    {(isLoadingFeedback || liveFeedback) && (
                         <div className="feedback-bubble inline-block bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg text-emerald-900 max-w-xs">
                             {isLoadingFeedback ? "青い鳥が聞き耳をたてています…" : liveFeedback}
                         </div>
                    )}
                </div>

                <div className="mt-8">
                    <p className="font-semibold text-2xl text-emerald-800">青い鳥の森</p>
                    <p className="text-md text-emerald-700 mt-2">鳥たちのささやきが聞こえる...</p>
                </div>
            </div>
        </div>
    );
};

export default ForestPage;