import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ModelLoader {
  constructor(container, onProgress) {
    this.container = container;
    this.onProgress = onProgress;
    this.loader = new GLTFLoader();
  }

  loadFromURL(url) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          this.setupModel(gltf);
          resolve(gltf);
        },
        (xhr) => {
          const percentComplete = Math.round((xhr.loaded / xhr.total) * 100);
          if (this.onProgress) {
            this.onProgress(percentComplete);
          }
        },
        reject
      );
    });
  }

  loadFromFile(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      this.loadFromURL(url)
        .then(resolve)
        .catch(reject)
        .finally(() => URL.revokeObjectURL(url));
    });
  }

  setupModel(gltf) {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return model;
  }
}