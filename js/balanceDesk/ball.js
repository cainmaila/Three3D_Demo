define(function () {
	'use strict';
	return function  (size_,color_) {
		  	var ball = new THREE.SphereGeometry( size_, 16, 16);
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial( { color: color_ } ),
				0.4, //磨擦
				0.8 //彈力
			);
			var mesh = new Physijs.SphereMesh( ball, material ,undefined,size_);
			mesh.castShadow = true;//可擋光
			mesh.receiveShadow = true;//可產生陰影
			return mesh;
		  }
});