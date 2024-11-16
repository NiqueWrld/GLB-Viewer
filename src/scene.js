import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createScene(container) {
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true 
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight);
  camera.position.set(0.2, 0.5, 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1f1e28);

  setupLights(scene);
  const controls = setupControls(camera, renderer.domElement);
  createPedestal(scene);

  return { scene, camera, renderer, controls };
}

function setupLights(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const spotlight = new THREE.SpotLight(0xffffff, 20, 8, 1);
  spotlight.penumbra = 0.5;
  spotlight.position.set(0, 4, 2);
  spotlight.castShadow = true;
  scene.add(spotlight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2);
  keyLight.position.set(1, 1, 2);
  keyLight.lookAt(new THREE.Vector3());
  scene.add(keyLight);
}

function setupControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 3;
  controls.maxDistance = 10;
  controls.minPolarAngle = 0.5;
  controls.maxPolarAngle = 1.5;
  controls.target = new THREE.Vector3(0, 0.75, 0);
  controls.update();
  return controls;
}

function createPedestal(scene) {
  const groundGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 64);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.castShadow = false;
  groundMesh.receiveShadow = true;
  groundMesh.position.y -= 0.05;
  scene.add(groundMesh);
}