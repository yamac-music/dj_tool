# UI調整ガイド

DJ Toolkit の見た目を変更したい場合は、主に `app/App.tsx` 内のスタイル定義を編集します。以下は代表的な調整ポイントです。

## カラーパレット
- `const colors = { ... }` に背景やアクセント色を定義しています。配色を変える場合はここを更新してください。

## レイアウト比率
- `styles.weightMain / weightSub` でタイマーと BPM セクションの高さ配分を決定しています。縦方向のバランスを変えたい場合に調整します。

## タイマー領域
- `styles.timerText` の `fontSize` を変更するとカウントダウンの大きさを調節できます。
- プログレスバーは `styles.progressTrack` / `styles.progressFill` で色・太さを変更できます。
- メイン操作ボタン（±, Play/Pause）は `styles.circleButton`、`styles.playButton`、`styles.pauseButton` を編集してください。

## BPMセクション
- スライダーや表示の余白は `styles.baseCard` / `styles.slider` / `styles.baseValue` を変更します。
- ループ選択ボタンのサイズ・間隔は `styles.loopColumn` と `styles.loopButton` / `styles.loopButtonActive` / `styles.loopText` で調整します。
- 目標 BPM の見た目は `styles.targetCard` / `styles.targetValue` / `styles.loopTag` を編集すると変更できます。

これらのスタイルはいずれも `StyleSheet.create({ ... })` 内にまとまっているので、任意の値に置き換えることで UI を微調整できます。EOF
