chrome.runtime.onMessage.addListener(
  function (request, sender, callback) {
    console.log(`バックグラウンドで受け取ったもの: ${request.message}`);

    // 「ウェブアプリ」としてデプロイしてるGASのURL
    const gasUrl = "https://script.google.com/a/macros/xxxxxxxxxx";

    const obj = request;
    const method = "POST";
    const body = JSON.stringify(obj);
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // 受け取った情報をGASのウェブアプリに送る
    fetch(gasUrl, {method, headers, body}).then(response => {
      return response.text();
    }).then(json => {
      console.log(`GASからのレスポンス: ${json}`);
      callback(JSON.parse(json));
    }).catch(console.error);

    // 非同期を同期的に扱うためtrueを返す
    return true;
  }
);