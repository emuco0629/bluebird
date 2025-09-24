# ベースイメージとしてNode.js 20のslimバージョンを使用
FROM node:20-alpine

# 作業ディレクトリを /app に設定
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# ビルドした成果物をホスティングするためのサーバーをインストール
RUN npm install -g serve

# ポート番号を環境変数から取得
ENV PORT 8080

# アプリケーションを起動するコマンド
CMD ["serve", "-s", "dist", "-l", "8080", "--single"]