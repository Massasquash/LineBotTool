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

  /**
 * リプライを送る処理
 * @param replyToken {string} - リプライトークン
 * @param messages {object} - 送る内容に合わせたメッセージオブジェクト
 * @return {object} - ステータスコード200と空のJSONオブジェクト
 * 
 * リプライ、テンプレートメッセージ、
 * 
 * <参考>
 * - リプライメッセージ　https://developers.line.biz/ja/reference/messaging-api/#send-reply-message
 * - メッセージオブジェクト https://developers.line.biz/ja/reference/messaging-api/#message-objects
 */
  replyMessages(replyToken, messages){

    const header = Object.assign({'Content-Type': 'application/json'}, this.baseHeader);

    const body = {
        replyToken: replyToken,
        messages: messages,
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
 * クイックリプライを送る処理
 * 現在は「２つ」のみに対応
 * @param replyToken {string} - リプライトークン
 * @param msg {string} - テキスト内容
 * @param postbackOption {object} - ポストバックアクション」のitems用のオブジェクト
 * @return {object} - ステータスコード200と空のJSONオブジェクト
 * 
 * 例）postbackOption = [{label: 'はい', data: 'confirm_yes', displayText: 'はい'},
 *                      {label: 'いいえ', data: 'confirm_no', displayText: 'いいえ'}]
 * 
 * <参考>
 * - リプライメッセージ　https://developers.line.biz/ja/reference/messaging-api/#send-reply-message
 * - メッセージオブジェクト https://developers.line.biz/ja/reference/messaging-api/#message-objects
 */
  quickReply(replyToken, msg, postbackOption) {

    const items = [
      {
        type: 'action',
        action: {
          type: 'postback',
          label: postbackOption[0].label,
          data: postbackOption[0].data,
          displayText: postbackOption[0].displayText,
        }
      }, {
        type: 'action',
        action: {
          type: 'postback',
          label: postbackOption[1].label,
          data: postbackOption[1].data,
          displayText: postbackOption[1].displayText,
        }
      }
    ];

    const messages = [{
      type: 'text',
      text: msg,
      quickReply: {
        items: items
      }
    }];

    return this.replyMessages(replyToken, messages);

  }

}


/**
 * ファクトリ関数
 */
function createClient(channelAccessToken) {
  return new LineClient(channelAccessToken);
}