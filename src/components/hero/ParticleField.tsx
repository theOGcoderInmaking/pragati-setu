"use client";

import React, { useRef, useEffect } from "react";

const ParticleField: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const particleCount = 120;
        const mouse = { x: -1000, y: -1000, radius: 100 };

        class Particle {
            x: number;
            y: number;
            size: number;
            vx: number;
            vy: number;
            originX: number;
            originY: number;
            color: string;
            opacity: number;

            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.originX = this.x;
                this.originY = this.y;
                this.size = Math.random() * 2 + 1;
                this.vx = (Math.random() - 0.5) * 0.2; // Slow drift
                this.vy = (Math.random() - 0.5) * 0.2;
                this.opacity = Math.random() * 0.4 + 0.2;
                this.color = Math.random() > 0.5 ? "#F2EDE4" : "#12A8AE";
            }

            update(w: number, h: number) {
                // Slow drift
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around
                if (this.x < 0) this.x = w;
                if (this.x > w) this.x = 0;
                if (this.y < 0) this.y = h;
                if (this.y > h) this.y = 0;

                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    const pushX = Math.cos(angle) * force * 2;
                    const pushY = Math.sin(angle) * force * 2;

                    this.x -= pushX;
                    this.y -= pushY;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
            }
        }

        const init = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(w, h));
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleResize = () => {
            init();
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);
        init();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update(canvas.width, canvas.height);
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ filter: "blur(0.5px)" }}
        />
    );
};

export default ParticleField;
