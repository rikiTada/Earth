import "./style.css";
import * as THREE from "./node_modules/three";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls";

let scene, camera, renderer, pointLight, controls;

window.addEventListener("load", init);

function init() {
  // シーンを作成
  scene = new THREE.Scene();

  // カメラを作成 => PerspectiveCamera(視野角、アスペクト比、開始距離、終了距離)
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // カメラをZ軸に移動
  camera.position.set(0, 0, 500);

  // レンダラーを追加(ブラウザに表示するための変換器)
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  renderer.render(scene, camera);

  // テクスチャを追加
  let textures = new THREE.TextureLoader().load("/earth.jpg");

  // ジオメトリを作成
  let ballGeometry = new THREE.SphereGeometry(100, 64, 32);
  // マテリアルを作成
  let ballMaterial = new THREE.MeshPhysicalMaterial({
    map: textures,
    color: 0xffffff,
    roughness: 0.4,
    metalness: 0.5,
  });

  // メッシュ化
  let ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ballMesh);

  // 平行光源を追加;
  let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  //ポイント光源を追加
  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(-200, -200, -200);
  scene.add(pointLight);

  // ポイント光源の特定
  let pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  // マウス操作
  controls = new OrbitControls(camera, renderer.domElement);

  window.addEventListener("resize", onWindowResize);
  animate();
}

// ブラウザのリサイズ対応
function onWindowResize() {
  // レンダラーのサイズを随時更新
  renderer.setSize(window.innerWidth, window.innerHeight);

  // カメラのアスペクト比を修正
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// 球の周りをポイント光源が巡回
function animate() {
  const time = Date.now();
  const x = 200 * Math.sin(time / 500);
  const y = 200 * Math.sin(time / 1000);
  const z = 200 * Math.cos(time / 500);

  pointLight.position.set(x, y, z);
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}
