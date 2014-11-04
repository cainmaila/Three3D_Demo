require([
	"domReady",
	"Detector",
	"three/three.min",
	"order!three/physi/physi",
], function (domReady) {
	"use strict";
	//==================================================================================
	Physijs.scripts.worker = 'js/three/physi/physijs_worker.js';
	Physijs.scripts.ammo = 'ammo.js';
	var container,camera,renderer, scene, mesh, window_innerWidth, window_innerHeight, windowHalfX, windowHalfY;
	var BG_COLOR = 0x000000; //背景色
	domReady(function () {
		if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
		windowsRest();
		container = document.createElement( "div" );
		document.body.appendChild( container );
		camera = new THREE.PerspectiveCamera( 70, window_innerWidth / window_innerHeight, 1, 10000 );
		camera.position.z = 200;
		//scene = new THREE.Scene();
		scene = new Physijs.Scene();
		scene.setGravity(new THREE.Vector3( 0, -50, 0 ));
		scene.addEventListener(
			'update',
			function() {
				scene.simulate();
			}
		);
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
		var geometry = new THREE.BoxGeometry( 100, 100, 100 );
		var material = Physijs.createMaterial(new THREE.MeshBasicMaterial( { color: 0xff0f00, side: THREE.DoubleSide } ),
			0.4, //磨擦
			0.8 //彈力
		);
		mesh = new Physijs.BoxMesh( geometry, material ,1); //質量
		scene.add( mesh );
		//動畫
		onWindowResize();
		animate();
		scene.simulate();
		window.addEventListener( 'resize', onWindowResize, false );
	});

	function animate () {
		requestAnimationFrame( animate );
		//動畫=================================
		//mesh.rotation.y += 0.01;
		//mesh.rotation.z += 0.01;
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