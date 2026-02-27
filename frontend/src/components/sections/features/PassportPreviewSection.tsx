"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

const Gauge = ({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div ref={ref} className="flex flex-col items-center gap-3">
            <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    <circle
                        cx="32" cy="32" r="28"
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="4"
                    />
                    <motion.circle
                        cx="32" cy="32" r="28"
                        fill="none"
                        stroke={color}
                        strokeWidth="4"
                        strokeDasharray="176"
                        initial={{ strokeDashoffset: 176 }}
                        animate={isInView ? { strokeDashoffset: 176 - (176 * value) / 100 } : {}}
                        transition={{ duration: 1.5, delay, ease: [0.23, 1, 0.32, 1] }}
                    />
                </svg>
                <span className="absolute text-[10px] font-mono text-text-primary">{value}%</span>
            </div>
            <span className="data-label text-[8px] text-text-secondary uppercase tracking-widest">{label}</span>
        </div>
    );
};

const PassportObject: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        containerRef.current.appendChild(renderer.domElement);

        // Passport Booklet Group
        const passport = new THREE.Group();

        // Front Cover
        const coverGeom = new THREE.BoxGeometry(2, 2.8, 0.05);
        const coverMat = new THREE.MeshPhongMaterial({ color: 0x0a1528, shininess: 10 });
        const cover = new THREE.Mesh(coverGeom, coverMat);
        cover.castShadow = true;
        passport.add(cover);

        // Gold Embossing (simplified with a Plane)
        const goldGeom = new THREE.PlaneGeometry(1.2, 1.8);
        const goldMat = new THREE.MeshBasicMaterial({
            color: 0xb8922a,
            transparent: true,
            opacity: 0.6
        });
        const goldLogo = new THREE.Mesh(goldGeom, goldMat);
        goldLogo.position.z = 0.026;
        cover.add(goldLogo);

        scene.add(passport);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const mainLight = new THREE.PointLight(0xd4590a, 2.5, 100);
        mainLight.position.set(2, 2, 4);
        mainLight.castShadow = true;
        scene.add(mainLight);

        const animate = () => {
            requestAnimationFrame(animate);
            passport.rotation.y += 0.005;
            passport.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
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

    return <div ref={containerRef} className="w-full h-full" />;
};

const PassportPreviewSection: React.FC = () => {
    return (
        <section className="relative w-full py-32 bg-[#0D1520] overflow-hidden border-t border-white/06">
            <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                {/* Left Side: Text and Gauges */}
                <div className="lg:col-span-12 flex flex-col items-start z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <span className="font-mono text-[11px] text-text-secondary tracking-[2px] mb-4 block">NOT JUST A PLAN.</span>
                        <h2 className="text-5xl lg:text-[64px] font-display font-black leading-[0.9] text-text-primary max-w-[700px]">
                            A reasoned, scored, <br />
                            <span className="italic text-saffron">guaranteed</span> travel decision.
                        </h2>
                    </motion.div>

                    <div className="flex flex-wrap gap-12 lg:gap-20 mb-16">
                        <Gauge label="Weather" value={87} color="#12A8AE" delay={0.1} />
                        <Gauge label="Safety" value={74} color="#D4590A" delay={0.2} />
                        <Gauge label="Scam" value={61} color="#F5A623" delay={0.3} />
                        <Gauge label="Crowd" value={78} color="#12A8AE" delay={0.4} />
                        <Gauge label="Budget" value={91} color="#B8922A" delay={0.5} />
                    </div>

                    <div className="flex flex-wrap items-center gap-10">
                        <div className="flex gap-8">
                            <div className="glass-card px-4 py-2 border-white/10">
                                <span className="text-sm font-sans font-bold text-text-primary group-hover:text-saffron transition-colors">12,847 Passports Issued</span>
                            </div>
                            <div className="glass-card px-4 py-2 border-white/10">
                                <span className="text-sm font-sans font-bold text-text-primary group-hover:text-saffron transition-colors">99.6% Claim-Free</span>
                            </div>
                        </div>

                        <button className="flex items-center gap-2 text-text-primary font-sans font-semibold border-b border-white/20 hover:border-saffron transition-all group pb-1">
                            See Inside a Passport
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Floating Three.js Scene */}
                <div className="lg:col-span-12 h-[400px] w-full relative">
                    <div className="absolute top-0 right-0 w-[500px] h-full pointer-events-none opacity-40 lg:opacity-100">
                        <PassportObject />
                    </div>
                    <div className="absolute bottom-10 right-20 w-64 h-8 bg-black/40 blur-3xl rounded-full" />
                </div>
            </div>
        </section>
    );
};

export default PassportPreviewSection;
