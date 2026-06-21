/**
 * scene.js — Three.js Neural Network Background
 *
 * Creates a floating 3D neural network of nodes + edges that:
 *  - Slowly rotates on its Y and X axes
 *  - Responds to mouse movement with subtle camera parallax
 *  - Pulses node opacity to simulate signal firing
 *
 * To modify the look:
 *  - Change NODE_COUNT for density
 *  - Change SPREAD to adjust how spread out the network is
 *  - Change CONNECT_DIST to control edge density
 *  - Tweak colors in init() / createNetwork()
 */

import * as THREE from 'three';

const NODE_COUNT   = 110;
const SPREAD       = 22;
const CONNECT_DIST = 7.5;
const ROTATION_SPEED = 0.0025;

export class NeuralScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.mouse  = { x: 0, y: 0 };
    this.time   = 0;

    this._init();
    this._createNetwork();
    this._bindEvents();
    this._animate();
  }

  _init() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0); // transparent bg

    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      300
    );
    this.camera.position.z = 36;

    // Group wraps all network objects so rotation is applied together
    this.group = new THREE.Group();
    this.scene.add(this.group);
  }

  _createNetwork() {
    // ── 1. Generate random 3D positions ──────────────────────────────────
    const positions3d = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      positions3d.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * SPREAD * 2,
          (Math.random() - 0.5) * SPREAD,
          (Math.random() - 0.5) * SPREAD
        )
      );
    }

    // ── 2. Points (nodes) ─────────────────────────────────────────────────
    const pArr = new Float32Array(NODE_COUNT * 3);
    positions3d.forEach((v, i) => {
      pArr[i * 3]     = v.x;
      pArr[i * 3 + 1] = v.y;
      pArr[i * 3 + 2] = v.z;
    });
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0x00E5FF,
      size: 0.22,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    this.points = new THREE.Points(pGeo, pMat);
    this.group.add(this.points);

    // ── 3. Lines (edges) ──────────────────────────────────────────────────
    const linePositions = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (positions3d[i].distanceTo(positions3d[j]) < CONNECT_DIST) {
          linePositions.push(
            positions3d[i].x, positions3d[i].y, positions3d[i].z,
            positions3d[j].x, positions3d[j].y, positions3d[j].z
          );
        }
      }
    }

    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(linePositions), 3)
    );

    const lMat = new THREE.LineBasicMaterial({
      color: 0x00E5FF,
      transparent: true,
      opacity: 0.10,
    });

    this.lines = new THREE.LineSegments(lGeo, lMat);
    this.group.add(this.lines);
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    this.time += ROTATION_SPEED;

    // Slow orbital rotation
    this.group.rotation.y  =  this.time * 0.6;
    this.group.rotation.x  =  Math.sin(this.time * 0.3) * 0.09;

    // Mouse parallax — camera drifts toward cursor
    this.camera.position.x +=
      (this.mouse.x * 5 - this.camera.position.x) * 0.028;
    this.camera.position.y +=
      (-this.mouse.y * 3.5 - this.camera.position.y) * 0.028;
    this.camera.lookAt(0, 0, 0);

    // Breathing opacity on nodes
    this.points.material.opacity =
      0.60 + Math.sin(this.time * 4.5) * 0.22;

    this.renderer.render(this.scene, this.camera);
  }

  _bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
      this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}
