"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const Globe: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const W = containerRef.current?.offsetWidth ?? 420;
        const H = containerRef.current?.offsetHeight ?? 420;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
        camera.position.z = 480;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);

        // Globe
        const globeRadius = 140;
        const geometry = new THREE.SphereGeometry(globeRadius, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            color: 0x0d1b35,
            transparent: true,
            opacity: 0.9,
            shininess: 5,
        });
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        // Glowing atmosphere ring
        const atmosphereGeom = new THREE.SphereGeometry(globeRadius * 1.05, 64, 64);
        const atmosphereMat = new THREE.MeshBasicMaterial({
            color: 0xd4590a,
            transparent: true,
            opacity: 0.05,
            side: THREE.BackSide,
        });
        const atmosphere = new THREE.Mesh(atmosphereGeom, atmosphereMat);
        scene.add(atmosphere);

        // Orbital Rings
        const createRing = (radius: number, color: number, dash: boolean = false, inclination: number) => {
            const segments = 128;
            const ringGeom = new THREE.BufferGeometry();
            const points = [];
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
            }
            ringGeom.setFromPoints(points);

            let ringMat;
            if (dash) {
                ringMat = new THREE.LineDashedMaterial({ color, dashSize: 10, gapSize: 5, opacity: 0.25, transparent: true });
            } else {
                ringMat = new THREE.LineBasicMaterial({ color, opacity: 0.2, transparent: true });
            }

            const ring = new THREE.Line(ringGeom, ringMat);
            if (dash) ring.computeLineDistances();
            ring.rotation.x = inclination;
            return ring;
        };

        const ring1 = createRing(globeRadius * 1.5, 0xd4590a, true, Math.PI / 4);
        const ring2 = createRing(globeRadius * 1.8, 0x0b6e72, false, -Math.PI / 6);
        const ring3 = createRing(globeRadius * 1.2, 0xb8922a, false, Math.PI / 10);
        scene.add(ring1, ring2, ring3);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xd4590a, 2, 1000);
        pointLight.position.set(200, 200, 200);
        scene.add(pointLight);

        const light2 = new THREE.PointLight(0x0b6e72, 1, 1000);
        light2.position.set(-200, -200, 100);
        scene.add(light2);

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);
            globe.rotation.y += 0.003;
            ring1.rotation.y += 0.001;
            ring2.rotation.y -= 0.0015;
            ring3.rotation.y += 0.002;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.offsetWidth;
            const h = containerRef.current.offsetHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", handleResize);

        const currentRef = containerRef.current;
        return () => {
            window.removeEventListener("resize", handleResize);
            renderer.dispose();
            if (currentRef) {
                currentRef.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={containerRef} className="w-full h-full relative z-10" />;
};

export default Globe;
