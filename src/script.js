import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();

/**
 * Sizes
 */
const sizes = {
  x: window.innerWidth,
  y: window.innerHeight,
};

/**
 * Canvas
 */
const canvas = document.querySelector("canvas.webgl");

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.x / sizes.y, 0.01, 100);
camera.position.z = 3;
scene.add(camera); // Ensure the camera is added to the scene

/**
 * Cube
 */
// const cubes = [];

// const cubesGroup = new THREE.Group();
// const cubeGeometry = new THREE.BoxGeometry();

// for (let i = 0; i < 100; i++) {
//   const cube = new THREE.Mesh(
//     cubeGeometry,
//     new THREE.MeshBasicMaterial({ wireframe: true, color: 0xff0000 })
//   );
//   cube.position.x = (Math.random() - 0.5) * 20;
//   cube.position.y = (Math.random() - 0.5) * 20;
//   cube.position.z = (Math.random() - 0.5) * 20;

//   cube.rotation.x = Math.sin(Math.random());
//   cube.rotation.y = Math.sin(Math.random());
//   cube.rotation.z = Math.sin(Math.random());

//   const randomScale = Math.random();
//   cube.scale.x = randomScale;
//   cube.scale.y = randomScale;
//   cube.scale.z = randomScale;

//   cubes.push(cube);
//   cubesGroup.add(cube);
// }
// scene.add(cubesGroup);

/**
 * Car parts
 */
const carParts = [];

const carPartsGroup = new THREE.Group();
gltfLoader.load("/models/phram_oil_filter/scene.gltf", (gltf) => {
  for (let i = 0; i < 50; i++) {
    const filterModel = gltf.scene.clone(true);

    filterModel.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
      }
    });

    filterModel.position.x = (Math.random() - 0.5) * 10;
    filterModel.position.y = (Math.random() - 0.5) * 10;
    filterModel.position.z = (Math.random() - 0.5) * 10;

    filterModel.rotation.x = Math.sin(Math.random());
    filterModel.rotation.y = Math.sin(Math.random());
    filterModel.rotation.z = Math.sin(Math.random());

    const randomScale = Math.random();
    filterModel.scale.x = randomScale;
    filterModel.scale.y = randomScale;
    filterModel.scale.z = randomScale;

    carParts.push(filterModel);
    carPartsGroup.add(filterModel);
  }
  scene.add(carPartsGroup);
});

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

/**
 * Orbit Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Mouse
 */
const mouseVector = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouseVector.y = -((e.clientY / window.innerHeight) * 2 - 1);
});

/**
 * Ray
 */
const raycaster = new THREE.Raycaster();

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.x, sizes.y);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.render(scene, camera);

/**
 * Resize Event Listener
 */
window.addEventListener("resize", () => {
  // Update sizes
  sizes.x = window.innerWidth;
  sizes.y = window.innerHeight;

  // Update camera
  camera.aspect = sizes.x / sizes.y;
  camera.updateProjectionMatrix(); // Ensure aspect ratio change is applied

  // Update renderer
  renderer.setSize(sizes.x, sizes.y);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});

/**
 * Clock
 */
const clock = new THREE.Clock();

/**
 * Animation Loop
 */
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Cast a ray
  raycaster.setFromCamera(mouseVector, camera);
  // const intersects = raycaster.intersectObjects(cubes);
  // console.log(intersects);

  const intersects = raycaster.intersectObjects(carParts);

  // cubes.map((cube) => cube.material.color.set("#ff0000"));
  // intersects.map((intersect) => intersect.object.material.color.set("#0000ff"));

  carParts.forEach((part) => {
    if (part.isMesh) {
      part.material.emissiveIntensity = 0;
    }
    part.traverse((child) => {
      if (child.isMesh) {
        child.material.emissiveIntensity = 0;
      }
    });
  });

  intersects.forEach((intersect) => {
    intersect.object.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color("#ffffff");
        child.material.emissiveIntensity = 0.5;
      }
    });
  });

  // Rotate cubes
  // if (!intersects.length) {
  //   cubesGroup.rotation.y += 0.001;
  // }

  if (!intersects.length) {
    carPartsGroup.rotation.y += 0.001;
  }

  // Update controls for smooth movement
  controls.update();

  // Render scene
  renderer.render(scene, camera);

  // Request the next frame
  window.requestAnimationFrame(tick);
};

tick();
