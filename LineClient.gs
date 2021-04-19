/**
 * Line Messaging APIを扱うためのクラス
 * 
 * <参考>
 * - https://developers.line.biz/ja/reference/messaging-api/
 */
class LineClient{
  /**
   * トークンをもとにLine Messaging APIを扱うためのプロパティ・メソッドを発行する
   * @param {string} channelAccessToken - 発行したチャンエネルアクセストークン.
   */
  constructor(channelAccessToken) {

    //リクエストヘッダー
    this.baseHeader = {Authorization: `Bearer ${channelAccessToken}`}

    //リクエストURL
    this.baseUrl = 'https://api.line.me/v2/bot/';
    this.dataUrl = 'https://api-data.line.me/v2/bot';
    // this.oauthBaseUrl = 'https://api.line.me/v2/oauth';

    // [DEV]以下のリクエストURLは必要に応じて追加する
    // プロパティ名はAPIドキュメントで見たときのURLの動詞を抜かして命名（例：send-reply-message -> replyMessageUrl）
    this.pushMessageUrl = () => `${this.baseUrl}message/push`;
    this.replyMessageUrl = () => `${this.baseUrl}message/reply`;
    this.broadcastMessageUrl = () => `${this.baseUrl}message/broadcast`;
    this.contentUrl = (messageId) => `${this.dataUrl}message/${messageId}/content`;

  }

/**
 * LINEに応答メッセージ（テキストのみ）を送る処理
 * @param replyToken {string} - リプライトークン
 * @param msg {string} - テキスト内容（最大文字数：5000）
 * @return {object} - ステータスコード200と空のJSONオブジェクト
 * 
 * <参考>
 * - https://developers.line.biz/ja/reference/messaging-api/#send-reply-message
 */
  simpleReplyMessage(replyToken, msg){

    const header = Object.assign({'Content-Type': 'application/json'}, this.baseHeader);

    const body = {
        replyToken: replyToken,
        messages: [{type: "text", text: msg}],
        notificationDisabled: true
    };

    const options = {
      method: "POST",
      headers: header,
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    };

    return UrlFetchApp.fetch(this.replyMessageUrl(), options);
  
  }

  /**
   * LINEにブロードキャストメッセージ（テキストのみ）を送る処理
   * @param msg {string} - テキスト内容
   * @return {object} - ステータスコード200と空のJSONオブジェクト
   * 
   * <参考>
   * - https://developers.line.biz/ja/reference/messaging-api/#send-broadcast-message
   */
  simpleBroadcastMessage(msg){
    
    const header = Object.assign({'Content-Type': 'application/json'}, this.baseHeader);

    const body = {
        messages: [{type: "text", text: msg}],
        notificationDisabled: true
    }

    const options = {
      method: "POST",
      headers: header,
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    };
    
    return UrlFetchApp.fetch(this.broadcastMessageUrl(), options);
  
  }

  /**
   * ユーザーが送信した画像、動画、音声、およびファイルを取得する処理
   * @param msg {string} - テキスト内容
   * @return {object} - ステータスコード200とコンテンツのバイナリデータ
   * 
   * <参考>
   * - https://developers.line.biz/ja/reference/messaging-api/#get-content
   */
  getContent(messageId){

    const header = {...this.baseHeader};

    const options = {
      method: "GET",
      headers: header
    };

    return UrlFetchApp.fetch(this.contentUrl(messageId), options);
  
  }

}


/**
 * ファクトリ関数
 */
function createClient(channelAccessToken) {
  return new LineClient(channelAccessToken);
}