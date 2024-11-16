import './style.css';
import { createScene } from './src/scene.js';
import { ModelLoader } from './src/modelLoader.js';

let currentModel = null;
let sceneData = null;

function init() {
  const container = document.getElementById('avatar-container');
  sceneData = createScene(container);
  container.appendChild(sceneData.renderer.domElement);

  const loader = new ModelLoader(container, (progress) => {
    document.getElementById('loading-progress').textContent = `Loading... ${progress}%`;
  });

  // Setup UI handlers
  document.getElementById('file-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      showLoading();
      try {
        const gltf = await loader.loadFromFile(file);
        updateScene(gltf.scene);
      } catch (error) {
        console.error('Error loading model:', error);
      }
      hideLoading();
    }
  });

  document.getElementById('load-url').addEventListener('click', async () => {
    const url = document.getElementById('url-input').value;
    if (url) {
      showLoading();
      try {
        const gltf = await loader.loadFromURL(url);
        updateScene(gltf.scene);
      } catch (error) {
        console.error('Error loading model:', error);
      }
      hideLoading();
    }
  });

  window.addEventListener('resize', onWindowResize);
  animate();
}

function updateScene(newModel) {
  if (currentModel) {
    sceneData.scene.remove(currentModel);
  }
  currentModel = newModel;
  sceneData.scene.add(currentModel);
  
  // Center and scale model
  const box = new THREE.Box3().setFromObject(currentModel);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2 / maxDim;
  currentModel.scale.setScalar(scale);
  currentModel.position.sub(center.multiplyScalar(scale));
  
  sceneData.camera.position.z = 5;
  sceneData.controls.reset();
}

function onWindowResize() {
  const container = document.getElementById('avatar-container');
  sceneData.camera.aspect = container.clientWidth / container.clientHeight;
  sceneData.camera.updateProjectionMatrix();
  sceneData.renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
  requestAnimationFrame(animate);
  sceneData.controls.update();
  sceneData.renderer.render(sceneData.scene, sceneData.camera);
}

function showLoading() {
  document.getElementById('loading-progress').style.display = 'block';
  document.querySelector('.controls').style.display = 'none';
  document.documentElement.requestFullscreen().catch((err) => {
    console.error(`Error attempting to enable full-screen mode: ${err.message}`);
  });
}

function hideLoading() {
  document.getElementById('loading-progress').style.display = 'none';
}

// Setup UI
document.querySelector('#app').innerHTML = `
  <div id="avatar-container">
    <div id="loading-progress" class="loading">Loading... 0%</div>
  </div>
  <div class="controls">
    <input type="file" accept=".glb" id="file-input">
    <input type="text" id="url-input" placeholder="Enter GLB URL">
    <button id="load-url">Load URL</button>
  </div>
`;

// Initialize the application
init();