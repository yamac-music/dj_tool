# DJ Toolkit システム仕様書

## 1. 概要
- **目的**: 現場の DJ がプレイ時間とジャンル移行時の BPM 計算を片手で管理できる単機能 iOS アプリを提供する。
- **プラットフォーム**: Expo SDK 54 / React Native 0.81 / React 19。
- **対応端末**: iPhone 15 Pro 以降推奨、縦画面固定。
- **開発言語**: TypeScript。

## 2. アーキテクチャ
- **UI レイヤー**: React Native コンポーネント + NativeWind/Tailwind 風クラスを StyleSheet で再現。
- **状態管理**: React Hooks（`useState`, `useEffect`, `useMemo`）。
- **構成要素**:
  - `App.tsx`: 画面全体。単一画面構成。
  - `App.json`: Expo 設定（アイコン、スプラッシュ、iOS/Android 配置）。
  - `tailwind.config.js`/`babel.config.js`: スタイリング設定。

## 3. 機能仕様
### 3.1 Time Manager
| 項目 | 仕様 |
| --- | --- |
| プリセット | 30m / 45m / 60m ボタンで即時セット |
| 調整 | `+/-` ボタンで ±1 分（残り秒数下限 0） |
| 表示 | `MM:SS`、5分未満で警告色に切替 |
| 動作 | `▶︎/II` で開始/一時停止、`RESET` で初期値へ |
| プログレスバー | 初期値を 100% とし残量で縮小。危険色切替あり |

### 3.2 BPM Calculator
| 項目 | 仕様 |
| --- | --- |
| 基準 BPM | 70〜180 をスライダーで調整（整数） |
| ループモード | 3/4 Loop (×4/3)、1/2 Loop (×2) |
| 計算式 | `targetBpm = round(baseBpm * factor)` |
| 表示 | 基準値・ループ選択・目標 BPM・倍率タグ |

## 4. UI/UX 仕様
- **ダークテーマ**: 背景 #020617, 主要アクセント #06b6d4/#d946ef。
- **タイポグラフィ**: 等幅スタイル（`fontVariant: ['tabular-nums']`）で揺れ防止。
- **配置**: 画面を 65% タイマー、35% BPM で縦分割。余白は SafeArea + 20px パディング。
- **アクセシビリティ**: ボタンはミニマム 56px、ハイコントラスト配色。

## 5. ステート遷移
- `timeLeft` = 残り秒数。
- `initialTime` = プログレスバー分母。プリセット or 開始前調整時のみ更新。
- `isRunning` = タイマー状態。1s 間隔で減算、0 到達で停止。
- `hasStarted` = プリセット強制解除用フラグ。
- `baseBpm` / `loopMode` = BPM 計算入力。変更即反映。

## 6. 依存関係
- `expo`, `react`, `react-native`
- UI: `@react-native-community/slider`, `lucide-react-native`
- ツール: `nativewind`, `tailwindcss`
- 型: `typescript`, `@types/react`

## 7. ビルド・実行
1. `cd app && npm install`
2. 開発サーバー: `npm start`
3. iOS 実機/シミュレータ: Expo CLI から QR または `npm run ios`
4. Web テスト: `npm run web`

## 8. テスト方針
- 現状は手動確認（タイマー遷移、BPM 計算）。
- 追加の自動テストを導入する場合は React Native Testing Library を想定。

## 9. 非機能要件
- **パフォーマンス**: タイマーは 1 秒毎の setInterval のみでリソース負荷軽微。
- **安定性**: 外部 API/センサー連携なし。ネットワーク不要。
- **権限**: マイク/位置情報など不要。

## 10. 今後の拡張余地
- Room Level 計測機能の再導入（センサー/キャリブレーション実装）
- プリセット編集やセットリスト管理などのメタ機能
- Haptics やテーマ切替などの UX 強化
