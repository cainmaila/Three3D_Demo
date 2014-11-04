require([
	"domReady",
	"Detector",
	"three/three.min"
], function (domReady) {
	"use strict";
	//==================================================================================
	var container,camera,renderer, scene, mesh, window_innerWidth, window_innerHeight, windowHalfX, windowHalfY;
	var BG_COLOR = 0x000000; //背景色
	domReady(function () {
		if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
		windowsRest();
		container = document.createElement( "div" );
		document.body.appendChild( container );
		camera = new THREE.PerspectiveCamera( 70, window_innerWidth / window_innerHeight, 1, 10000 );
		camera.position.z = 200;
		scene = new THREE.Scene();
		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( BG_COLOR );
		renderer.setSize( window_innerWidth, window_innerHeight );
		renderer.shadowMapEnabled = true; //陰影
		renderer.shadowMapType = THREE.PCFSoftShadowMap; //軟陰影
		renderer.sortObjects = true;
		container.appendChild(renderer.domElement);
		//燈光
		var light = new THREE.DirectionalLight( 0xffffff, 1 ); //or THREE.SpotLight
		light.position.set(300, 300, 300);
		light.castShadow = true; //陰影
		light.shadowDarkness = 0.5; //陰影 0~1
		light.shadowCameraVisible = true; //顯示debuge光照範圍
		//light.shadowMapWidth = 512; //光影貼圖範圍
    	//light.shadowMapHeight = 512; //光影貼圖範圍
    	var d = 100;
	    light.shadowCameraLeft = -d; //光照範圍
	    light.shadowCameraRight = d; //光照範圍
	    light.shadowCameraTop = d; //光照範圍
	    light.shadowCameraBottom = -d; //光照範圍
	    light.shadowCameraFar = 600; //光照範圍 深度
    	light.shadowDarkness = 0.5; //0~1
		scene.add( light );
		//模型
		var geometry = new THREE.BoxGeometry( 100, 100, 100 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff0f00, side: THREE.DoubleSide } );
		mesh = new THREE.Mesh( geometry, material );
		mesh.castShadow = true;//可擋光
		mesh.receiveShadow = true;//可產生陰影
		scene.add( mesh );
		//動畫
		onWindowResize();
		animate();
		window.addEventListener( 'resize', onWindowResize, false );
	});

	function animate () {
		requestAnimationFrame( animate );
		//動畫=================================
		mesh.rotation.y += 0.01;
		mesh.rotation.z += 0.01;
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