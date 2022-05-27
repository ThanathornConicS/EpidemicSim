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
import { latLngToVector3, latLngToVector3Relative, ThreeJSOverlayView} from '@googlemaps/three';
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
  "zoom": 17.5,
  "center": { lat: 13.731103016245251, lng: 100.54504578180229 },
  // "center": { lat: 13.730953535945233, lng: 100.54204888984198},
  "disableDefaultUI": true,
  "disableDoubleClickZoom": true,
  "mapId": "5afdd176907dbee8"    
}

// Simulation var
let manager = new Manager;
//let userInitData = new UserInitData;
let units = 10;
let deathRate = 50;
let cureRate = 50;
const day = 24;
const loop = 100; //day * 7 * 4 // days * weeks
const placeList = [
  new Vec2(13.730811243930567, 100.5458354857367),
  new Vec2(13.731062586670296, 100.5467396597854),
  new Vec2(13.731614765300431, 100.54598590319902),
  new Vec2(13.731966590974539, 100.54327031202271),
  new Vec2(13.730954721281757, 100.54205486786479),
  new Vec2(13.730489957174711, 100.54382521338285)
];

const nodes = [
  new Vec2(13.73040191578293, 100.54527926912951),
  new Vec2(13.73042596906842, 100.54597116836293),
  new Vec2(13.730433785748444, 100.54674096235308),
  new Vec2(13.732103943750552, 100.54674632677094),
  new Vec2(13.73221337646406, 100.54559297689023),
  new Vec2(13.731869444906772, 100.5459658039447),
  new Vec2(13.73191113360725, 100.54554469712777),
  new Vec2(13.732570133808654, 100.5454491543675),
  new Vec2(13.732443094363317, 100.5447537993192),
  new Vec2(13.73146086021523, 100.54381921662171),
  new Vec2(13.731079739869692, 100.5430792057446),
  new Vec2(13.731569308980818, 100.54237747129223),
  new Vec2(13.72980623567201, 100.54269963119984),
  new Vec2(13.729344370419865, 100.54480511708198)
];

const neighborList = [
  [7],
  [8, 9],
  [12],
  [14, 15, 16, 17],
  [17, 18],
  [15, 16, 18, 19],
  [7, 19],
  [0, 6, 8],
  [1, 7],
  [1, 10],
  [9, 11, 13],
  [10, 12],
  [2, 11],
  [10, 14],
  [3, 13, 15],
  [3, 5, 14, 16],
  [3, 5, 15],
  [3, 4],
  [4, 5, 19],
  [5, 6, 18],
]; 



// map
// new Vec2(13.764844967161544, 100.53827147273205),
//   new Vec2(13.79400311190518 , 100.5499287331782),
//   new Vec2(13.778498517795457, 100.47620017784728),
//   new Vec2(13.747402871956538, 100.539028238978),
//   new Vec2(13.771162652204502, 100.5722447130237),
//   new Vec2(13.742963276787627, 100.50933082266478),

let renderMax = manager.stepSol * day;

var chartDat;

// Rendering var
const geometry = new THREE.CircleGeometry( 7, 32 );
const geometry_unit = new THREE.CircleGeometry( 5, 32 );
const geometry_node = new THREE.CircleGeometry( 4, 32 );

const susMaterial = new THREE.MeshBasicMaterial( { color: 0x1e1ed9 } );
const infMaterial = new THREE.MeshBasicMaterial( { color: 0x870900 } );
const testMat = new THREE.MeshBasicMaterial( { color: 0x602de0 } );
const nodeMat = new THREE.MeshBasicMaterial( { color: 0x000000 } );

let loopCounter = -1;
let timeCounter = 0;
let deltaTime = 0.0;
let lastFrame = 0.0;

let circles = new Array();
let nodePaths = new Array();
let agents = new Array();

function SetValue()
{
  units = document.getElementById("popNum").value;
  units = parseInt(units);

  cureRate = document.getElementById("cureRate").value;
  cureRate = parseInt(cureRate);

  deathRate = document.getElementById("deathRate").value;
  deathRate = parseInt(deathRate);
}

async function initMap() {    
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  return new google.maps.Map(mapDiv, mapOptions);
}

function initWebglOverlayView(map) {  
  let scene, renderer, camera, loader;
  const webglOverlayView = new google.maps.WebGLOverlayView();
  
  document.getElementById("Run").addEventListener("click", () =>
  {
    SetValue(); 
    console.log("Pressed!!" + units + ": " + cureRate + ": " + deathRate);
  });

  webglOverlayView.onAdd = () => {   
    // set up the scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 ); // soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);
    
    // Render Place
    for(let i = 0; i < placeList.length; i++){
      let cir = new THREE.Mesh( geometry, testMat );
      let tempVec = latLngToVector3Relative({lat: placeList[i].x, lng: placeList[i].y}, mapOptions.center);
      circles.push(cir);

      circles[i].translateX(tempVec.x);
      circles[i].translateY(-tempVec.z);
      scene.add(circles[i]);
      // Add place to manager
      manager.AddPlace(new Vec2(tempVec.x, -tempVec.z));
      // Add node path to manager --> PathFinder
      manager.AddPath(new Vec2(tempVec.x, -tempVec.z));
    }
    console.log("AddPlace()...[PASS]");

    // Render Node
    for(let i = 0; i < nodes.length; i++){
      let cir = new THREE.Mesh( geometry_node, nodeMat );
      let tempVec = latLngToVector3Relative({lat: nodes[i].x, lng: nodes[i].y}, mapOptions.center);
      nodePaths.push(cir);

      nodePaths[i].translateX(tempVec.x);
      nodePaths[i].translateY(-tempVec.z);
      scene.add(nodePaths[i]);
      // Add node path to manager --> PathFinder
      manager.AddPath(new Vec2(tempVec.x, -tempVec.z));
    }
    console.log("AddNodePath...[PASS]");

    // Set Neighbors
    for(let i = 0; i < neighborList.length; i++){
      for(let j = 0; j < neighborList[i].length; j++){
          manager.AddNeighbor(i,neighborList[i][j]);
      }
    }
    console.log("SetNeighbors...[PASS]");

    //console.log(manager.pathFinder.nodeList);

    // Simulation
    manager.UnitInit(units);
    manager.SetCureDeathRate(cureRate, deathRate);
    console.log("UnitInit()...[PASS]");

    // Declare agent mesh
    for(let i = 0; i < units; i++){
      let agt = new THREE.Mesh( geometry_unit, susMaterial );
      agents.push(agt);
      scene.add(agents[i]);
      // hide by default
      agents[i].visible = false;
    }
    console.log("AgentsMesh...[PASS]");

    // Select first location to spawn inf
    let spawnPos = 0;
    while(manager.m_destList[spawnPos].m_susList.size == 0){                 
      spawnPos++;
      console.log("Change SpawnDest..." + spawnPos);
    }
    manager.SpawnInf(spawnPos); 
    console.log("SpawnInf()...[PASS]");

    // Calculate render data
    manager.RenderCalculate();
    console.log("RenderCalculate()...[PASS]");

    // console.log("path : " + manager.m_unitList[0].m_destPath);
    // console.log("m_stayDelay : " + manager.m_unitList[0].m_stayDelay);
    // console.log("m_travDelay : " + manager.m_unitList[0].m_travDelay);


    manager.CountStat();

    // Execute
    for(let i = 1; i <= loop; i++){

      // console.log("counter : " + manager.m_unitList[0].m_counter);

      // // Check dest
      // for(let x = 0; x < manager.m_destList.length; x++){

      //   console.log(x + " Dest : ");
      //   for(let [key, value] of manager.m_destList[x].m_susList){
      //       console.log(value);
      //   }

      //   console.log("---------");
      //   for(let [key, value] of manager.m_destList[x].m_infList){
      //       console.log(value);
      //   }
      // }

      manager.SetStep(i);
      manager.UpdateUnits();
      manager.SpreadByDest();
      manager.CountStat();
    }
    console.log("EXECUTE...[PASS]");

    chartDat = manager.GetStat();

    RunChart(chartDat);

    // // Check inf
    // let infCount = 0;
    // for(let i = 0; i < manager.m_unitList.length; i++)
    // {
    //   if(manager.m_unitList[i].m_state == true)
    //   {
    //     infCount++;
    //   }
    // }
    // console.log("Total Inf: " + infCount);

    // // Data checking [Debug]
    // for(let i = 0; i < manager.m_unitList.length; i++){
    //   console.log(manager.m_drawData[i]);
    // }
  }
  
  webglOverlayView.onContextRestored = ({gl}) => {        
    // create the three.js renderer, using the
    // maps's WebGL rendering context.
    renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    renderer.autoClear = false;
  }

  webglOverlayView.onDraw = ({gl, transformer}) => {
    const latlngLit = 
    {
      lat: mapOptions.center.lat,
      lng: mapOptions.center.lng,
      altitude: 120,
    };
    // update camera matrix to ensure the model is georeferenced correctly on the map     
    const matrix = transformer.fromLatLngAltitude(latlngLit);
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

    // Time tracking
    let currentFrame = performance.now();
    deltaTime = currentFrame - lastFrame;
    lastFrame = currentFrame;

    timeCounter += deltaTime;
    if(loopCounter < 0){
      timeCounter = 0;
      loopCounter = 0;
    }

    // Rendering
    if(timeCounter > manager.renderStep){
      timeCounter -= manager.renderStep;

      for(let i = 0; i < manager.m_unitList.length; i++){
        // Check state trigger
        if(manager.m_drawData[i].stateCheck.has(loopCounter % renderMax)){
          // if(manager.m_drawData[i].stateCheck.get(loopCounter % renderMax)){
          //   agents[i].material = infMaterial;
          // }else{
          //   agents[i].material = susMaterial;
          // }
          switch(manager.m_drawData[i].stateCheck.get(loopCounter % renderMax)){
            case 0: // sus,rev
              agents[i].visible = true;
              agents[i].material = susMaterial;
              break;
            case 1: // inf
              agents[i].visible = true;
              agents[i].material = infMaterial;
              break;
            case 2: // qua, ded
              agents[i].visible = false;
          }
            
        
        }

        // Set position & visibility
        if(manager.m_drawData[i].datPath.has(loopCounter % renderMax)){
          let nextPos = manager.m_drawData[i].datPath.get(loopCounter % renderMax);
          let thisPos = agents[i].position;
          
          agents[i].translateX(nextPos.x - thisPos.x);
          agents[i].translateY(nextPos.y - thisPos.y);
          agents[i].visible = true;
        }else{
          agents[i].visible = false;
        }
      }

      // Counter increment
      loopCounter++;
      //console.log(loopCounter);
      if(loopCounter > loop * manager.stepSol){
        loopCounter = 0;
        
        // Reset unit state
        for(let i = 0; i < units; i++){
          agents[i].visible = false;
          agents[i].material = susMaterial;
        }
      }
    }

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

// archive

// // Data checking [Debug]
    // for(let i = 0; i < manager.m_unitList.length; i++){
    //   console.log(manager.m_drawData[i]);
    // }

    // let tempVec = latLngToVector3Relative({lat: placeList[0].x, lng: placeList[0].y}, mapOptions.center);
    // console.log(tempVec);

    //circles[2].position.set(latLngToVector3({lat: 13.767069888905883, lng: 100.51414033330558}));
    // for(let i = 0; i < 100; i++)
    // {
    //   scene.add(circles[i]);
    // }

    // circles[2].translateX(tempVec.x);
    // circles[2].translateY(tempVec.z);

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


    // circles[0].translateX(0.1);
    // //console.log(circles[0].position);
    // circles[1].translateY(0.2);
    // circles[1].material = susMaterial;

    // circles[2].material = testMat;