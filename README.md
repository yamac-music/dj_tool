# DJ Toolkit ドキュメント

## 概要
DJ Toolkit は、現場の DJ がプレイ中に必要とする「タイムマネジメント」と「ジャンル跨ぎ用 BPM 計算」に絞った iOS 向けユーティリティです。暗いブース環境で片手で操作できるよう、シンプルな UI と高コントラスト配色で構築しています。

## 主な機能
### 1. Time Manager
- 30/45/60 分のプリセットをワンタップで呼び出し
- ±1 分単位の微調整ボタン
- 再生/一時停止、リセット操作（進行開始後の調整は initial time を固定）
- 5 分未満でタイマー表示と進捗バーが危険色に切り替わる視覚アラート

### 2. BPM Calculator
- 70〜180 BPM を 0.5 刻みで調整できるスライダーと ±0.5 の微調整ボタン
- 3/4 Loop・1/2 Loop の係数を選択し、`BaseBPM * factor` を小数第1位まで表示
- 目標 BPM とループ倍率を左右対称のレイアウトで表示

## 技術スタック
- Expo SDK 54（React Native 0.81 + React 19）
- TypeScript
- NativeWind + Tailwind CSS でスタイリング
- Lucide React Native でアイコンを描画

## ディレクトリ構成（抜粋）
```
app/
├── App.tsx            # 3 機能をまとめたメイン画面
├── assets/            # アイコン・スプラッシュ等
├── app.json           # Expo 設定（アプリアイコン、スプラッシュ、向きなど）
├── babel.config.js    # NativeWind プラグイン設定
├── tailwind.config.js # カスタムカラーパレット定義
└── global.d.ts        # NativeWind 型参照
```

## セットアップ手順
1. ルートで `cd app` を実行
2. 依存関係をインストール: `npm install`
3. 開発サーバー起動: `npm start`
4. Expo Go やシミュレータで QR を読み込むか `npm run ios` / `npm run android` で起動

## 初回起動時の注意
- 特殊な OS 権限は不要です。Expo Go またはシミュレータでそのまま動作します。

## カスタマイズポイント
- Tailwind カラーや余白は `app/tailwind.config.js` で管理しています
- 追加コンポーネントを作成する場合は `App.tsx` から分離して `components/` 配下へ配置し、Tailwind content パスに追加してください
- タイマーや BPM の初期値は App.tsx 冒頭の定数 (`PRESET_MINUTES`, `DEFAULT_PRESET`, `baseBpm`) を変更することで調整できます

## ライセンス
未定。プロジェクト方針に合わせて追記してください。
