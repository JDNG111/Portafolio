// Pantalla de carga con Three.js y GSAP - FIGURA INFINITO
document.addEventListener('DOMContentLoaded', function() {
    // Crear escena Three.js para el loader
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        preserveDrawingBuffer: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.getElementById('loader').appendChild(renderer.domElement);
    
    // Crear figura de infinito (lemniscata)
    const createInfinityShape = () => {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, 5, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-5, 5, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, -5, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-5, -5, 0),
            new THREE.Vector3(0, 0, 0)
        ]);
        
        const points = curve.getPoints(100);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const material = new THREE.LineBasicMaterial({ 
            color: 0x3498db,
            linewidth: 3,
            transparent: true,
            opacity: 0.9
        });
        
        const infinityLine = new THREE.Line(geometry, material);
        return infinityLine;
    };
    
    // Crear figura de infinito 3D
    const createInfinity3D = () => {
        // Crear torus knots para simular infinito
        const geometry1 = new THREE.TorusKnotGeometry(8, 2, 64, 8, 2, 3);
        const geometry2 = new THREE.TorusKnotGeometry(8, 2, 64, 8, 2, 3);
        
        const material1 = new THREE.MeshBasicMaterial({ 
            color: 0x3498db,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        
        const material2 = new THREE.MeshBasicMaterial({ 
            color: 0xe74c3c,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        
        const infinity1 = new THREE.Mesh(geometry1, material1);
        const infinity2 = new THREE.Mesh(geometry2, material2);
        
        infinity2.rotation.x = Math.PI / 2;
        infinity2.rotation.y = Math.PI / 4;
        
        const group = new THREE.Group();
        group.add(infinity1);
        group.add(infinity2);
        
        return group;
    };
    
    // Crear partículas para el fondo
    const createParticles = () => {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i += 3) {
            // Posiciones aleatorias en un espacio esférico
            const radius = 30;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
            posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            posArray[i + 2] = radius * Math.cos(phi);
            
            // Colores aleatorios entre azul y morado
            colorArray[i] = Math.random() * 0.5 + 0.2;     // R
            colorArray[i + 1] = Math.random() * 0.3 + 0.3; // G
            colorArray[i + 2] = Math.random() * 0.8 + 0.2; // B
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        return new THREE.Points(particlesGeometry, particlesMaterial);
    };
    
    // Crear elementos
    const infinityShape = createInfinity3D();
    const particles = createParticles();
    
    scene.add(infinityShape);
    scene.add(particles);
    
    camera.position.z = 30;
    
    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    // Animación del loader con GSAP
    gsap.to(infinityShape.rotation, {
        x: Math.PI * 4,
        y: Math.PI * 4,
        z: Math.PI * 4,
        duration: 20,
        repeat: -1,
        ease: 'power1.inOut'
    });
    
    // Animación de escalado pulsante
    gsap.to(infinityShape.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
    
    // Animación de partículas
    gsap.to(particles.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: 30,
        repeat: -1,
        ease: 'none'
    });
    
    // Animar título y subtítulo con GSAP
    gsap.fromTo("#loader-title", 
        { opacity: 0, y: -50, scale: 0.8 }, 
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "back.out(1.7)" }
    );
    
    gsap.fromTo("#loader-subtitle", 
        { opacity: 0, y: -30, scale: 0.9 }, 
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "back.out(1.7)", delay: 0.5 }
    );
    
    // Animar la barra de progreso
    gsap.to(".loader-progress-bar", {
        width: "100%",
        duration: 6,
        ease: "power2.inOut",
        delay: 0.8
    });
    
    // Función de renderizado
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        
        // Animación suave de las partículas
        particles.rotation.x = elapsedTime * 0.05;
        particles.rotation.y = elapsedTime * 0.03;
        
        // Efecto de movimiento sutil en la cámara
        camera.position.x = Math.sin(elapsedTime * 0.1) * 2;
        camera.position.y = Math.cos(elapsedTime * 0.1) * 2;
        
        // Efecto de brillo en el infinito
        infinityShape.children.forEach((child, index) => {
            child.material.opacity = 0.7 + Math.sin(elapsedTime * 2 + index) * 0.3;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Redimensionar
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Ocultar loader después de 7 segundos
    setTimeout(function() {
        gsap.to("#loader", {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: function() {
                document.getElementById('loader').style.display = 'none';
                // Iniciar animaciones del portafolio
                if (typeof initPortfolioAnimations === 'function') {
                    initPortfolioAnimations();
                }
            }
        });
    }, 7000);
});
