/* global THREE */
/* global Detector */
/* global Image*/
/* global WebVRManager*/
/* global cube */
/* global scene */
/* global $*/
/* global per*/
/* global r*/

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var scene;
var increase=0;

function world_field(){
    //シーン作成
    scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 2000 );
    camera.position.x=0;
    camera.position.y=0;
    camera.position.z=0;
    scene.add(camera);

    //レンダラー作成
    var renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
   // renderer.shadowMap.Enabled = true;
  	document.body.appendChild( renderer.domElement );
   // document.body.appendChild(renderer.domElement);
    
    var controls = new THREE.VRControls(camera);
    controls.standing = true;
    //VR
    var effect = new THREE.VREffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);
    
    var manager = new WebVRManager(renderer, effect);
    
    window.addEventListener('resize', onResize, true);
    window.addEventListener('vrdisplaypresentchange', onResize, true);
    
	//背景色
	renderer.setClearColor(0xeeeeee,1);
	//document.body.appendChild( renderer.domElement );
    
	// ライト1
	scene.add( new THREE.AmbientLight( 0x222222 ) );
	// ライト2
	var light = new THREE.PointLight( 0xffffff, 1 );
	camera.add( light );
    
    // ヘルパー:制作時のみ。完成版では非表示
	//scene.add( new THREE.AxisHelper( 20 ) );
  
	
    function render() {
      //アニメーション処理
      increase+=0.25;
      var radias,angle;
		
      $.each(p_frame,function(i,obj){
           //角度
		   angle=i*per+increase;
           //ラジアン変換
    	   radias=Math.PI*(angle)/180;
    	   obj.position.x=(r-angle/360)*Math.sin(radias);
    	   obj.position.z=(r-angle/360)*Math.cos(radias);
		   //常にカメラの正面に向ける（ビルボード）
		   obj.rotation.setFromRotationMatrix(camera.matrix);
		});

      requestAnimationFrame(render);
      controls.update();
     // renderer.render(scene, camera);
     manager.render(scene, camera);
    }
  
    render();
    
    //画面サイズ
    function onResize(e) {
      effect.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
}


