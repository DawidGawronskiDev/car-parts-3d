import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

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
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(cube);

/**
 * Orbit Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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

  // Update cube rotation
  cube.rotation.y = elapsedTime * Math.PI * 0.25;

  // Update controls for smooth movement
  controls.update();

  // Render scene
  renderer.render(scene, camera);

  // Request the next frame
  window.requestAnimationFrame(tick);
};

tick();
