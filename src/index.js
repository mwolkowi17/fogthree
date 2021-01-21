import _ from 'lodash';
import * as THREE from 'three';

import { light } from './lightbase';
import { light2 } from './lightdirect';
import { camera } from './camerabase';
import { loadManager, objLoader, mtlLoader } from './loadingModule';
import { tytul, tytulobj } from './loadingModule';
import { controls } from './controlsModule';
import { buttonChange, buttonClick } from './button';

'use strict';

/* global THREE */
buttonChange.addEventListener('mousedown', onMouseDown);

function onMouseDown() {
  buttonClick();
  main();


}

let rotateflag = 0;

function main() {
  const canvas = document.querySelector('#c');
  const heightRatio = 1;
  canvas.height = canvas.width * heightRatio;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(0x000000, 0);

  controls.update(true);

  const scene = new THREE.Scene()
  {
    const color = 0xFFFFFF;  // white
    const near =24;
    const far = 40;
    scene.fog = new THREE.Fog(color, near, far);
  };



  camera.add(light);
  scene.add(camera);

  scene.add(light2);
  scene.add(light2.target);

  const loadingElem = document.querySelector('#loading');
  const progressBarElem = loadingElem.querySelector('.spinner-border text-primary');

  mtlLoader.load(tytul, (materials) => {
        materials.preload()
    objLoader.setMaterials(materials);
    objLoader.load(tytulobj, (object) => {

      scene.add(object);
    });
  });

  loadManager.onLoad = () => {
    loadingElem.style.display = 'none';
  }
  loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
    const progress = itemsLoaded / itemsTotal;
    //progressBarElem.style.transform = `scaleX(${progress})`;
  };

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function animate() {

    requestAnimationFrame(animate);

    // required if controls.enableDamping or controls.autoRotate are set to true


    controls.update();

    rotateflag++;

    renderer.render(scene, camera);

  }

  function render() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.sortObjects = false;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
  if (rotateflag === 0) {
    animate();
    console.log("animate");
  }
}

main();
