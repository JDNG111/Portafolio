// Pantalla de carga con Three.js y GSAP - FIGURA INFINITO MEJORADA
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
    
    // Función para crear una figura de infinito (lemniscata de Bernoulli)
    const createInfinitySymbol = () => {
        const points = [];
        const segments = 200;
        
        // Parámetros para la lemniscata
        const a = 10;
        
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * Math.PI * 2;
            
            // Ecuaciones paramétricas de la lemniscata
            const x = (a * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t));
            const y = (a * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t));
            
            points.push(new THREE.Vector3(x, y, 0));
        }
        
        // Crear curva suave
        const curve = new THREE.CatmullRomCurve3(points);
        curve.closed = true;
        
        const tubeGeometry = new THREE.TubeGeometry(curve, 200, 0.5, 8, true);
        const material = new THREE.MeshBasicMaterial({
            color: 0x27ae60,
            wireframe: false,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });
        
        const infinityMesh = new THREE.Mesh(tubeGeometry, material);
        
        // Crear un borde brillante
        const wireframe = new THREE.WireframeGeometry(tubeGeometry);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x2ecc71,
            linewidth: 2,
            transparent: true,
            opacity: 0.8
        });
        
        const infinityWireframe = new THREE.LineSegments(wireframe, lineMaterial);
        
        const group = new THREE.Group();
        group.add(infinityMesh);
        group.add(infinityWireframe);
        
        return group;
    };
    
    // Función alternativa: crear infinito con torus knots entrelazados
    const createDoubleInfinity = () => {
        const group = new THREE.Group();
        
        // Primer torus knot (infinito)
        const geometry1 = new THREE.TorusKnotGeometry(8, 2, 128, 16, 2, 3);
        const material1 = new THREE.MeshBasicMaterial({
            color: 0x27ae60,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        
        const knot1 = new THREE.Mesh(geometry1, material1);
        group.add(knot1);
        
        // Segundo torus knot rotado (forma el otro lado del infinito)
        const geometry2 = new THREE.TorusKnotGeometry(8, 2, 128, 16, 2, 3);
        const material2 = new THREE.MeshBasicMaterial({
            color: 0x2ecc71,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        
        const knot2 = new THREE.Mesh(geometry2, material2);
        knot2.rotation.x = Math.PI;
        knot2.rotation.y = Math.PI / 2;
        group.add(knot2);
        
        // Puntos brillantes que siguen la curva
        const pointsGeometry = new THREE.BufferGeometry();
        const pointsCount = 100;
        const positions = new Float32Array(pointsCount * 3);
        
        for (let i = 0; i < pointsCount; i++) {
            const t = (i / pointsCount) * Math.PI * 2;
            const r = 8 + 2 * Math.cos(3 * t);
            
            positions[i * 3] = r * Math.cos(t);
            positions[i * 3 + 1] = r * Math.sin(t) * Math.cos(t);
            positions[i * 3 + 2] = r * Math.sin(t);
        }
        
        pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const pointsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.3,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true
        });
        
        const points = new THREE.Points(pointsGeometry, pointsMaterial);
        group.add(points);
        
        return group;
    };
    
    // Crear partículas para el fondo
    const createStarfield = () => {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500;
        
        const posArray = new Float32Array(particlesCount * 3);
        const sizeArray = new Float32Array(particlesCount);
        
        for(let i = 0; i < particlesCount * 3; i += 3) {
            // Posiciones aleatorias en un espacio esférico
            const radius = 50 + Math.random() * 100;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
            posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            posArray[i + 2] = radius * Math.cos(phi);
            
            sizeArray[i / 3] = Math.random() * 0.5 + 0.1;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
        
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true,
            vertexColors: false
        });
        
        return new THREE.Points(particlesGeometry, particlesMaterial);
    };
    
    // Crear elementos
    const infinitySymbol = createDoubleInfinity();
    const starfield = createStarfield();
    
    scene.add(infinitySymbol);
    scene.add(starfield);
    
    camera.position.z = 35;
    
    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x27ae60, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Animación del loader con GSAP
    // Rotación principal del infinito
    gsap.to(infinitySymbol.rotation, {
        x: Math.PI * 4,
        y: Math.PI * 4,
        z: Math.PI * 2,
        duration: 25,
        repeat: -1,
        ease: 'none'
    });
    
    // Animación de escalado pulsante
    gsap.to(infinitySymbol.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
    
    // Animación de la luz puntual
    gsap.to(pointLight.position, {
        x: -10,
        y: -10,
        z: 10,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
    
    // Animación de opacidad
    infinitySymbol.children.forEach((child, index) => {
        if (child.material) {
            gsap.to(child.material, {
                opacity: index === 2 ? 0.9 : 0.4,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: index * 0.5
            });
        }
    });
    
    // Animar título y subtítulo con GSAP
    gsap.fromTo("#loader-title", 
        { 
            opacity: 0, 
            y: -50, 
            scale: 0.8,
            filter: "blur(10px)"
        }, 
        { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            filter: "blur(0px)",
            duration: 1.5, 
            ease: "back.out(1.7)" 
        }
    );
    
    gsap.fromTo("#loader-subtitle", 
        { 
            opacity: 0, 
            y: -30, 
            scale: 0.9,
            filter: "blur(5px)" 
        }, 
        { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            filter: "blur(0px)",
            duration: 1.5, 
            ease: "back.out(1.7)", 
            delay: 0.5 
        }
    );
    
    // Centrar la barra de carga
    const progressBar = document.querySelector('.loader-progress');
    if (progressBar) {
        progressBar.style.marginLeft = 'auto';
        progressBar.style.marginRight = 'auto';
    }
    
    // Animar la barra de progreso
    gsap.to(".loader-progress-bar", {
        width: "100%",
        duration: 6,
        ease: "power2.inOut",
        delay: 0.8,
        onUpdate: function() {
            // Efecto de brillo en la barra
            const progress = this.progress();
            const bar = document.querySelector('.loader-progress-bar');
            if (bar) {
                const intensity = Math.sin(progress * Math.PI) * 0.5 + 0.5;
                bar.style.boxShadow = `0 0 ${10 + intensity * 20}px rgba(39, 174, 96, ${0.3 + intensity * 0.4})`;
            }
        }
    });
    
    // Función de renderizado
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        
        // Animación suave de las estrellas
        starfield.rotation.x = elapsedTime * 0.01;
        starfield.rotation.y = elapsedTime * 0.005;
        
        // Movimiento sutil de la cámara
        camera.position.x = Math.sin(elapsedTime * 0.1) * 1;
        camera.position.y = Math.cos(elapsedTime * 0.07) * 1;
        
        // Efecto de pulsación en el infinito
        const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
        infinitySymbol.children[0].scale.set(scale, scale, scale);
        
        // Rotación adicional para las partículas dentro del infinito
        if (infinitySymbol.children[2]) {
            infinitySymbol.children[2].rotation.x = elapsedTime * 0.5;
            infinitySymbol.children[2].rotation.y = elapsedTime * 0.3;
        }
        
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
