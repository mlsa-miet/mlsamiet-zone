"use client";
import SignInButton from '../components/SignInButton';
import type { NextPage } from 'next';
import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 

//SHARED COMPONENTS ..............

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
            canvas.height = document.body.scrollHeight;
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
                        <span className="font-bold text-xl tracking-wide text-white">MLSA MIET</span>
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
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    return (
        <div 
            className="pointer-events-none fixed inset-0 z-50 transition duration-300"
            style={{
                background: 'radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.2), transparent 80%)'
            }}
        ></div>
    );
};


//ABOUT PAGE SPECIFIC COMPONENTS
const ImageSwitcher = () => {
    const images = [
        '/team/team2.jpg',
        '/team/team3.jpg',
        '/team/team4.jpg',
        '/team/team5.jpg',
    ];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);
    return (
        <div className="relative w-80 h-80 md:w-96 md:h-96 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            {images.map((src, index) => (
               <Image
                   key={src}
                   src={src}
                   alt={`Community image ${index + 1}`}
                   fill // This is the key change for absolutely positioned images
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Helps optimize image loading
                   className={`absolute inset-0 object-cover rounded-full border-4 border-slate-800 transition-opacity duration-1000 ease-in-out ${
                   index === currentImageIndex ? 'opacity-100' : 'opacity-0'
    }`}
/>
            ))}
        </div>
    );
};

const JourneyImpactCard = () => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const rotateX = -10 * ((y - height / 2) / (height / 2));
        const rotateY = 10 * ((x - width / 2) / (width / 2));
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    return (
        <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 lg:p-12 transition-transform duration-300 ease-out"
        >
            <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                 style={{ background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.25), transparent 80%)' }}>
            </div>
            <div className="relative text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Journey & Impact</h2>
                <p className="text-lg text-slate-400 max-w-4xl mx-auto leading-relaxed">
                    With a history of impactful events, industrial visits, and tech-driven initiatives, MLSA MIET has consistently grown, attracting thousands of participants across various technical domains. Our events, including SAMAARAMBH, PRAYAS, and Generative AI sessions, have witnessed an overwhelming response, with footfalls exceeding 1000+ registrations per event.
                </p>
            </div>
        </div>
    );
};

//ABOUT PAGE 
const AboutPage: NextPage = () => {
  useEffect(() => {
    document.title = 'About Us | MLSA MIET Chapter';
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
            <Link href="/" className="flex items-center space-x-3 cursor-pointer">
              <MLSALogo />
              <span className="font-bold text-xl tracking-wide">MLSA MIET</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8 font-medium">
              <Link href="/" className="hover:text-blue-400 transition-colors duration-300">HOME</Link>
              <Link href="/team" className="hover:text-blue-400 transition-colors duration-300">TEAM</Link>
              <Link href="/about" className="hover:text-blue-400 transition-colors duration-300">ABOUT US</Link>
              <Link href="/connect" className="hover:text-blue-400 transition-colors duration-300">CONNECT WITH US</Link>
            </div>
            <SignInButton />
          </nav>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center py-20 sm:py-24 px-4">
            <div className="max-w-7xl mx-auto w-full">
                <div className="text-center mb-20">
                    <h1 className="group text-5xl md:text-7xl font-black tracking-tighter text-white relative" style={{textShadow: '0 4px 20px rgba(59, 130, 246, 0.5)'}}>
                        <span className="relative inline-block">
                            Compile Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Journey</span>
                            <span className="absolute -bottom-2 left-0 w-0 h-1.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 group-hover:w-full"></span>
                        </span>
                    </h1>
                </div>

                <div className="grid md:grid-cols-5 gap-16 items-center mb-24">
                    <div className="md:col-span-3 bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 lg:p-12">
                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                            MLSA MIET is a vibrant community dedicated to fostering tech enthusiasm, innovation, and collaboration. Since its inception, the community has actively engaged students in cutting-edge technologies, hands-on workshops, and industry networking, creating a strong bridge between academia and the professional world.
                        </p>
                        <p className="mt-6 text-lg md:text-xl text-slate-300 leading-relaxed">
                            We believe in learning by doing. Our members get opportunities to work on real-world projects, participate in hackathons, and lead workshops, helping them grow as developers, leaders, and innovators.
                        </p>
                    </div>
                    <div className="md:col-span-2 flex justify-center items-center">
                        <ImageSwitcher />
                    </div>
                </div>

                <JourneyImpactCard />
            </div>
        </main>

        <NewFooter />

      </div>
    </div>
  );
};

export default AboutPage;
