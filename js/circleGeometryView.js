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
		renderer.sortObjects = false;
		container.appendChild(renderer.domElement);
		//燈光
		var light = new THREE.DirectionalLight( 0xffffff, 1 );
		light.position.set( 1, 1, 1 ).normalize();
		scene.add( light );
		//模型
		var material = new THREE.MeshBasicMaterial( { color: 0xff0f00, side: THREE.DoubleSide } );
		var radius = 100;
		var segments = 50;
		var geometry = new THREE.CircleGeometry( radius, segments );
		mesh = new THREE.Mesh( geometry, material );
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