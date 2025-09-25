<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1UnOnXPjZxz51klhBjCUWqfi6RmpKASVq

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
# BlueBird – アノヒトの青い鳥
AIが幸せの青い鳥となって日々に寄り添う癒し系つぶやきアプリ。

## デモ
- Cloud Run: https://bluebird-app-345256205408.africa-south1.run.app

## 技術スタック
- Front: Vite + React
- Runtime: Cloud Run
- Data: Firestore
- Batch: Cloud Scheduler + Cloud Run Jobs（要約／ボット投稿）
- AI: Gemini API（Secret ManagerでAPIキー管理）

## アーキテクチャ
![architecture](docs/bluebird_architecture.png)

## ローカル実行メモ
```bash
npm install
npm run dev

## User & Problem
- 対象ユーザー: 日々の出来事を誰かに聞いてほしい人、日記を続けたいけど習慣化が難しい人  
- 課題: 記録はしたいけど面倒、振り返りや励ましが続かない  
- 解決: 青い鳥が毎日寄り添い、つぶやき化・日記化してくれることで、自然に記録が続く体験を提供

## Solution & Features
- 青い鳥がユーザーの日記を要約してツイート化  
- 1日の終わりにまとめ（ログ＋オソナエモノ）を生成  
- スズメの群れがタイムラインをにぎやかにする  
- 将来的にFirebaseでデータ保存、Lottieでアニメーション強化

## 環境変数の設定方法
アプリを動かすには `.env` ファイルを作成し、以下の変数を設定してください。

VITE_GEMINI_API_KEY=（自分のGoogle APIキー）
