// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    const canvas = document.getElementById('ornexperience');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 20);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- 1. Background Fluid Shader ---
    const bgGeometry = new THREE.PlaneGeometry(100, 60);
    
    // Get shaders from script tags
    const vertexShaderEl = document.getElementById('vertexShader');
    const fragmentShaderEl = document.getElementById('fragmentShader');
    
    if (!vertexShaderEl || !fragmentShaderEl) {
        console.error('Shader scripts not found!');
        return;
    }
    
    const bgMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShaderEl.textContent,
        fragmentShader: fragmentShaderEl.textContent,
        uniforms: {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uMouse: { value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2) }
        },
        depthWrite: false
    });

    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgMesh.position.z = -30;
    scene.add(bgMesh);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Key light from top-front
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(0, 10, 15);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Rim lights for gold highlights
    const rimLight1 = new THREE.PointLight(0xFFD700, 2, 30);
    rimLight1.position.set(-10, 5, -5);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(0xFFD700, 2, 30);
    rimLight2.position.set(10, 5, -5);
    scene.add(rimLight2);

    // Back light for depth
    const backLight = new THREE.PointLight(0x00A693, 1.5, 30);
    backLight.position.set(0, -5, -20);
    scene.add(backLight);

    // --- Mouse & Animation Logic ---
    document.addEventListener('mousemove', (event) => {
        // Update shader mouse position
        bgMaterial.uniforms.uMouse.value.x = event.clientX;
        bgMaterial.uniforms.uMouse.value.y = window.innerHeight - event.clientY;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        bgMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        // Update shader time
        bgMaterial.uniforms.uTime.value = elapsedTime;

        renderer.render(scene, camera);
    }

    animate();
});
