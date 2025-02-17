// Import Three.js and OrbitControls
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

// ✅ Debug: Check if script is running
console.log("🚀 Script is running...");

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene Setup
const scene = new THREE.Scene();

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// ✅ Fix File Paths (Ensure `image/` folder exists)
const textures = {
    stars: textureLoader.load("image/stars.jpg"),
    sun: textureLoader.load("image/sun.jpg"),
    mercury: textureLoader.load("image/mercury.jpg"),
    venus: textureLoader.load("image/venus.jpg"),
    earth: textureLoader.load("image/earth.jpg"),
    mars: textureLoader.load("image/mars.jpg"),
    jupiter: textureLoader.load("image/jupiter.jpg"),
    saturn: textureLoader.load("image/saturn.jpg"),
    uranus: textureLoader.load("image/uranus.jpg"),
    neptune: textureLoader.load("image/neptune.jpg"),
    pluto: textureLoader.load("image/pluto.jpg"),
    saturnRing: textureLoader.load("image/saturn_ring.png"),
    uranusRing: textureLoader.load("image/uranus_ring.png"),
};

// ✅ Fix Background
scene.background = textures.stars;

// Camera Setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 200);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Sun Setup
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(15, 50, 50),
    new THREE.MeshBasicMaterial({ map: textures.sun })
);
scene.add(sun);

// Lighting
const sunLight = new THREE.PointLight(0xffffff, 4, 300);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// ✅ Array to Store Orbital Paths
const orbits = [];

// Function to Create Planets with Optional Rings
const createPlanet = (size, texture, distance, ring = null) => {
    const planet = new THREE.Mesh(
        new THREE.SphereGeometry(size, 50, 50),
        new THREE.MeshStandardMaterial({ map: texture })
    );

    const planetGroup = new THREE.Object3D();
    planet.position.set(distance, 0, 0);
    planetGroup.add(planet);

    // ✅ Add Orbital Path
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitVertices = [];
    for (let i = 0; i <= 100; i++) {
        const angle = (i / 100) * Math.PI * 2;
        orbitVertices.push(Math.cos(angle) * distance, 0, Math.sin(angle) * distance);
    }
    orbitGeometry.setAttribute("position", new THREE.Float32BufferAttribute(orbitVertices, 3));

    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    scene.add(orbit);
    orbits.push(orbit);

    // ✅ Add Rings (if applicable)
    if (ring) {
        const ringMesh = new THREE.Mesh(
            new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32),
            new THREE.MeshBasicMaterial({ map: ring.texture, side: THREE.DoubleSide })
        );
        ringMesh.position.set(distance, 0, 0);
        ringMesh.rotation.x = -0.5 * Math.PI;
        planetGroup.add(ringMesh);
    }

    scene.add(planetGroup);
    return { planetGroup, planet };
};

// ✅ Planets Configuration
const planets = [
    { ...createPlanet(3.2, textures.mercury, 28), orbitSpeed: 0.004, rotationSpeed: 0.004 },
    { ...createPlanet(5.8, textures.venus, 44), orbitSpeed: 0.015, rotationSpeed: 0.002 },
    { ...createPlanet(6, textures.earth, 62), orbitSpeed: 0.01, rotationSpeed: 0.02 },
    { ...createPlanet(4, textures.mars, 78), orbitSpeed: 0.008, rotationSpeed: 0.018 },
    { ...createPlanet(12, textures.jupiter, 100), orbitSpeed: 0.002, rotationSpeed: 0.04 },
    { 
        ...createPlanet(10, textures.saturn, 138, { innerRadius: 10, outerRadius: 20, texture: textures.saturnRing }),
        orbitSpeed: 0.0009, rotationSpeed: 0.038 
    },
    { 
        ...createPlanet(7, textures.uranus, 176, { innerRadius: 7, outerRadius: 12, texture: textures.uranusRing }),
        orbitSpeed: 0.0004, rotationSpeed: 0.03 
    },
    { ...createPlanet(7, textures.neptune, 200), orbitSpeed: 0.0001, rotationSpeed: 0.032 },
    { ...createPlanet(2.8, textures.pluto, 216), orbitSpeed: 0.0007, rotationSpeed: 0.008 },
];

// Create a modal for planet details
const modal = document.createElement("div");
modal.style.position = "fixed";
modal.style.top = "50%";
modal.style.left = "50%";
modal.style.transform = "translate(-50%, -50%)";
modal.style.background = "rgba(0, 0, 0, 0.9)";
modal.style.color = "#fff";
modal.style.padding = "33px";
modal.style.borderRadius = "10px";
modal.style.width = "650px";
modal.style.textAlign = "center";
modal.style.display = "none";
modal.style.zIndex = "1000";
modal.style.fontSize = "35px";
document.body.appendChild(modal);

// Close button
const closeButton = document.createElement("button");
closeButton.innerText = "Close";
closeButton.style.marginTop = "10px";
closeButton.style.padding = "8px 16px";
closeButton.style.background = "#ff4444";
closeButton.style.color = "#fff";
closeButton.style.border = "none";
closeButton.style.borderRadius = "5px";
closeButton.style.cursor = "pointer";
modal.appendChild(closeButton);

// Planet descriptions
const planetInfo = {
    Mercury: "Mercury is the smallest planet and closest to the Sun.",
    Venus: "Venus has a thick atmosphere, making it the hottest planet.",
    Earth: "Earth is the only planet known to support life.",
    Mars: "Mars is known as the Red Planet and may have had liquid water.",
    Jupiter: "Jupiter is the largest planet with a Great Red Spot storm.",
    Saturn: "Saturn is famous for its beautiful ring system.",
    Uranus: "Uranus rotates on its side and has a bluish-green color.",
    Neptune: "Neptune is a cold, windy planet with deep blue color.",
    Pluto: "Pluto, a dwarf planet, has an icy and rocky surface."
};

// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Detect mouse movement
window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Detect clicks on planets
window.addEventListener("click", (event) => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p => p.planet));

    if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        const planetName = Object.keys(planetInfo)[planets.findIndex(p => p.planet === clickedPlanet)];

        if (planetName) {
            modal.innerHTML = `<h2>${planetName}</h2><p>${planetInfo[planetName]}</p>`;
            modal.appendChild(closeButton);
            modal.style.display = "block";
        }
    }
});

// Close modal when clicking the close button
closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});


// ✅ GUI Controls (Larger Size & Orbit Visibility)
const gui = new dat.GUI({ width: 350 });
const settings = { 
    realView: true, 
    speed: 1, 
    showOrbits: true 
};

gui.add(settings, "realView").onChange((value) => {
    ambientLight.intensity = value ? 0.2 : 0.5;
});
gui.add(settings, "speed", 0, 20);
gui.add(settings, "showOrbits").onChange((value) => {
    orbits.forEach(orbit => orbit.visible = value);
});

// ✅ Animation Loop
function animate() {
    requestAnimationFrame(animate);

    sun.rotateY(settings.speed * 0.004);

    planets.forEach(({ planetGroup, planet, orbitSpeed, rotationSpeed }) => {
        planetGroup.rotateY(settings.speed * orbitSpeed);
        planet.rotateY(settings.speed * rotationSpeed);
    });

    controls.update();
    renderer.render(scene, camera);
}
animate();

// ✅ Responsive Resize Fix
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
