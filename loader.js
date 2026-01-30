// Pantalla de carga con Three.js y GSAP - DODECAEDRO ANIMADO
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
    
    // Crear dodecaedro geométrico
    const createDodecahedron = () => {
        const geometry = new THREE.DodecahedronGeometry(10, 0);
        
        // Material para las caras
        const faceMaterial = new THREE.MeshPhongMaterial({
            color: 0x4CAF50,
            transparent: true,
            opacity: 0.7,
            shininess: 100,
            specular: 0x222222
        });
        
        // Material para las aristas
        const edgeMaterial = new THREE.LineBasicMaterial({
            color: 0x66BB6A,
            linewidth: 2,
            transparent: true,
            opacity: 0.9
        });
        
        // Crear mesh para las caras
        const dodecahedron = new THREE.Mesh(geometry, faceMaterial);
        
        // Crear wireframe para las aristas
        const edges = new THREE.EdgesGeometry(geometry);
        const wireframe = new THREE.LineSegments(edges, edgeMaterial);
        
        const group = new THREE.Group();
        group.add(dodecahedron);
        group.add(wireframe);
        
        return group;
    };
    
    // Crear esferas en los vértices
    const createVertexSpheres = (dodecahedron) => {
        const spheresGroup = new THREE.Group();
        const geometry = new THREE.SphereGeometry(0.8, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.9
        });
        
        // Obtener los vértices del dodecaedro
        const vertices = dodecahedron.geometry.attributes.position.array;
        
        for (let i = 0; i < vertices.length; i += 3) {
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(vertices[i], vertices[i + 1], vertices[i + 2]);
            sphere.position.multiplyScalar(1.05); // Colocar las esferas ligeramente fuera
            spheresGroup.add(sphere);
        }
        
        return spheresGroup;
    };
    
    // Crear partículas flotantes
    const createFloatingParticles = () => {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);
        const sizeArray = new Float32Array(particlesCount);
        
        for(let i = 0; i < particlesCount * 3; i += 3) {
            // Posiciones en un espacio esférico
            const radius = 20 + Math.random() * 30;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
            posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            posArray[i + 2] = radius * Math.cos(phi);
            
            // Colores verdes variados
            colorArray[i] = 0.3 + Math.random() * 0.2;     // R
            colorArray[i + 1] = 0.6 + Math.random() * 0.3; // G
            colorArray[i + 2] = 0.3 + Math.random() * 0.2; // B
            
            sizeArray[i / 3] = Math.random() * 0.4 + 0.1;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true
        });
        
        return new THREE.Points(particlesGeometry, particlesMaterial);
    };
    
    // Crear elementos
    const dodecahedronGroup = createDodecahedron();
    const dodecahedronMesh = dodecahedronGroup.children[0];
    const vertexSpheres = createVertexSpheres(dodecahedronMesh);
    const floatingParticles = createFloatingParticles();
    
    scene.add(dodecahedronGroup);
    scene.add(vertexSpheres);
    scene.add(floatingParticles);
    
    camera.position.z = 35;
    
    // Sistema de luces mejorado
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(10, 10, 10);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0x4CAF50, 0.5);
    directionalLight2.position.set(-10, -5, -10);
    scene.add(directionalLight2);
    
    const pointLight = new THREE.PointLight(0x66BB6A, 1.5, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Animaciones con GSAP
    // Rotación principal del dodecaedro
    gsap.to(dodecahedronGroup.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        z: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: 'none'
    });
    
    // Rotación opuesta para las esferas de los vértices
    gsap.to(vertexSpheres.rotation, {
        x: -Math.PI * 2,
        y: -Math.PI * 2,
        duration: 25,
        repeat: -1,
        ease: 'none'
    });
    
    // Animación de escalado pulsante
    gsap.to(dodecahedronGroup.scale, {
        x: 1.15,
        y: 1.15,
        z: 1.15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
    
    // Animación de las esferas (pulsación)
    vertexSpheres.children.forEach((sphere, index) => {
        gsap.to(sphere.scale, {
            x: 1.3,
            y: 1.3,
            z: 1.3,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.05
        });
        
        gsap.to(sphere.material, {
            opacity: 0.5,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.05
        });
    });
    
    // Animación de la luz puntual
    gsap.to(pointLight.position, {
        x: 15,
        y: -10,
        z: 15,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
    
    // Animación de opacidad del dodecaedro
    gsap.to(dodecahedronGroup.children[0].material, {
        opacity: 0.4,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
    
    gsap.to(dodecahedronGroup.children[1].material, {
        opacity: 0.7,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1
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
    
    // Animar la barra de progreso (reducida a 6 segundos)
    gsap.to(".loader-progress-bar", {
        width: "100%",
        duration: 6, // Reducido de 7 a 6 segundos
        ease: "power2.inOut",
        delay: 0.8,
        onUpdate: function() {
            // Efecto de brillo en la barra
            const progress = this.progress();
            const bar = document.querySelector('.loader-progress-bar');
            if (bar) {
                const intensity = Math.sin(progress * Math.PI) * 0.5 + 0.5;
                bar.style.boxShadow = `0 0 ${10 + intensity * 20}px rgba(76, 175, 80, ${0.3 + intensity * 0.4})`;
            }
        }
    });
    
    // Función de renderizado
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        
        // Animación suave de las partículas flotantes
        floatingParticles.rotation.x = elapsedTime * 0.02;
        floatingParticles.rotation.y = elapsedTime * 0.015;
        
        // Movimiento orbital de las partículas
        floatingParticles.position.x = Math.sin(elapsedTime * 0.1) * 0.5;
        floatingParticles.position.y = Math.cos(elapsedTime * 0.07) * 0.5;
        
        // Efecto de pulsación en las partículas
        floatingParticles.children.forEach((particle, index) => {
            if (particle.material) {
                particle.material.opacity = 0.5 + Math.sin(elapsedTime * 2 + index) * 0.3;
            }
        });
        
        // Movimiento sutil de la cámara
        camera.position.x = Math.sin(elapsedTime * 0.05) * 2;
        camera.position.y = Math.cos(elapsedTime * 0.03) * 2;
        
        // Efecto de rotación adicional para las esferas
        vertexSpheres.children.forEach((sphere, index) => {
            sphere.rotation.x = elapsedTime * 0.5 + index * 0.1;
            sphere.rotation.y = elapsedTime * 0.3 + index * 0.1;
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
    
    // Ocultar loader después de 6 segundos (reducido de 7)
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
    }, 6000); // Reducido de 7000ms a 6000ms
});
