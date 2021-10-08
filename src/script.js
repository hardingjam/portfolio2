import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { Interaction } from "three.interaction-fixed";

// Loading

const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load("/textures/NormalMap.png");

let scrollPercent = 0;

document.body.onscroll = () => {
    //calculate the current scroll progress as a percentage
    scrollPercent =
        ((document.documentElement.scrollTop || document.body.scrollTop) /
            ((document.documentElement.scrollHeight ||
                document.body.scrollHeight) -
                document.documentElement.clientHeight)) *
        100;
    document.getElementById("scrollProgress").innerText =
        "Scroll Progress : " + scrollPercent.toFixed(2);
};

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

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

// Materials

// Mesh

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 6);

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

const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1);

light2.addColor(light2Color, "color").onChange(() => {
    pointLight2.color.set(light2Color.color);
});

scene.add(pointLightHelper);
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

const pointLightHelper2 = new THREE.PointLightHelper(pointLight3, 1);
scene.add(pointLightHelper2);

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

const mouse = new THREE.Vector2();

window.addEventListener;

function onMouseWheel(e) {
    y = e.deltaY * 0.003;
    // get the Y position for each movement of the scrollwheel
}

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
    const elapsedTime = clock.getElapsedTime();

    // Raycaster

    raycaster.setFromCamera(mouse, camera);

    // Scroll

    pos += y;
    y *= 0.8;
    camera.position.y = pos;

    // Render

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};
window.scrollTo({ top: 0, behavior: "smooth" });
tick();
