import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useRef } from 'react';
import { DiaryEntry, Tweet, Item, BirdCharacterName, BirdAnimationState, SparrowProfile, DiaryEntryType, ChatMessage, ChatMessageType, ItemType } from '../types';
import { 
    processDiaryEntry,
    generateSparrowTweet, 
    generateHawkReport,
    generateMysterySparrowTweet,
    generateWhiteBirdTweet,
    generateOsonaemono,
    generateBlueBirdAffiliateHintTweet,
    synthesizeForestChatter,
    generatePsychologicalText
} from '../services/geminiService';
import { SPARROW_PROFILES } from '../constants';

// --- A mock shared pool for Forest messages ---
const sharedDiarySummaries: string[] = [
    "アноヒト、今日は新しいことに挑戦したみたい。少し不安そうだったけど、瞳は輝いていた。",
    "雨の日は、静かでいいな。アноヒトも窓の外を眺めて、何かを考えている。",
    "アноヒトの好きな歌が、風に乗って聞こえてきた。なんだか私まで嬉しくなる。",
];
const addSharedSummary = (summary: string) => {
    sharedDiarySummaries.unshift(summary);
    if (sharedDiarySummaries.length > 20) {
        sharedDiarySummaries.pop();
    }
};
// ---------------------------------------------

interface AppContextType {
  diaryEntries: DiaryEntry[];
  chatMessages: ChatMessage[];
  timelineTweets: Tweet[];
  collectedItems: Item[];
  birdAnimation: BirdAnimationState;
  isLoading: boolean;
  hawkTopic: string | null;
  isHawkModalOpen: boolean;
  isForestConsentModalOpen: boolean;
  hasConsentedToForest: boolean | null;
  submitDiary: (text: string) => Promise<void>;
  setHawkTopic: (topic: string) => void;
  openHawkModal: () => void;
  closeHawkModal: () => void;
  consentToForest: () => void;
  declineForest: () => void;
  openForestConsentModal: () => void;
  setBirdAnimation: (state: BirdAnimationState) => void;
  generateForestDiaryEntry: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to get today's date string YYYY-MM-DD
const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [diaryEntries, setDiaryEntries]  = useState < DiaryEntry[] > (() => JSON.parse(localStorage.getItem('diaryEntries') || '[]').map((e: any) => ({...e, timestamp: new Date(e.timestamp)})));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    return savedMessages.map((m: any, index: number) => ({
        id: m.id || `chat-migrated-${index}-${m.timestamp}`,
        text: m.text,
        timestamp: new Date(m.timestamp),
        type: m.type || ChatMessageType.User, // Default old messages to User type
    }));
  });
  const [timelineTweets, setTimelineTweets] = useState<Tweet[]>(() => JSON.parse(localStorage.getItem('timelineTweets') || '[]').map((t: any) => ({...t, timestamp: new Date(t.timestamp)})));
  const [collectedItems, setCollectedItems] = useState<Item[]>(() => JSON.parse(localStorage.getItem('collectedItems') || '[]'));
  
  const [birdAnimation, setBirdAnimation] = useState<BirdAnimationState>(BirdAnimationState.Idle);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sparrowProfiles] = useState<SparrowProfile[]>(SPARROW_PROFILES);
  
  const summaryTimeoutRef = useRef<number | null>(null);

  // Hawk state
  const [hawkTopic, setHawkTopicInternal] = useState<string | null>(() => localStorage.getItem('hawkTopic'));
  const [isHawkModalOpen, setIsHawkModalOpen] = useState(false);

  // Forest state
  const [hasConsentedToForest, setHasConsentedToForest] = useState<boolean | null>(null);
  const [isForestConsentModalOpen, setIsForestConsentModalOpen] = useState(false);

   useEffect(() => {
    const consent = localStorage.getItem('forestConsent');
    setHasConsentedToForest(consent === null ? null : consent === 'true');
  }, []);

  // Persist state to localStorage
  useEffect(() => { localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries)); }, [diaryEntries]);
  useEffect(() => { localStorage.setItem('chatMessages', JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { localStorage.setItem('timelineTweets', JSON.stringify(timelineTweets)); }, [timelineTweets]);
  useEffect(() => { localStorage.setItem('collectedItems', JSON.stringify(collectedItems)); }, [collectedItems]);

  const generateForestDiaryEntry = useCallback(async () => {
    const isForestConsented = localStorage.getItem('forestConsent') === 'true';
    const lastForestEntry = diaryEntries.find(e => e.type === DiaryEntryType.Forest);
    if (!isForestConsented || (lastForestEntry && (new Date().getTime() - lastForestEntry.timestamp.getTime()) < 60000)) { // 1 minute cooldown
        return;
    }

    const myLastSummary = diaryEntries.find(e => e.type === DiaryEntryType.Personal)?.summarizedText;
    if (!myLastSummary) return;

    const chatter = sharedDiarySummaries.slice(0, 3);
    const forestFeedbackText = await synthesizeForestChatter(myLastSummary, chatter);
    const forestDiaryEntry: DiaryEntry = {
        id: `diary-forest-${Date.now()}`,
        originalText: "森のささやき",
        summarizedText: forestFeedbackText,
        timestamp: new Date(),
        type: DiaryEntryType.Forest,
    };
    setDiaryEntries(prev => [...prev, forestDiaryEntry].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, [diaryEntries]);


  const summarizeAndPost = useCallback(async (currentChatMessages: ChatMessage[]) => {
    const today = getTodayDateString();
    
    const todayMessages = currentChatMessages
        .filter(m => m.timestamp.toISOString().split('T')[0] === today && m.type === ChatMessageType.User)
        .map(m => m.text);

    if (todayMessages.length === 0) return;
    
    setIsLoading(true);
    setBirdAnimation(BirdAnimationState.Thinking);

    const combinedText = todayMessages.join('\n');
    const { summary: blueBirdSummary } = await processDiaryEntry(combinedText);
    
    const newDiaryEntry: DiaryEntry = {
      id: `diary-${today}`, // Use date for consistent ID
      originalText: combinedText,
      summarizedText: blueBirdSummary,
      timestamp: new Date(),
      type: DiaryEntryType.Personal,
    };
     // Replace today's diary entry instead of adding a new one
    setDiaryEntries(prev => {
        const otherEntries = prev.filter(entry => 
            !(entry.type === DiaryEntryType.Personal && entry.timestamp.toISOString().split('T')[0] === today)
        );
        return [newDiaryEntry, ...otherEntries].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
    });


    if (localStorage.getItem('forestConsent') === 'true') {
        addSharedSummary(newDiaryEntry.summarizedText);
    }
    
    // --- Generate Timeline Sequence (No Delays) ---
    const generateAndAddTweets = async () => {
        // --- Step 1: Fire all independent API calls in parallel ---
        const sparrowProfilesToFetch = [
            sparrowProfiles[Math.floor(Math.random() * sparrowProfiles.length)],
            sparrowProfiles[Math.floor(Math.random() * sparrowProfiles.length)],
            sparrowProfiles[Math.floor(Math.random() * sparrowProfiles.length)],
            sparrowProfiles[Math.floor(Math.random() * sparrowProfiles.length)],
        ];
        const lastMysteryTweet = timelineTweets.find(t => t.character === BirdCharacterName.MysterySparrow)?.content;

        const [
            sparrowTweet1_res,
            sparrowTweet2_res,
            mysteryTweet_res,
            hawkReport_res,
            newItemData_res,
            whiteBirdTweet_res,
            sparrowTweet3_res,
            sparrowTweet4_res,
            affiliateHintTweet_res,
        ] = await Promise.all([
            generateSparrowTweet(sparrowProfilesToFetch[0]),
            generateSparrowTweet(sparrowProfilesToFetch[1]),
            generateMysterySparrowTweet(lastMysteryTweet),
            hawkTopic ? generateHawkReport(hawkTopic) : Promise.resolve(null),
            generateOsonaemono(combinedText),
            generateWhiteBirdTweet(),
            generateSparrowTweet(sparrowProfilesToFetch[2]),
            generateSparrowTweet(sparrowProfilesToFetch[3]),
            generateBlueBirdAffiliateHintTweet(combinedText),
        ]);

        // --- Step 2: Assemble the new tweets in chronological order ---
        const newTweets: Omit<Tweet, 'id' | 'timestamp'>[] = [];
        
        // Sparrows 1 & 2
        newTweets.push({ character: BirdCharacterName.Sparrow, characterProfile: sparrowProfilesToFetch[0], content: sparrowTweet1_res });
        newTweets.push({ character: BirdCharacterName.Sparrow, characterProfile: sparrowProfilesToFetch[1], content: sparrowTweet2_res });
        // Blue Bird caring tweet
        newTweets.push({ character: BirdCharacterName.BlueBird, content: blueBirdSummary });
        // Mystery Sparrow
        newTweets.push({ character: BirdCharacterName.MysterySparrow, content: mysteryTweet_res });
        // Hawk
        if (hawkReport_res) {
            newTweets.push({ character: BirdCharacterName.Hawk, content: hawkReport_res.text, sources: hawkReport_res.sources.filter(s => s && s.uri && s.title) });
        } else {
             // Only show the introductory message if the hawk has never tweeted before at all.
            if (!timelineTweets.some(t => t.character === BirdCharacterName.Hawk)) {
                newTweets.push({ character: BirdCharacterName.Hawk, content: "情報収集はお任せあれ。鷹の目で追い続け、定期的に報告します。" });
            }
        }
        // Affiliate part & Osonaemono
        if (newItemData_res) {
            const newItem: Item = { id: `item-${Date.now()}`, ...newItemData_res };
            // Avoid adding duplicate items
            setCollectedItems(prev => {
                if (prev.some(item => item.name === newItem.name)) return prev;
                return [...prev, newItem];
            });
            if (newItem.type === ItemType.Affiliate) {
                newTweets.push({ character: BirdCharacterName.BlueBird, content: affiliateHintTweet_res });
            }
        }
        // White Bird
        newTweets.push({ character: BirdCharacterName.WhiteBird, content: whiteBirdTweet_res });
        // Sparrows 3 & 4
        newTweets.push({ character: BirdCharacterName.Sparrow, characterProfile: sparrowProfilesToFetch[2], content: sparrowTweet3_res });
        newTweets.push({ character: BirdCharacterName.Sparrow, characterProfile: sparrowProfilesToFetch[3], content: sparrowTweet4_res });

        // --- Step 3: Update state once with all new tweets ---
        const now = Date.now();
        const tweetsWithIds = newTweets.map((t, index) => ({
            ...t,
            id: `tweet-${now}-${index}`,
            timestamp: new Date(now + index)
        }));
        
        // Replace today's tweets to prevent duplicates
        setTimelineTweets(prev => {
            const previousDaysTweets = prev.filter(tweet => tweet.timestamp.toISOString().split('T')[0] !== today);
            const newTimeline = [...tweetsWithIds, ...previousDaysTweets];
            return newTimeline.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        });
    };
    
    await generateAndAddTweets();
    
    setBirdAnimation(BirdAnimationState.Idle);
    setIsLoading(false);

  }, [sparrowProfiles, hawkTopic, timelineTweets]);

  const submitDiary = useCallback(async (text: string) => {
    setIsLoading(true);

    const newChatMessage: ChatMessage = {
        id: `chat-user-${Date.now()}`,
        text,
        timestamp: new Date(),
        type: ChatMessageType.User,
    };
    const newChatMessages = [...chatMessages, newChatMessage];
    setChatMessages(newChatMessages);

    const { animationState } = await processDiaryEntry(text);
    setBirdAnimation(animationState);

    const psychoText = await generatePsychologicalText(text, animationState);
    setTimeout(() => {
        const newPsychoMessage: ChatMessage = {
            id: `chat-psycho-${Date.now()}`,
            text: psychoText,
            timestamp: new Date(),
            type: ChatMessageType.Psychological,
        };
        setChatMessages(prev => [...prev, newPsychoMessage]);
    }, 2000);

    if (summaryTimeoutRef.current) {
        clearTimeout(summaryTimeoutRef.current);
    }
    summaryTimeoutRef.current = window.setTimeout(() => summarizeAndPost(newChatMessages), 5000);
    
    setIsLoading(false);
  }, [chatMessages, summarizeAndPost]);

  const setHawkTopic = (topic: string) => {
    const trimmedTopic = topic.trim();
    if (trimmedTopic) {
        localStorage.setItem('hawkTopic', trimmedTopic);
        setHawkTopicInternal(trimmedTopic);
    } else {
        localStorage.removeItem('hawkTopic');
        setHawkTopicInternal(null);
    }
    closeHawkModal();
  };

  const openHawkModal = () => setIsHawkModalOpen(true);
  const closeHawkModal = () => setIsHawkModalOpen(false);

  const consentToForest = () => {
    localStorage.setItem('forestConsent', 'true');
    setHasConsentedToForest(true);
    setIsForestConsentModalOpen(false);
  };

  const declineForest = () => {
    localStorage.setItem('forestConsent', 'false');
    setHasConsentedToForest(false);
    setIsForestConsentModalOpen(false);
  };
  
  const openForestConsentModal = () => setIsForestConsentModalOpen(true);


  return (
    <AppContext.Provider value={{ 
        diaryEntries, 
        chatMessages,
        timelineTweets, 
        collectedItems, 
        birdAnimation, 
        isLoading, 
        hawkTopic, 
        isHawkModalOpen, 
        isForestConsentModalOpen,
        hasConsentedToForest,
        submitDiary, 
        setHawkTopic, 
        openHawkModal, 
        closeHawkModal,
        consentToForest,
        declineForest,
        openForestConsentModal,
        setBirdAnimation,
        generateForestDiaryEntry
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
