"use client";
import Image from 'next/image'; 
import type { NextPage } from 'next';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import SignInButton from '../components/SignInButton';
//.........SHARED COMPONENTS.......
const MLSALogo = () => (
    <Image 
        src="/mlsa-logo.png" 
        alt="MLSA MIET Logo" 
        width={96}  
        height={96} 
        className="w-24 h-24" 
    />
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
        
        // Initial setup
        resizeCanvas();
        initPoints();
        draw();
        
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
// ----- Social Media Icons -----
const CommudleIcon = () => <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full"><svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M15.5 8.5c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5c.75 0 1.5-.5 1.5-1.5"></path><path d="M8.5 15.5c1.5 0 2.5-1 2.5-2.5s-1-2.5-2.5-2.5c-.75 0-1.5.5-1.5 1.5"></path></svg></div>;
const LinkedInIcon = () => <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full"><svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></div>;
const InstagramIcon = () => <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full"><svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.645-.07-4.85s.012-3.585.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg></div>;
const WhatsAppIcon = () => <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full"><svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.687-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.447-4.435-9.884-9.888-9.884-5.448 0-9.886 4.434-9.889 9.885.002 2.024.605 3.928 1.693 5.624l-.448 1.646 1.694-.439z"/></svg></div>;
const YouTubeIcon = () => <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full"><svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></div>;
const XIcon = () => <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full"><svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.299 1.634 4.217 3.797 4.66-1.13.308-2.323.343-3.522.124.616 1.956 2.413 3.38 4.545 3.42-1.77 1.39-3.995 2.22-6.417 2.22-1.053 0-2.08-.062-3.1- .182 2.29 1.47 5.013 2.33 7.94 2.33 9.525 0 14.737-7.89 14.737-14.737 0-.225-.005-.45-.014-.673.998-.722 1.863-1.625 2.557-2.65z"/></svg></div>;


// ===================================================================================
// ----- 2. REUSABLE PAGE LAYOUT (The new, improved part!) -----
// ===================================================================================

interface PageLayoutProps {
    children: React.ReactNode;
    activePage: 'home' | 'team' | 'about' | 'connect';
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, activePage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', name: 'HOME', page: 'home' },
        { href: '/team', name: 'TEAM', page: 'team' },
        { href: '/about', name: 'ABOUT US', page: 'about' },
        { href: '/connect', name: 'CONNECT WITH US', page: 'connect' },
    ];

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
                            {navLinks.map(link => (
                                <Link key={link.name} href={link.href} className={activePage === link.page ? "text-blue-400" : "hover:text-blue-400 transition-colors duration-300"}>
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <div className="hidden md:block">
                            <SignInButton />
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg>
                            </button>
                        </div>
                    </nav>
                </header>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-24 left-0 w-full bg-slate-900/80 backdrop-blur-lg z-40">
                        <div className="flex flex-col items-center space-y-4 py-8">
                            {navLinks.map(link => (
                                <Link key={link.name} href={link.href} className={`text-lg font-medium ${activePage === link.page ? "text-blue-400" : "hover:text-blue-400"}`}>
                                    {link.name}
                                </Link>
                            ))}
                            <SignInButton />
                        </div>
                    </div>
                )}
                <div className="flex-grow">
                    {children}
                </div>
                
                <NewFooter />
            </div>
        </div>
    );
};


// ===================================================================================
//....... 3. THE CONNECT PAGE (Now using the shared layout) ......
// ===================================================================================

const ConnectPage: NextPage = () => {
    useEffect(() => {
        document.title = 'Connect With Us | MLSA MIET Chapter';
    }, []);

    const socialLinks = [
        { name: 'Commudle', href: 'https://www.commudle.com/communities/microsoft-learn-student-ambassadors-meerut-institute-of-engineering-and-technology', icon: <CommudleIcon /> },
        { name: 'LinkedIn', href: 'https://www.linkedin.com/company/mlsa-miet/', icon: <LinkedInIcon /> },
        { name: 'Instagram', href: 'https://www.instagram.com/mlsamiet/', icon: <InstagramIcon /> },
        { name: 'WhatsApp Group', href: 'https://chat.whatsapp.com/DXjoWMoEPsfBeCrVtBJNqc', icon: <WhatsAppIcon /> },
        { name: 'YouTube', href: 'https://www.youtube.com/@mlsamiet', icon: <YouTubeIcon /> },
        { name: 'X (Twitter)', href: 'https://x.com/MlsaMiet', icon: <XIcon /> },
    ];

    return (
        <PageLayout activePage="connect">
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto">
                    <div className="text-center mb-8">
                        
                <Image
                  src="/mlsa-logo.png"
                  alt="MLSA MIET Logo"
                  width={112}  // matches w-28 (28 × 4px = 112px)
                  height={112} // matches h-28
                  className="mx-auto mb-4"
                  priority
                />
                        <h1 className="text-3xl font-bold text-white">MLSA MIET</h1>
                        <p className="text-slate-300 mt-1">A community of student leaders building a better tomorrow.</p>
                    </div>

                    <div className="space-y-4">
                        {socialLinks.map(link => (
                            <Link 
                                key={link.name} 
                                href={link.href} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-4 p-2 bg-slate-800/60 border border-slate-700 rounded-full hover:bg-slate-700/80 hover:border-blue-500 transition-all duration-300 transform hover:scale-105"
                            >
                                {link.icon}
                                <span className="font-semibold flex-grow text-left text-slate-100">{link.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </PageLayout>
    );
};

export default ConnectPage;
