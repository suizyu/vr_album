/* global $ */
/* global Image */
/* global THREE*/
/* global scene */

var server = "https://api.flickr.com/services/rest";
var method ="?method=flickr.photos.search&per_page=5&text=";

var depth;
//3d格納配列
var p_frame=new Array();
//円軌道の半径
var r=10;
//円軌道の間隔（角度）
var per=25;
var rad,sita,o_x,o_z;

function addPhotos(photos){
    //停止条件
    if (photos.length == 0) return;
  
    //確認
    //console.log(photos);
    
    //JSONPからデータを一つ取り出す
    var item = photos.shift();
    //console.log(item);
  
    //表示
    var itemFarm = item.farm;
    var itemServer = item.server;
    var itemID = item.id;
    var itemSecret = item.secret;
    var itemTitle = item.title;
    var itemPath = '//farm' + itemFarm + '.static.flickr.com/' + itemServer + '/' + itemID + '_' + itemSecret + '_m.jpg';

    /* Imageオブジェクトを生成 */
    var imgdom = new Image();
    //重要！無い場合エラー発生
    imgdom.crossOrigin = "anonymous";
    
    imgdom.onload=function () {

        //キャンバス作成、imgdomのwidth/heightから縦横決定
        var c_w=imgdom.width;
        var c_h=imgdom.height;
        var canvas=document.createElement('canvas');
        var ctx=canvas.getContext('2d'); 
        canvas.width=c_w;
        canvas.height=c_h;
      
        //PlaneGeometryの縦横決定
        var w=c_w/100;
        var h=c_h/100;
      
        //canvas要素にimgdomを貼る
        ctx.drawImage(imgdom, 0, 0);
        //canvasをテクスチャ化
        var tex = new THREE.Texture(canvas);
        //重要
        tex.needsUpdate = true;

        //座標計算(円軌道)
        rad=depth*per;
        sita=Math.PI*(rad)/180;
        o_z=r*Math.cos(sita);
        o_x=r*Math.sin(sita);
      
        //3Dオブジェクト作成
        var geometry = new THREE.PlaneGeometry(w, h);
        var material = new THREE.MeshBasicMaterial({ map: tex });
        p_frame[depth] = new THREE.Mesh(geometry, material);
        p_frame[depth].position.set(o_x, 0,o_z);
        p_frame[depth].renderOrder = 1;
        scene.add(p_frame[depth]);
        depth++;
      
        //再帰呼び出し
        addPhotos(photos);
    }
    
    //img要素のロード開始
    imgdom.src = itemPath;
}
	
function search_photo(){
  
    //検索ワード取得
    var keyword=$("#searchBox").val();

    //ワードが入力されたか？
    if(keyword.length==0){
         $("#result-box").text("検索ワードを入れてください");
    }
    else{
        $("#result-box").text(keyword);
        console.log(keyword);
    }

    //画像の取得件数
    var many=20;

    //APIキー
    var apiKey = "6221e6b2c2e5aeed72cf711888bbc5d1";

    //JSON取得
    $.ajax({
        type    : 'GET',
        url     : '//api.flickr.com/services/rest/',
        scriptCharset: 'UTF-8',
        data    : {
            format  : 'json',
            api_key : apiKey,
            method  : 'flickr.photos.search',
            text:keyword,
            per_page:many
        },
        dataType: 'jsonp',
        jsonp   : 'jsoncallback',
        success : function(data)
        {
            if (data.stat == 'ok') {
                // success
                depth=0; //添え字初期化
                //再帰関数addPhotosにJSONPを渡す
                addPhotos(data.photos.photo);
            } else {
                // fail
            }
        }
    });
}