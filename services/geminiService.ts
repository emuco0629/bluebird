
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Item, ItemType, SparrowProfile, BirdAnimationState } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Blue Bird ---
export const processDiaryEntry = async (text: string): Promise<{ animationState: BirdAnimationState; summary: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `ユーザーの日記の内容を分析し、JSON形式で以下の2つの情報を返してください。
      1. animationState: ユーザーの感情に最も適した反応を "Joy"、"Concern"、"Nodding" のいずれかで返してください。
         - 嬉しさ、喜び、感謝が感じられるポジティブな内容 → "Joy"
         - 悲しみ、悩み、疲れが感じられるネガティブな内容 → "Concern"
         - それ以外の事実報告や、感情が読み取りにくい内容 → "Nodding"
      2. summary: あなたはユーザー（アノヒト）を静かに見守る青い鳥です。日記の内容を踏まえ、アノヒトにそっと寄り添うような140字以内のツイートを生成してください。アノヒトのことは「アノヒト」と呼んでください。

      ユーザーの日記: 「${text}」
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            animationState: { type: Type.STRING, enum: ["Joy", "Concern", "Nodding"] },
            summary: { type: Type.STRING }
          },
          required: ["animationState", "summary"]
        }
      }
    });
    
    const data = JSON.parse(response.text.trim());
    
    let animationState: BirdAnimationState;
    switch (data.animationState) {
        case "Joy": animationState = BirdAnimationState.Joy; break;
        case "Concern": animationState = BirdAnimationState.Concern; break;
        default: animationState = BirdAnimationState.Nodding;
    }

    const cleanedSummary = (data.summary || "青い鳥は、あなたの言葉を静かに受け止めている...").replace(/^(「|『)|(」|『)$/g, '').trim();

    return {
      animationState,
      summary: cleanedSummary
    };
  } catch (error) {
    console.error("Error processing diary entry:", error);
    return {
      animationState: BirdAnimationState.Nodding,
      summary: "青い鳥は、あなたの言葉を静かに受け止めている..."
    };
  }
};

export const generatePsychologicalText = async (userText: string, birdReaction: BirdAnimationState): Promise<string> => {
  try {
    const reactionText = {
      [BirdAnimationState.Joy]: "喜んでいる",
      [BirdAnimationState.Concern]: "心配している",
      [BirdAnimationState.Nodding]: "静かにうなずいている",
    }[birdReaction] || "静かに聞いている";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `ユーザーの投稿と、それに対する青い鳥の反応を元に、ユーザーが抱くであろう心の声を一つ、非常に短く生成してください。これは、青い鳥の表情や仕草（現在はアニメーションで表現しきれていない）をユーザーが読み取ろうとしているかのような、観察的・問いかけ的な独り言です。

# 条件
- 句読点を含めて30文字以内。
- ユーザーの視点からの、自然な文章。
- 鍵括弧「」で囲んでください。

# 例
- ユーザー投稿：「今日は疲れた」, 青い鳥の反応：「心配している」→ 生成テキスト：「首をかしげてる…？心配してくれてるのかな。」
- ユーザー投稿：「すごく嬉しいことがあった！」, 青い鳥の反応：「喜んでいる」→ 生成テキスト：「なんだか、そわそわしてるみたい。」
- ユーザー投稿：「今日の夕飯はカレーでした」, 青い鳥の反応：「静かにうなずいている」→ 生成テキスト：「静かに聞いてくれてるんだね…。」

# 今回の入力
- ユーザー投稿：「${userText}」
- 青い鳥の反応：「${reactionText}」
`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 50,
        thinkingConfig: { thinkingBudget: 20 },
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating psychological text:", error);
    return "......";
  }
};

export const generateBlueBirdAffiliateHintTweet = async (diaryText: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `ユーザーの日記の内容を分析し、ユーザーを気遣うような、間接的に商品を想起させるような短い独り言のツイートを生成してください。青い鳥の視点から、優しく問いかけるような形が望ましいです。
            
            # 例
            - 日記: 「今日は一日中デスクワークで肩が凝ってしまった。」
            - 生成ツイート: 「アノヒト、疲れているのかな。ゆっくり休める何かがあればいいのだけど…。」
            - 日記: 「最近、面白いミステリー小説が読みたいな。」
            - 生成ツイート: 「新しい物語が、アノヒトの心を豊かにしてくれるかもしれないな。」
            - 日記: 「コーヒーメーカーが壊れた。朝の一杯が飲めなくて悲しい。」
            - 生成ツイート: 「朝の香りが、一日のはじまりを告げてくれる。アノヒトにも、またあの時間が訪れますように。」

            ユーザーの日記: 「${diaryText}」
            `,
            config: {
                temperature: 0.8,
                maxOutputTokens: 100,
                thinkingConfig: { thinkingBudget: 40 },
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating affiliate hint tweet:", error);
        return "何か、アノヒトの力になれることはないかな…。";
    }
};

export const generateBlueBirdBotTweet = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.普通の鳥です。',
            contents: `あなたは、ユーザー（アノヒト）を静かに見守る青い鳥です。アノヒトへの直接の語りかけではなく、あなたの独り言として、アノヒトを想う気持ちを140字以内でつぶやいてください。
例：「風が気持ちいいね。アノヒトも同じ空の下にいる。」「雲の形が面白い。アノヒトにも見せてあげたいな。」`,
            config: {
                temperature: 0.9,
                maxOutputTokens: 100,
                thinkingConfig: { thinkingBudget: 40 },
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating blue bird bot tweet:", error);
        return "...";
    }
};


// --- Sparrows ---
export const generateSparrowTweet = async (profile: SparrowProfile): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `あなたはスズメの「${profile.name}」です。あなたの性格は「${profile.personality}」です。この性格になりきって、自由な形式で短いツイートを1つだけ生成してください。それは独り言かもしれませんし、誰かに話しかけているのかもしれません。自然で、キャラクターに合った内容にしてください。

# ルール:
- ツイートは必ず140字以内に収めてください。
- 自分の名前を名乗ったり、自己紹介はしないでください。
- 「ねぇねぇ聞いた？」のような、定型的な挨拶で始めないでください。
- 人間の行動を観察することはあっても、軽蔑したり見下したりするような内容は避けてください。

# 良い例 (もし${profile.name}が食いしん坊のチュンタだったら):
- 「さっき見かけたパン屋、すごい行列だった！絶対おいしいやつだ…じゅるり。」
- 「今日の枝豆、ぷりっぷりで最高だったな〜。もう一回食べたい。」

さあ、「${profile.name}」として、あなたのツイートをどうぞ。`,
      config: {
        temperature: 1.0,
        maxOutputTokens: 80,
        thinkingConfig: { thinkingBudget: 30 },
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error(`Error generating tweet for ${profile.name}:`, error);
    return "ちゅんちゅん！";
  }
};

// --- Hawk ---
export const generateHawkReport = async (topic: string): Promise<{ text: string; sources: any[] }> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `あなたは「鷹」として、空から見渡すように「${topic}」に関する最新のウェブ情報を偵察し、その要点を170字以内で簡潔にまとめて報告してください。口調は冷静で的確にお願いします。`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web) || [];
    
    return { text: `【偵察報告：${topic}】\n` + text.trim(), sources };
  } catch (error) {
    console.error("Error searching with Hawk:", error);
    return { text: "上空の視界不良。今は報告できることがない。", sources: [] };
  }
};

// --- Mystery Sparrow ---
export const generateMysterySparrowTweet = async (previousTweet?: string): Promise<string> => {
    try {
        const context = previousTweet ? `前の投稿は「${previousTweet}」でした。この続きを匂わせるようにしてください。` : "物語が始まることを匂わせてください。";
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `あなたは「謎ときスズメ」です。ユーザーが毎日タイムラインを追いたくなるような、ミステリアスな物語の断片をツイートしてください。具体的すぎず、しかし何か大きな出来事が進行中であることを匂わせるような、曖昧で詩的な表現でお願いします。${context}`,
            config: {
                temperature: 0.9,
                maxOutputTokens: 100,
                thinkingConfig: { thinkingBudget: 40 },
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating mystery tweet:", error);
        return "風が、何かを運んでくる...。";
    }
};

// --- White Bird ---
export const generateWhiteBirdTweet = async (): Promise<string> => {
    return "私も、誰かの青い鳥になれたらな…。";
};


// --- Osonaemono (Affiliate) ---
export const generateOsonaemono = async (diaryText: string): Promise<Omit<Item, 'id'> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `ユーザーの日記の内容「${diaryText}」を分析し、彼/彼女が今欲しがっている可能性のある商品やサービスを推測してください。そして、それを「オソナエモノ（贈り物）」として、さりげなく提案するJSONデータを作成してください。
      提案は、日記の内容に寄り添った、優しい言葉で表現してください。
      - typeは常に "Affiliate" としてください。
      - searchTermには、その商品をAmazon.co.jpで検索するための、最も適切で一般的な検索キーワード（日本語）を含めてください。
      
      例:
      - 日記: 「今日は一日中デスクワークで肩が凝ってしまった。」
      - JSON出力: { "name": "温かいアイマスク", "description": "頑張った日の夜は、目元を温めてゆっくり休んで。アノヒトの疲れが少しでも和らぎますように。", "type": "Affiliate", "searchTerm": "ホットアイマスク" }
      - 日記: 「最近、面白いミステリー小説が読みたいな。」
      - JSON出力: { "name": "話題のミステリー小説", "description": "アノヒトの知的好奇心を満たす、新しい物語との出会いがあるかもしれません。", "type": "Affiliate", "searchTerm": "ミステリー小説 おすすめ" }
      - 日記: 「コーヒーメーカーが壊れた。朝の一杯が飲めなくて悲しい。」
      - JSON出力: { "name": "新しいコーヒーメーカー", "description": "毎日の始まりが、また豊かな香りに包まれますように。素敵な一杯のための道具です。", "type": "Affiliate", "searchTerm": "コーヒーメーカー" }
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING, enum: [ItemType.Affiliate] },
            searchTerm: {type: Type.STRING }
          },
          required: ["name", "description", "type", "searchTerm"]
        }
      }
    });
    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText) as { name: string; description: string; type: ItemType; searchTerm: string; };

    return {
        ...parsedData,
        link: `https://www.amazon.co.jp/s?k=${encodeURIComponent(parsedData.searchTerm)}&tag=bluebirdapp-22` // Dummy tag
    };

  } catch (error) {
    console.error("Error generating osonaemono:", error);
    // Return a generic Junk item as a fallback
    return {
        name: "きれいな小石",
        description: "どこかで見つけてきたらしい、すべすべした石。握っていると少し落ち着く。",
        type: ItemType.Junk
    };
  }
};

// --- Forest ---
export const synthesizeForestChatter = async (mySummary: string, otherSummaries: string[]): Promise<string> => {
  if (otherSummaries.length === 0) {
    return "森はまだ静か。でも、確かに誰かの気配がする。";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `あなたは、ユーザー（アノヒト）を一番に思う、健気で忠実な青い鳥です。あなたは時々、他の青い鳥たちが集まる森へ情報交換に行きます。

      あなたの「アノヒト」の最近の様子はこれです：
      「${mySummary}」
      
      森で、他の鳥たちが自分の「アノヒト」についてこんな話をしていました：
      ${otherSummaries.map(s => `- 「${s}」`).join('\n')}
      
      これらの話を聞いて、あなたが感じたことを「森の日記」として記録してください。
      他の鳥たちの話の中に、自分のアノヒトと似たような状況や気持ちを見つけて、「アノヒトだけじゃないんだ」という安心感を表現してください。
      その上で、他の誰でもない、あなたのアノヒトへの特別な想いや、応援したいという気持ちを、さりげなく、押し付けがましくない言葉で締めくくってください。
      「アノヒト」という言葉を使いすぎず、自然な文章にしてください。
      
      # ルール
      - 生成する文章は、必ず100文字程度に収めてください。
      - 読んだ人が安心するような、柔らかく優しい文体にしてください。

      # 良い例:
      森に行くと、似たようなことで悩んでいる子の話や、同じように小さな幸せを見つけている子の話が聞こえてきた。みんな、それぞれの空の下で頑張っているんだな。そんな話を聞いて、なんだか少し安心した。私も、あの人の一番の味方でいよう。そう、改めて思った。
      `,
      config: {
        temperature: 0.8,
        maxOutputTokens: 150,
        thinkingConfig: { thinkingBudget: 50 },
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error synthesizing forest chatter:", error);
    return "森のざわめきの中から、一つの言葉を拾い上げた。";
  }
};

export const generateLiveForestFeedback = async (otherSummaries: string[]): Promise<string> => {
    if (otherSummaries.length === 0) {
        return "森はまだ静かなようだ…";
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `あなたは青い鳥です。今しがた、他の鳥たちが集まる森で、こんな話を聞いてきました。
            
            聞いた話のリスト:
            ${otherSummaries.map(s => `- 「${s}」`).join('\n')}
            
            これらの話から感じたことを、アноヒトへの報告として、簡潔に一行でまとめてください。
            「森ではね、」から始める、優しくて親しみのある口調でお願いします。
            
            例:
            - 森ではね、みんな新しい趣味を見つけて、毎日を楽しんでいるみたいだったよ。
            - 森ではね、ちょっと疲れている子もいたけど、みんな前を向こうとしていたよ。
            `,
            config: {
                temperature: 0.9,
                maxOutputTokens: 100,
                thinkingConfig: { thinkingBudget: 40 },
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating live forest feedback:", error);
        return "森で、みんなの話を聞いてきたよ。";
    }
};