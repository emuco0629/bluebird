import { BirdCharacterName, SparrowProfile } from './types';

export const MAX_POST_LENGTH = 1000;

export const BIRD_DETAILS: Record<BirdCharacterName, { name: string; username: string; color: string }> = {
  [BirdCharacterName.BlueBird]: { name: '青い鳥', username: '@BlueBird_You', color: 'bg-sky-400' },
  [BirdCharacterName.Sparrow]: { name: 'スズメ', username: '@ChirpChat', color: 'bg-amber-600' },
  [BirdCharacterName.WhiteBird]: { name: '白い鳥', username: '@PeacefulWing', color: 'bg-gray-200' },
  [BirdCharacterName.MysterySparrow]: { name: '謎ときスズメ', username: '@CleverBeak', color: 'bg-purple-500' },
  [BirdCharacterName.Hawk]: { name: '鷹', username: '@SkySearcher', color: 'bg-red-800' },
};

export const SPARROW_PROFILES: SparrowProfile[] = [
    { id: 'sparrow1', name: 'ピコ', username: '@Pico_talk', personality: 'おしゃべり好き。日常のちょっとした出来事をテンション高めに実況する。' },
    { id: 'sparrow2', name: 'チュンタ', username: '@Chunta_gourmet', personality: '食いしん坊。食べ物や新しいお店の話題になると、つい熱く語ってしまう。' },
    { id: 'sparrow3', name: 'スズ', username: '@Suzu_info', personality: '情報通。天気や地域のニュースなど、みんなが知らない豆知識を拾ってくる。' },
    { id: 'sparrow4', name: 'チュンコ', username: '@Chunko_view', personality: 'のんびり屋。空や風景を見て感じたこと、詩のような言葉でつぶやく。' },
    { id: 'sparrow5', name: 'モフ', username: '@Mofu_fluffy', personality: 'ちょっとドジで天然。自身の失敗談や勘違いを投稿してみんなを和ませる。' },
    { id: 'sparrow6', name: 'パタ', username: '@Pata_元気', personality: '元気いっぱい。朝のあいさつや、みんなを応援する前向きな言葉が多い。' },
    { id: 'sparrow7', name: 'チュンペイ', username: '@Chunpei_uwasa', personality: '噂好き。どこからか聞いてきた話を「〜らしいよ」と、ちょっとだけ大げさに広める。' },
    { id: 'sparrow8', name: 'ピヨミ', username: '@Piyomi_trend', personality: 'トレンドに敏感。人間の世界で流行っている新しい商品や言葉をすぐに使いたがる。' },
    { id: 'sparrow9', name: 'ハチ', username: '@Hachi_craft', personality: '職人気質。巣作りの工夫や、見つけた材料についてなど、こだわりが強い話をする。' },
    { id: 'sparrow10', name: 'コチュン', username: '@Kochun_piyo', personality: 'ひよっこキャラ。まだ世の中のことがよくわかっておらず、語尾がちょっと幼くてかわいらしい。「〜でちゅ」など。' },
];
