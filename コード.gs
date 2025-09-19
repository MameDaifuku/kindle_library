const SPREAD_SHEET_ID = "スプレッドシートのID";

/* POST通信受付用の予約関数 */
function doPost(e) {
    const response = ContentService.createTextOutput();
    response.setMimeType(MimeType.JSON);
    response.setContent(JSON.stringify('{"key1":"val1Post"}'));
  return response;
}

/* GET通信受付用の予約関数 */
function doGet() {
  getRequest();

  var template = HtmlService.createTemplateFromFile("main");

  // https://tech.actindi.net/2016/12/08/beginning-of-google-apps-script-webapp.html
  // setSandboxModeをつけるとなんかいい感じになるらしい。
  return template.evaluate()
  .setSandboxMode(HtmlService.SandboxMode.IFRAME)
}

//TODO カラム追加したらインデックスがずれるのヤバい。
let columnIndex = 0;
const ASIN                        = columnIndex++;
const title                       = columnIndex++;
const title_pronunciation         = columnIndex++;
const title_pronunciation_series  = columnIndex++;
const authors                     = columnIndex++;
const authors_pronunciation       = columnIndex++;
const publication_date            = columnIndex++;
const purchase_date               = columnIndex++;
const status_tag                  = columnIndex++;
const publishers                  = columnIndex++;
const textbook_type               = columnIndex++;
const cde_contenttype             = columnIndex++;
const content_type                = columnIndex++;
const origins                     = columnIndex++;
const comment                     = columnIndex++;

/* スプシのデータを一括取得 */
function getAllData() {
  // const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const spreadsheet = SpreadsheetApp.openById(SPREAD_SHEET_ID);
  const sheet = spreadsheet.getSheetByName('BOOKS'); 
  return sheet.getDataRange().getValues();
  // return sheet.getRange('A:O').getValues();//TODO テーブル構成が変化したらここを手動メンテしないといけない。カス。
}

/* ASINだけ取得 */
function getASINData() {
  // const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const spreadsheet = SpreadsheetApp.openById(SPREAD_SHEET_ID);
  const sheet = spreadsheet.getSheetByName('BOOKS'); 
  return sheet.getRange('A:A').getValues().flat();
}

/* 配列を受け取ってスプレッドシードに投入 */
function insertKindleBooks(targetArray) {
  // const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const spreadsheet = SpreadsheetApp.openById(SPREAD_SHEET_ID);
  const sheet = spreadsheet.getSheetByName('BOOKS'); 
  for (target of targetArray) {
    sheet.appendRow(target);
  }
}

/* シリーズ集計用の情報だけ取得 */
function getTitlePronunciationSeriesData() {
  // const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const spreadsheet = SpreadsheetApp.openById(SPREAD_SHEET_ID);
  const sheet = spreadsheet.getSheetByName('BOOKS'); 
  const seriesTitleArray = sheet.getRange('D:D').getValues();//title_pronunciation_seriesを取る
  const uniqueSeriesTitleArray = Array.from(new Set(seriesTitleArray.flat()));//シリーズ一覧を取得
  return uniqueSeriesTitleArray;
}

/* タグ更新、全力ループはマジでクソ実装だと思う */
function updateStatusTag(vals) {
  const target_title_pronunciation_series = vals[0];
  const target_status_tag = vals[1];
  
  // const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const spreadsheet = SpreadsheetApp.openById(SPREAD_SHEET_ID);
  const sheet = spreadsheet.getSheetByName('BOOKS'); 
  const values = sheet.getDataRange().getValues();

  for (let i=0; i<values.length; i++) {
    if (values[i][title_pronunciation_series] == target_title_pronunciation_series) {
      let temp = sheet.getRange((i+1)+":"+(i+1)).getValues();
      temp[0][status_tag] = target_status_tag;
      // return sheet.getRange(String(i+1) + ":" + String(i+1)).getValues();
      sheet.getRange(String(i+1) + ":" + String(i+1)).setValues(temp);
    }
  }
}





















































/* ★★★★★★★★★★★★★★★ 以下は検証実装 ★★★★★★★★★★★★★★★★★ */

/* 外部ドメインにリクエスト */
function getRequest() {
  // const URL = "https://www.amazon.co.jp/dp/B0FC1VGWVL";
  const URL = "https://www.amazon.co.jp/dp/B0FCXHQ14S?binding=kindle_edition&ref=dbs_dp_rwt_sb_pc_tkin";

  //HTTP GET(パラメータなし)の通信
  let responseDataGET = UrlFetchApp.fetch(URL).getContentText();
  return responseDataGET;

// //HTTP GET(パラメータ付き)の通信(amazonの「googleappsscript」の検索結果ページ)
// let responseDataGET2 = UrlFetchApp.fetch("https://www.amazon.co.jp/s?k=googleappsscript").getContentText();
// console.log(responseDataGET2);
// //HTTP POSTのAPI通信(リクルートのA3RTのAPI)
// let apiURL = "https://api.a3rt.recruit-tech.co.jp/image_influence/v1/meat_score";
// let apiKey = PropertiesService.getScriptProperties().getProperty("APIKEY");
// //リクルートのAPIに採点してもらう肉画像をGoogleドライブから取得する
// let meetImage = DriveApp.getFileById("1hmjS_6exIiogs_iWU1_vEt7CGOBWIyu5").getBlob();
// //APIのリクエストでPOSTデータするパラメーターを設定する
// let payload = {
// 'apikey': apiKey,
// 'predict':'1',
// 'imagefile': meetImage,
// };
// //HTTP POSTで前述で設定したパラメーターをオプションで設定する。
// let options = {
// 'method' : 'post',
// 'payload' : payload
// };
// //APIにリクエストし、結果をログ出力する
// let responseDataPOST = UrlFetchApp.fetch(apiURL,options).getContentText();
// }
}

/* スプシに書き込み */
function writeGSS() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('sheet1'); 
  sheet.getRange('D1').setValue('あいうえお');
}

/* スプシから読み込み */
function readGSS() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('sheet1'); 
  var values = sheet.getRange('A1:C3').getValues();
  return values;
}

/* HTMLからApps Scriptの関数を呼び出せることを確認 */
function myFunction(arg) {
  /* 意図的なぬるぽ
  let x;
  console.log(x.length);
  */
  return arg + "qwert";
}