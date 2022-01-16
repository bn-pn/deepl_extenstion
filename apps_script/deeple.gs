const AUTH_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxx';
const DOMAIN = 'api-free.deepl.com';

function doPost(e) {
  // エクステンションから受け取ったデータを取り出す
  const params = JSON.parse(e.postData.getDataAsString());

  // deeplで翻訳
  var translateText = deepl(params.text);

  // 日付
  var today = Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd HH:mm:ss");

  // シートの最後に追加
  SpreadsheetApp.getActiveSheet().appendRow([params.text, translateText, today, params.title, params.url]);

  // エクステンションにレスポンスを返す
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({ sucsess: true }));
  return output;
}

// deepl翻訳を実行
function deepl(text) {
  if (text === '') {
    return '';
  }

  var source_lang = 'EN';
  var target_lang = 'JA';
  var data = _getTranslate(text, target_lang, source_lang);

  return data.translations[0].text;
}

// 使用状況を取得
function showUsage() {
  var data = _getUsage();
  Browser.msgBox(`${_toLocale(data.character_count)}文字（上限${_toLocale(data.character_limit)}文字）`);
}

function _toLocale(value) {
  return Number(value).toLocaleString();
}

function _getTranslate(text, target_lang, source_lang) {
  var url = _getBaseUrl('translate') + `&target_lang=${target_lang}&source_lang=${source_lang}&text=${text}`;
  return _getData(url);
}

function _getUsage() {
  var url = _getBaseUrl('usage');
  return _getData(url);
}

function _getBaseUrl(func) {
  return `https://${DOMAIN}/v2/${func}?auth_key=${AUTH_KEY}`;
}

function _getData(url) {
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText(); 
  return JSON.parse(json);
}


