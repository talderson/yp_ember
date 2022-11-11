import Component from '@glimmer/component';
import Ember from 'ember';
import { get } from '@ember/object';
import ENV from 'geotechnical-data-platform-new/config/environment';

import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default Ember.Component.extend({
    didInsertElement() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( 800, 600 );
        // renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( 0xffffff);
        document.getElementById('three-D').appendChild( renderer.domElement );

        var obj;
        var loader = new GLTFLoader();
        loader.load('./assets/open-pit-mine/scene.gltf', function(gltf){
            obj = gltf.scene;
            scene.add(obj);
        });

        //console.log(obj.getWorldPosition());
        
        var light = new THREE.HemisphereLight(0xffffff, 0x000000, 15);

        scene.add(light);

        camera.position.set(0,0,30);
        
        // camera.lookAt(obj.position);

        // controls = new THREE.TrackballControls( camera );
        // controls.target.set( 0, 0, 0 );

        // obj.rotation.y = THREE.MathUtils.lerp(obj.rotation.y, (mouse.x * Math.PI) / 10, 0.1)
        // obj.rotation.x = THREE.MathUtils.lerp(obj.rotation.x, (mouse.y * Math.PI) / 10, 0.1)

        function animate(){
            requestAnimationFrame(animate);
            obj.rotation.y += 0.01;
            renderer.render(scene,camera);
        }
        animate();

        
    }
});