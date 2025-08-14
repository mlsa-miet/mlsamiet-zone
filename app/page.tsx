"use client";

import type { NextPage } from 'next';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import SignInButton from './components/SignInButton';

// ..... SHARED COMPONENTS .....

const MLSALogo = () => (
    <img src="/mlsa-logo.png" alt="MLSA MIET Logo" className="w-24 h-24" />
);

const PlexusBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
           
            canvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
        };

        let points: { x: number; y: number; vx: number; vy: number; }[] = [];
        const calculatePointCount = () => Math.floor((window.innerWidth * window.innerHeight) / 9000);

        const initPoints = () => {
            const pointCount = calculatePointCount();
            points = [];
            for (let i = 0; i < pointCount; i++) {
                points.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: Math.random() * 0.3 - 0.15,
                    vy: Math.random() * 0.3 - 0.15,
                });
            }
        };

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            points.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(147, 197, 253, 0.6)';
                ctx.fill();
            });

            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const dist = Math.sqrt(Math.pow(points[i].x - points[j].x, 2) + Math.pow(points[i].y - points[j].y, 2));
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.strokeStyle = `rgba(147, 197, 253, ${1 - dist / 150})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        const handleResize = () => {
            resizeCanvas();
            initPoints();
        };

        window.addEventListener('resize', handleResize);
         setTimeout(() => {
            resizeCanvas();
            initPoints();
            draw();
        }, 100);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};

const NewFooter = () => {
    const socialIcons = [
        { name: 'LinkedIn', href: 'https://www.linkedin.com/company/mlsa-miet/', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> },
        { name: 'Instagram', href: 'https://www.instagram.com/mlsamiet/', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.645-.07-4.85s.012-3.585.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg> },
        { name: 'Twitter', href: 'https://x.com/MlsaMiet', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.299 1.634 4.217 3.797 4.66-1.13.308-2.323.343-3.522.124.616 1.956 2.413 3.38 4.545 3.42-1.77 1.39-3.995 2.22-6.417 2.22-1.053 0-2.08-.062-3.1- .182 2.29 1.47 5.013 2.33 7.94 2.33 9.525 0 14.737-7.89 14.737-14.737 0-.225-.005-.45-.014-.673.998-.722 1.863-1.625 2.557-2.65z"/></svg> },
        { name: 'WhatsApp', href: 'https://chat.whatsapp.com/DXjoWMoEPsfBeCrVtBJNqc', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.687-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.447-4.435-9.884-9.888-9.884-5.448 0-9.886 4.434-9.889 9.885.002 2.024.605 3.928 1.693 5.624l-.448 1.646 1.694-.439z"/></svg> },
    ];
    return (
        <footer className="bg-slate-900/50 border-t border-slate-800 py-16 px-4 text-slate-300">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center space-x-3 mb-4">
                        <MLSALogo />
                    </div>
                    <h3 className="font-bold text-2xl text-white mb-4">Be a Force for Good!</h3>
                    <p className="font-semibold mb-3">FOLLOW US ON OUR SOCIALS:</p>
                    <div className="flex items-center space-x-4">
                        {socialIcons.map((social) => (
                            <Link key={social.name} href={social.href} className="hover:text-blue-400 transition-colors">{social.icon}</Link>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-lg text-white mb-4">CONTACT US:</h4>
                    <Link href="mailto:pari.agarwal.cseds.2022@miet.ac.in" className="block hover:text-blue-400 transition-colors">pari.agarwal.cseds.2022@miet.ac.in</Link>
                    <Link href="mailto:mlsa.community@miet.ac.in" className="block hover:text-blue-400 transition-colors">mlsa.community@miet.ac.in</Link>
                </div>
                <div>
                    <h4 className="font-bold text-lg text-white mb-4">VISIT US AT:</h4>
                    <p>Meerut Institute of Engineering & Technology</p>
                    <p>Meerut, India</p>
                </div>
            </div>
            <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
                <p>&copy; {new Date().getFullYear()} MLSA MIET | DESIGNED BY MLSA MIET TEAM</p>
            </div>
        </footer>
    );
};

const CursorSpotlight = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div 
            className="pointer-events-none fixed inset-0 z-50 transition duration-300"
            style={{
                background: 'radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.2), transparent 80%)'
            }}
        ></div>
    );
};

// ....LANDING PAGE SPECIFIC COMPONENTS ....
const VisionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const GoalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);
const MissionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);
const TypingEffect = () => {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);
    const words = ["Student","Creators", "Coders", "Shapers"];
    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % words.length;
            const fullText = words[i];
            setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
            setTypingSpeed(isDeleting ? 80 : 150);
            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), 1000);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };
        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, typingSpeed, words]);
    return <span className="text-blue-400 border-r-2 border-blue-400 animate-pulse">{text}</span>;
};

// .......... LANDING PAGE ............
const LandingPage: NextPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'MLSA MIET Chapter';
  }, []);

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans antialiased overflow-x-hidden">
        <CursorSpotlight />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900"></div>
        <PlexusBackground />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="py-2 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 h-24 flex items-center">
          <nav className="flex justify-between items-center max-w-7xl mx-auto w-full">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <MLSALogo />
              <span className="font-bold text-xl tracking-wide">MLSA MIET</span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 font-medium">
              <Link href="/" className="text-blue-400 transition-colors duration-300">HOME</Link>
              <Link href="/team" className="hover:text-blue-400 transition-colors duration-300">TEAM</Link>
              <Link href="/about" className="hover:text-blue-400 transition-colors duration-300">ABOUT US</Link>
              <Link href="/connect" className="hover:text-blue-400 transition-colors duration-300">CONNECT WITH US</Link>
            </div>
            <div className="hidden md:block">
                <SignInButton />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                </button>
            </div>
          </nav>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
            <div className="md:hidden absolute top-24 left-0 w-full bg-slate-900/80 backdrop-blur-lg z-40">
                <div className="flex flex-col items-center space-y-4 py-8">
                    <Link href="/" className="text-lg font-medium hover:text-blue-400">HOME</Link>
                    <Link href="/team" className="text-lg font-medium hover:text-blue-400">TEAM</Link>
                    <Link href="/about" className="text-lg font-medium hover:text-blue-400">ABOUT US</Link>
                    <Link href="/connect" className="text-lg font-medium hover:text-blue-400">CONNECT WITH US</Link>
                    <SignInButton />
                </div>
            </div>
        )}

        <main id="home" className="flex-grow flex flex-col justify-center items-center text-center px-4 min-h-screen">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white">
            Microsoft Learn <TypingEffect />
          </h1>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-300">
            MIET Chapter
          </h2>
          <p className="mt-8 max-w-2xl text-lg text-slate-400">
            A passionate community of student leaders dedicated to helping peers and building solutions for a better tomorrow.
          </p>
          <div className="mt-12">
            <SignInButton isHero={true} />
          </div>
        </main>

        <section id="about" className="py-20 sm:py-32 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white relative inline-block pb-2">
                        About Us
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                    </h2>
                </div>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 perspective-1000">
                    <div className="group relative bg-slate-800/60 backdrop-blur-sm p-8 rounded-2xl text-center flex flex-col items-center transition-all duration-500 ease-out md:hover:!scale-110 md:hover:!rotate-0 md:hover:!-translate-y-4 md:hover:!z-20 md:transform-gpu md:rotate-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{filter: 'blur(20px)'}}></div>
                        <div className="relative z-10 flex flex-col items-center h-full">
                            <div className="bg-slate-900 p-4 rounded-full mb-6 ring-2 ring-slate-700 group-hover:ring-blue-400 transition-all duration-300">
                                <VisionIcon />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Vision</h3>
                            <p className="text-slate-400 flex-grow">
                                MLSA envisions a world where everyone has access to the benefits of technology. We believe that technology has the potential to be an effective tool for education.
                            </p>
                        </div>
                    </div>
                    <div className="group relative bg-slate-800/60 backdrop-blur-sm p-8 rounded-2xl text-center flex flex-col items-center transition-all duration-500 ease-out md:hover:!scale-110 md:hover:!-translate-y-4 z-10">
                         <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{filter: 'blur(20px)'}}></div>
                        <div className="relative z-10 flex flex-col items-center h-full">
                            <div className="bg-slate-900 p-4 rounded-full mb-6 ring-2 ring-slate-700 group-hover:ring-blue-400 transition-all duration-300">
                                <GoalIcon />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Goal</h3>
                            <p className="text-slate-400 flex-grow">
                                Connecting people with technology and assisting them in using it to enhance their lives are the two main objectives of MLSA. We organize events and work on projects to achieve this.
                            </p>
                        </div>
                    </div>
                    <div className="group relative bg-slate-800/60 backdrop-blur-sm p-8 rounded-2xl text-center flex flex-col items-center transition-all duration-500 ease-out md:hover:!scale-110 md:hover:!rotate-0 md:hover:!-translate-y-4 md:hover:!z-20 md:transform-gpu md:-rotate-6">
                         <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{filter: 'blur(20px)'}}></div>
                        <div className="relative z-10 flex flex-col items-center h-full">
                            <div className="bg-slate-900 p-4 rounded-full mb-6 ring-2 ring-slate-700 group-hover:ring-blue-400 transition-all duration-300">
                                <MissionIcon />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Mission</h3>
                            <p className="text-slate-400 flex-grow">
                                The mission of MLSA is "Tech for All." We empower individuals to embrace the digital world with confidence through engaging events, innovative projects, and meaningful connections.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-24">
                     <Link href="/about" className="inline-block text-blue-300 font-semibold border-2 border-blue-400 rounded-lg px-8 py-3 hover:bg-blue-400 hover:text-white hover:shadow-lg hover:shadow-blue-400/30 transition-all duration-300">
                        Know More &rarr;
                    </Link>
                </div>
            </div>
        </section>
        <NewFooter />
      </div>
    </div>
  );
};

export default LandingPage;