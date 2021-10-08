import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { Interaction } from "three.interaction-fixed";
import gsap from "gsap";

// Loading

const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load("/textures/NormalMap.png");

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Geometry

const geometry = new THREE.PlaneBufferGeometry(1.2, 1.2);
//looping inside objects
for (let i = 0; i < 5; i++) {
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(`/images/${i}.png`),
    });
    const img = new THREE.Mesh(geometry, material);
    img.position.set(Math.random(0.3), i * -1.8);
    scene.add(img);
}

let objs = [];

scene.traverse((object) => {
    if (object.isMesh) {
        console.log(object);
        objs.push(object);
    }
});

// Particles

const particlesGeometry = new THREE.BufferGeometry();
// general shape constructor
const particlesCount = 10000;
// the number of particles
const posArr = new Float32Array(particlesCount * 3);
// provide us with XYZ co-ordinates for each particle.
// xyz xyz xyz xyz

for (let i = 0; i < particlesCount * 3; i++) {
    // spreading out the particles over a given area
    posArr[i] = (Math.random() - 0.5) * 30;
}

particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArr, 3)
    // assigning the random xyz attributes to each particles
);

// Materials

const material = new THREE.PointsMaterial({ size: 0.005 });

// Mesh

const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);
particlesMesh.position.set(0, -8, 0);
// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

// LIGHT 2

const pointLight2 = new THREE.PointLight(0xffffff, 2);

pointLight2.position.set(1.43, 0.87, 0);
pointLight2.intensity = 2;

scene.add(pointLight2);

const light2 = gui.addFolder("Light 2");

const light2Color = {
    color: 0xff0000,
};

light2.add(pointLight2.position, "x").min(-6).max(6).step(0.01);
light2.add(pointLight2.position, "y").min(-3).max(3).step(0.01);
light2.add(pointLight2.position, "z").min(-3).max(3).step(0.01);
light2.add(pointLight2, "intensity").min(1).max(10).step(0.01);

// const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1);

light2.addColor(light2Color, "color").onChange(() => {
    pointLight2.color.set(light2Color.color);
});

// scene.add(pointLightHelper);
// LIGHT 3

const pointLight3 = new THREE.PointLight(0xffffff, 2);

pointLight3.position.set(0.1, 0.27, 1);
pointLight3.intensity = 1;

scene.add(pointLight3);

const light3 = gui.addFolder("Light 3");

light3.add(pointLight3.position, "x").min(-6).max(6).step(0.01);
light3.add(pointLight3.position, "y").min(-3).max(3).step(0.01);
light3.add(pointLight3.position, "z").min(-3).max(3).step(0.01);
light3.add(pointLight3, "intensity").min(1).max(10).step(0.01);

const light3Color = {
    color: 0xff0000,
};

// this listener changes the color when the GUI slider moves

light3.addColor(light3Color, "color").onChange(() => {
    pointLight3.color.set(light3Color.color);
});

// const pointLightHelper2 = new THREE.PointLightHelper(pointLight3, 1);
// scene.add(pointLightHelper2);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

gui.add(camera.position, "y").min(-5).max(5);

/**
 * Mouse
 */

window.addEventListener("wheel", onMouseWheel);

let y = 0;
let pos = 0;

function onMouseWheel(e) {
    y = e.deltaY * 0.003;
    particlesMesh.rotation.y += 0.0005;
}

const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
    // This comes from Bruno Simon's course
    // It will give us a value from -1 to 1
    mouse.x = (e.clientX / sizes.width) * 2 - 1;
    mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

// Controls;
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const raycaster = new THREE.Raycaster();

/**
 * Interactions
 */

// CLOCK

const clock = new THREE.Clock();

const tick = () => {
    // Update Orbital Controls
    // controls.update()
    // const elapsedTime = clock.getElapsedTime();
    particlesMesh.rotation.y += 0.0005;
    // Raycaster

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objs);

    for (const intersect of intersects) {
        // when mouseOver

        let obj = intersect.object;
        gsap.to(obj.scale, { x: 1.2, y: 1.2 });
        gsap.to(obj.rotation, { y: -0.2 });
        gsap.to(obj.position, { z: 0.2 });
    }

    for (const object of objs) {
        // mouseOut

        if (!intersects.find((intersect) => intersect.object == object)) {
            gsap.to(object.scale, { x: 1, y: 1 });
            gsap.to(object.rotation, { y: 0 });
            gsap.to(object.position, { z: 0 });
        }
    }

    // Scroll
    pos += y;
    y *= 0.9;
    camera.position.y = -pos;

    // Render

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
