console.log("content.js開始");

var pre = 0;

window.addEventListener("keydown", function(e){

  // Ctrl + C の場合
  if((e.ctrlKey || e.metaKey) && e.keyCode === 67){

    var now = (new Date()).getTime();
    var diff = now - pre;

    console.log(diff)

    // 2秒以内に2回押したら翻訳を実行
    if(diff < 2000){
      // 選択している文字、URL、タイトルを送る
      sendMessage(window.getSelection().toString(), document.URL, document.title);
      pre = 0;
    } else {
      // 押下時の時間を記録
      pre = now;
    }
  }
});

function sendMessage(text, url, title) {
  chrome.runtime.sendMessage({
    text: text,
    url: url,
    title: title
  }, response => {
    console.log(`backgroundからの戻り値: ${JSON.stringify(response)}`);
  });
}
