import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CyberBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 25;
    camera.position.y = 5;
    camera.rotation.x = -0.25;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    currentMount.appendChild(renderer.domElement);

    // Floor Grid
    const grid = new THREE.GridHelper(200, 60, 0x00ffff, 0x004444);
    grid.position.y = -8;
    scene.add(grid);

    // Binary Streams (represented as glowing lines)
    const streams = [];
    for (let i = 0; i < 250; i++) {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];

      const x = (Math.random() - 0.5) * 80;
      const y = Math.random() * 80;
      const z = (Math.random() - 0.5) * 50;

      vertices.push(x, y, z);
      vertices.push(x, y - 12, z);

      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
      );

      const material = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8
      });

      const line = new THREE.Line(geometry, material);
      line.speed = Math.random() * 0.15 + 0.05;

      scene.add(line);
      streams.push(line);
    }

    // Glow Particles
    const particles = [];
    for (let i = 0; i < 300; i++) {
      const geo = new THREE.SphereGeometry(0.08, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ color: 0x66ffff });
      const p = new THREE.Mesh(geo, mat);

      p.position.x = (Math.random() - 0.5) * 100;
      p.position.y = Math.random() * 50;
      p.position.z = (Math.random() - 0.5) * 40;
      p.speed = Math.random() * 0.05;

      scene.add(p);
      particles.push(p);
    }

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Falling streams
      streams.forEach((s) => {
        s.position.y -= s.speed;
        if (s.position.y < -20) {
          s.position.y = 30;
        }
      });

      // Floating lights
      particles.forEach((p) => {
        p.position.y -= p.speed;
        if (p.position.y < -10) {
          p.position.y = 30;
        }
      });

      // Slow camera movement
      camera.position.z += Math.sin(Date.now() * 0.0003) * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if(currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default CyberBackground;
