# LineBotTool
GASでLINE Messaging APIを扱うためのスモールなライブラリです。



## 1. ライブラリの導入
`LineBotTool`という名前でライブラリ導入

## 2. ライブラリの利用

- 準備
LINE Messaging APIのチャンネルアクセストークンを元にインスタンス作成
```javascript
const lineClient = LineBotTool.createClient(channelAccessToken);
```

- メソッド呼び出し
```javascript
// ブロードキャストメッセージ
lineClient.simpleBroadcastMessage(msg)

// リプライメッセージ
lineClient.simpleReplyMessage(replyToken, msg)
```
