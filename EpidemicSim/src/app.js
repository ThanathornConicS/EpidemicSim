// Copyright 2021 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Loader } from '@googlemaps/js-api-loader';
import { latLngToVector3, latLngToVector3Relative} from '@googlemaps/three';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const apiOptions = {
  apiKey: 'AIzaSyDEQPWQuG15KfetsMZM2jPzrwJyz0vAdAc',
  version: "beta",
  map_ids: ["5afdd176907dbee8"]
};

const mapOptions = {
  "tilt": 0,
  "heading": 0,
  "zoom": 13,
  "center": { lat: 13.764844967161544, lng: 100.53827147273205 },
  "disableDefaultUI": true,
  "disableDoubleClickZoom": true,
  "mapId": "5afdd176907dbee8"    
}

const geometry = new THREE.CircleGeometry( 100, 32 );
const susMaterial = new THREE.MeshBasicMaterial( { color: 0x1e1ed9 } );
const infMaterial = new THREE.MeshBasicMaterial( { color: 0x870900 } );

const testMat = new THREE.MeshBasicMaterial( { color: 0x602de0 } );

const circle = new THREE.Mesh( geometry, infMaterial );

let circles = new Array();

async function initMap() {    
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  return new google.maps.Map(mapDiv, mapOptions);
}


function initWebglOverlayView(map) {  
  let scene, renderer, camera, loader;
  const webglOverlayView = new google.maps.WebglOverlayView();
  
  webglOverlayView.onAdd = () => {   
    // set up the scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 ); // soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);

    for(let i = 0; i < 100; i++)
    {
      let cir = new THREE.Mesh( geometry, infMaterial );
      circles.push(cir);
    }
    
    let tempVec = latLngToVector3Relative({lat: 13.767069888905883, lng: 100.51414033330558}, mapOptions.center);
    console.log(tempVec);

    //circles[2].position.set(latLngToVector3({lat: 13.767069888905883, lng: 100.51414033330558}));
    for(let i = 0; i < 100; i++)
    {
      scene.add(circles[i]);
    }

    circles[2].translateX(tempVec.x);
    circles[2].translateY(tempVec.y);

    //scene.add(circle);

    // load the model    
    // loader = new GLTFLoader();               
    // const source = "pin.gltf";
    // loader.load(
    //   source,
    //   gltf => {      
    //     gltf.scene.scale.set(25,25,25);
    //     gltf.scene.rotation.x = 180 * Math.PI/180; // rotations are in radians
    //     scene.add(gltf.scene);           
    //   }
    // );
  }
  
  webglOverlayView.onContextRestored = (gl) => {        
    // create the three.js renderer, using the
    // maps's WebGL rendering context.
    renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    renderer.autoClear = false;

    // wait to move the camera until the 3D model loads    
    // loader.manager.onLoad = () => {        
    //   renderer.setAnimationLoop(() => {
    //     map.moveCamera({
    //       "tilt": mapOptions.tilt,
    //       "heading": mapOptions.heading,
    //       "zoom": mapOptions.zoom
    //     });            
        
    //     // rotate the map 360 degrees 
    //     if (mapOptions.tilt < 67.5) {
    //       mapOptions.tilt += 0.5
    //     } else if (mapOptions.heading <= 360) {
    //       mapOptions.heading += 0.2;
    //     } else {
    //       renderer.setAnimationLoop(null)
    //     }
    //   });        
    // }
  }

  webglOverlayView.onDraw = (gl, coordinateTransformer) => {
    // update camera matrix to ensure the model is georeferenced correctly on the map     
    const matrix = coordinateTransformer.fromLatLngAltitude(mapOptions.center, 120);
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

    circles[0].translateX(0.1);
    console.log(circles[0].position);
    circles[1].translateY(0.2);
    circles[1].material = susMaterial;

    circles[2].material = testMat;

    webglOverlayView.requestRedraw();      
    renderer.render(scene, camera);                  

    // always reset the GL state
    renderer.resetState();
  }
  webglOverlayView.setMap(map);
}

(async () => {        
  const map = await initMap();
  initWebglOverlayView(map);    
})();