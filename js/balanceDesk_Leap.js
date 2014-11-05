require([
	"domReady",
	"Detector",
	"lib/leap",
	"three/three.min",
	"order!three/physi/physi",
	"order!balanceDesk/ball"
], function (domReady,detector,leap,thre,physi,Ball) {
	"use strict";
	// 平衡台範例 Balance Desk ==================================================================================
	Physijs.scripts.worker = 'js/three/physi/physijs_worker.js';
	Physijs.scripts.ammo = 'ammo.js';
	var container,camera,renderer, scene, foot, mesh, window_innerWidth, window_innerHeight, windowHalfX, windowHalfY, mouseX=0, mouseY=0;
	var BG_COLOR = 0xFFFFCC, //背景色
		ballArr=[],
		tmpArr=[];
	domReady(function () {
		if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
		windowsRest();
		container = document.createElement( "div" );
		document.body.appendChild( container );
		camera = new THREE.PerspectiveCamera( 70, window_innerWidth / window_innerHeight, 1, 10000 );
		camera.position.z = 150;
		camera.position.y = 100;
		//scene = new THREE.Scene();
		scene = new Physijs.Scene();
		scene.setGravity(new THREE.Vector3( 0, -50, 0 ));
		scene.addEventListener(
			'update',
			function() {
				foot.rotation.z = mouseX;
				foot.rotation.x = mouseY;
				//foot.__dirtyPosition = true;
				foot.__dirtyRotation = true;
				scene.simulate();
			}
		);
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor( BG_COLOR );
		renderer.setSize( window_innerWidth, window_innerHeight );
		renderer.shadowMapEnabled = true; //陰影
		renderer.shadowMapSoft = true;
		renderer.shadowMapType = THREE.PCFSoftShadowMap; //軟陰影
		renderer.sortObjects = true;
		//renderer.gammaInput = true;
		container.appendChild(renderer.domElement);
		//燈光
		var light = new THREE.DirectionalLight( 0xffffff, 1 );
		light.position.set( 100, 150, 200 );
		light.castShadow = true; //陰影
		light.shadowDarkness = 0.5; //陰影 0~1
		//light.shadowCameraVisible = true; //顯示debuge光照範圍
	    light.shadowCameraLeft = -150; //光照範圍
	    light.shadowCameraRight = 150; //光照範圍
	    light.shadowCameraTop = 150; //光照範圍
	    light.shadowCameraBottom = -150; //光照範圍
	    light.shadowCameraFar = 400; //光照範圍 深度
		scene.add( light );
		//模型
		var geometry = new THREE.BoxGeometry( 150, 5, 150 );
		//var material = Physijs.createMaterial(new THREE.MeshBasicMaterial( { color: 0x66CCCC ,side:THREE.DoubleSide} ),
		var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({ color: 0x66CCCC}),
			0.4, //磨擦
			0.2 //彈力
		);
		foot = new Physijs.BoxMesh( geometry, material ,0); //質量
		foot.castShadow = true;//可擋光
		foot.receiveShadow = true;//可產生陰影
		scene.add( foot );
		camera.lookAt(foot.position);

		var box,material;	
		for (var i = 30 - 1; i >= 0; i--) {
			mesh = new Ball(Math.random()*3+3,Math.random()*0xffffff);
			ballArr.push(mesh);
		};

		//動畫
		onWindowResize();
		animate();
		scene.simulate();
		window.addEventListener( 'resize', onWindowResize, false );
		var headNum,head_1;
		Leap.loop(function(frame){
			headNum = frame.fingers.length; //手數量
			if(headNum!=0){
				head_1 = frame.hands[0];
				mouseX = head_1.palmNormal[0];
				mouseY = -head_1.palmNormal[2];
			}else{
				mouseX = 0;
				mouseY = 0;
			}
		});
	});
	var tmp=0,_ball;
	function animate (d) {
		requestAnimationFrame( animate );
		//動畫=================================
		tmp++;
		if(tmp>50){
			tmp = 0;
			if(ballArr.length!=0){
				_ball = ballArr.shift();
				_ball.position.set(Math.floor(Math.random()*80-40),100,Math.floor(Math.random()*80-40));
				scene.add(_ball);
				tmpArr.push(_ball);
			}
		}
		for (var i = tmpArr.length - 1; i >= 0; i--) {
			if(tmpArr[i].position.y<-200){
				_ball = tmpArr.splice(i,1)[0];
				scene.remove(_ball);
				ballArr.push(_ball);
			}
		};
		
		//=================================
		renderer.render( scene, camera );
	}

	function windowsRest() {
		//重置視窗數值
		window_innerWidth = window.innerWidth;
		window_innerHeight = window.innerHeight;
		windowHalfX = window_innerWidth >> 1;
		windowHalfY = window_innerHeight >> 1;
	}

	function onWindowResize() {
		windowsRest();
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
});