/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { 
  Heart,
  Calendar, 
  MapPin, 
  Clock, 
  Music, 
  Music2, 
  Camera, 
  Send, 
  Gift,
  ChevronDown,
  CheckCircle2,
  ArrowUp,
  ZoomIn,
  X,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---
const Watermark = React.memo(({ className }: { className?: string }) => (
  <div className={cn("absolute pointer-events-none opacity-[0.03] select-none overflow-hidden text-wedding-accent", className)}>
    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M200 40C200 40 220 100 280 100C340 100 360 40 360 40C360 40 300 60 300 120C300 180 360 200 360 200C360 200 300 220 300 280C300 340 360 360 360 360C360 360 340 300 280 300C220 300 200 360 200 360C200 360 180 300 120 300C60 300 40 360 40 360C40 360 60 300 60 240C60 180 0 160 0 160C0 160 60 140 60 80C60 20 0 0 0 0C0 0 20 60 80 60C140 60 160 0 160 0" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  </div>
));

const DoubleHappiness = React.memo(({ className, color = "text-red-600/10" }: { className?: string; color?: string }) => (
  <div className={cn("absolute pointer-events-none select-none font-serif", color, className)}>
    <span className="text-8xl md:text-9xl">囍</span>
  </div>
));

const DecorativeAccent = React.memo(({ className, color = "#2D5A27" }: { className?: string; color?: string }) => (
  <div className={cn("absolute pointer-events-none select-none", className)}>
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0C30 0 60 30 60 60" stroke={color} strokeWidth="0.5" opacity="0.2" />
      <path d="M0 10C25 10 50 35 50 60" stroke={color} strokeWidth="0.5" opacity="0.1" />
      <path d="M10 0C10 25 35 50 60 50" stroke={color} strokeWidth="0.5" opacity="0.1" />
      <circle cx="2" cy="2" r="1.5" fill={color} opacity="0.3" />
      <path d="M0 0L15 15" stroke={color} strokeWidth="0.5" opacity="0.2" />
    </svg>
  </div>
));

const LaceBorder = ({ className }: { className?: string }) => (
  <div className={cn("absolute pointer-events-none select-none opacity-20", className)}>
    <svg width="100%" height="20" viewBox="0 0 400 20" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 10L400 10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
      <path d="M0 0C10 0 10 10 20 10C30 10 30 0 40 0C50 0 50 10 60 10C70 10 70 0 80 0C90 0 90 10 100 10C110 10 110 0 120 0C130 0 130 10 140 10C150 10 150 0 160 0C170 0 170 10 180 10C190 10 190 0 200 0C210 0 210 10 220 10C230 10 230 0 240 0C250 0 250 10 260 10C270 10 270 0 280 0C290 0 290 10 300 10C310 10 310 0 320 0C330 0 330 10 340 10C350 10 350 0 360 0C370 0 370 10 380 10C390 10 390 0 400 0" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="20" cy="15" r="1" fill="currentColor" />
      <circle cx="60" cy="15" r="1" fill="currentColor" />
      <circle cx="100" cy="15" r="1" fill="currentColor" />
      <circle cx="140" cy="15" r="1" fill="currentColor" />
      <circle cx="180" cy="15" r="1" fill="currentColor" />
      <circle cx="220" cy="15" r="1" fill="currentColor" />
      <circle cx="260" cy="15" r="1" fill="currentColor" />
      <circle cx="300" cy="15" r="1" fill="currentColor" />
      <circle cx="340" cy="15" r="1" fill="currentColor" />
      <circle cx="380" cy="15" r="1" fill="currentColor" />
    </svg>
  </div>
);

const BotanicalAccent = React.memo(({ className, color = "#2D5A27" }: { className?: string; color?: string }) => (
  <div className={cn("absolute pointer-events-none select-none opacity-[0.08]", className)}>
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 110C10 110 20 60 60 40C100 20 110 10 110 10" stroke={color} strokeWidth="0.5" />
      <path d="M60 40C60 40 70 30 85 35C100 40 105 55 105 55C105 55 90 60 75 55C60 50 60 40 60 40Z" fill={color} />
      <path d="M40 60C40 60 30 55 25 40C20 25 35 20 35 20C35 20 40 35 35 50C30 65 40 60 40 60Z" fill={color} />
      <path d="M20 85C20 85 10 80 5 65C0 50 15 45 15 45C15 45 20 60 15 75C10 90 20 85 20 85Z" fill={color} />
      <circle cx="110" cy="10" r="1.5" fill={color} />
    </svg>
  </div>
));

const SectionDivider = React.memo(({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center gap-4 py-2", className)}>
    <div className="w-12 h-px bg-wedding-accent/20" />
    <div className="w-2 h-2 rotate-45 border border-wedding-accent/40" />
    <div className="w-12 h-px bg-wedding-accent/20" />
  </div>
));

// --- Constants ---
const getWeddingDate = () => {
  if (typeof window === 'undefined') return new Date('2026-04-05T10:00:00');
  const params = new URLSearchParams(window.location.search);
  return params.get('side') === '1' ? new Date('2026-04-04T16:30:00') : new Date('2026-04-05T10:00:00');
};
const WEDDING_DATE = getWeddingDate();
const GROOM_NAME = "Đức Anh";
const BRIDE_NAME = "Phạm Nga";

const GALLERY_IMAGES = [
  {
    src:"/images/1.jpg",
    caption: 'Khoảnh khắc thiêng liêng dưới lễ đường'
  },
  {
    src:"/images/2.jpg",
    caption: 'Sự gắn kết vĩnh cửu'
  },
  {
    src:"/images/3.jpg",
    caption: 'Trao nhau lời thề nguyện'
  },
  {
    src:"/images/6.jpg",
    caption: 'Vẻ đẹp rạng ngời của cô dâu'
  },
  {
    src:"/images/7.jpg",
    caption: 'Không gian tiệc cưới sang trọng'
  },
  {
    src:"/images/8.jpg",
    caption: 'Vũ điệu đầu tiên của đôi lứa'
  }
];

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; left: number; size: number; duration: number; delay: number; color: string }[]>([]);
  const colors = [
    'text-wedding-accent/60',
    'text-wedding-accent/40',
    'text-wedding-grey/60',
    'text-wedding-grey/40'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        size: Math.random() * (24 - 10) + 10,
        duration: Math.random() * (12 - 6) + 6,
        delay: Math.random() * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setHearts(prev => [...prev.slice(-15), newHeart]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ y: '110vh', opacity: 0, scale: 0, x: 0 }}
            animate={{ 
              y: '-10vh', 
              opacity: [0, 0.4, 0.4, 0],
              scale: [0.5, 1, 0.8, 1],
              x: [0, 15, -15, 15, 0],
              rotate: [0, 10, -10, 10, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: heart.duration, 
              delay: heart.delay,
              ease: "linear"
            }}
            className={twMerge("absolute", heart.color)}
            style={{ left: `${heart.left}%` }}
          >
            <Heart size={heart.size} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- Components ---

const WeddingCalendar = () => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const highlightDay = params.get('side') === '1' ? 4 : 5;
  
  return (
    <div className="relative max-w-md mx-auto py-4 px-4">
      <div className="relative z-10 overflow-hidden rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/6.jpg" 
            alt="Wedding Background" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 p-6 md:p-8 text-center">
          <div className="mb-4">
            <h3 className="text-4xl elegant-title text-wedding-ink italic mb-1">April 2026</h3>
            <div className="w-12 h-px bg-wedding-accent/30 mx-auto" />
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map(day => (
              <span key={day} className="text-[10px] font-bold text-wedding-accent uppercase tracking-widest opacity-60">{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for April 2026 starting on Wednesday */}
            {Array.from({ length: 2 }).map((_, i) => <div key={`empty-${i}`} />)}
            
            {days.map(day => (
              <div 
                key={day} 
                className={cn(
                  "aspect-square flex items-center justify-center text-base md:text-lg font-sans relative transition-all duration-300",
                  day === highlightDay ? "text-white font-medium" : "text-wedding-ink/70 hover:text-wedding-accent"
                )}
              >
                {day === highlightDay && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-9 h-9 md:w-11 md:h-11 bg-red-500 rounded-full shadow-lg shadow-red-500/20 flex items-center justify-center">
                      <Heart className="w-4 h-4 md:w-5 md:h-5 text-white fill-white" />
                    </div>
                  </motion.div>
                )}
                <span className="relative z-10">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const WeddingSchedule = () => {
  const params = new URLSearchParams(window.location.search);
  const isBrideSide = params.get('side') === '1';

  const items = isBrideSide ? [
    { 
      time: '16 : 30', 
      title: 'Đón khách', 
      desc: 'Chào đón những vị khách quý đến chung vui',
      icon: <div className="w-10 h-10 border border-wedding-accent/20 rounded-full flex items-center justify-center"><div className="w-3 h-3 bg-wedding-accent rounded-full" /></div> 
    },
    { 
      time: '17 : 00', 
      title: 'Khai tiệc', 
      desc: 'Thưởng thức tiệc mừng cùng gia đình và bạn bè',
      icon: <Music className="w-8 h-8 text-wedding-accent" strokeWidth={1} /> 
    },
    { 
      time: '18 : 00', 
      title: 'Chụp ảnh', 
      desc: 'Lưu giữ những khoảnh khắc kỷ niệm đáng nhớ',
      icon: <Camera className="w-8 h-8 text-wedding-accent" strokeWidth={1} /> 
    }
  ] : [
    { 
      time: '09 : 00', 
      title: 'Đón khách', 
      desc: 'Chào đón những vị khách quý đến chung vui',
      icon: <div className="w-10 h-10 border border-wedding-accent/20 rounded-full flex items-center justify-center"><div className="w-3 h-3 bg-wedding-accent rounded-full" /></div> 
    },
    { 
      time: '09 : 30', 
      title: 'Lễ Cưới', 
      desc: 'Nghi thức trao nhẫn và lời thề nguyện',
      icon: <div className="flex -space-x-2"><div className="w-8 h-8 border border-wedding-accent/40 rounded-full bg-white" /><div className="w-8 h-8 border border-wedding-accent/40 rounded-full bg-white" /></div> 
    },
    { 
      time: '10 : 00', 
      title: 'Khai tiệc', 
      desc: 'Thưởng thức tiệc mừng cùng gia đình và bạn bè',
      icon: <Music className="w-8 h-8 text-wedding-accent" strokeWidth={1} /> 
    },
    { 
      time: '10 : 30', 
      title: 'Chụp ảnh', 
      desc: 'Lưu giữ những khoảnh khắc kỷ niệm đáng nhớ',
      icon: <Camera className="w-8 h-8 text-wedding-accent" strokeWidth={1} /> 
    }
  ];

  return (
    <div className="relative max-w-4xl mx-auto py-2 md:py-4 px-4">
      {/* Vertical Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-wedding-accent/10 -translate-x-1/2 hidden md:block" />
      
      <div className="space-y-2 md:space-y-4">
        {items.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            className={cn(
              "relative flex flex-col md:flex-row items-center justify-between",
              idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            )}
          >
            {/* Content Side */}
            <div className={cn(
              "w-full md:w-[42%] mb-4 md:mb-0",
              idx % 2 === 0 ? "md:text-right md:pr-10" : "md:text-left md:pl-10"
            )}>
              <div className="text-wedding-accent font-bold text-xs font-sans tracking-[0.15em] mb-1">{item.time}</div>
              <div className="text-wedding-ink font-display text-2xl italic mb-1">{item.title}</div>
              <p className="text-wedding-ink/60 text-xs font-serif leading-relaxed italic">
                {item.desc}
              </p>
            </div>

            {/* Center Icon */}
            <div className="relative md:absolute md:left-1/2 md:-translate-x-1/2 z-10 mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-full bg-white shadow-lg border border-wedding-accent/5 flex items-center justify-center group hover:scale-110 transition-transform duration-500">
                <div className="text-wedding-accent group-hover:rotate-12 transition-transform scale-75">{item.icon}</div>
              </div>
            </div>

            {/* Empty Side (for layout balance on desktop) */}
            <div className="hidden md:block md:w-[42%]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CountdownTimer = React.memo(() => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = WEDDING_DATE.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const items = [
    { label: 'Ngày', value: timeLeft.days },
    { label: 'Giờ', value: timeLeft.hours },
    { label: 'Phút', value: timeLeft.minutes },
    { label: 'Giây', value: timeLeft.seconds }
  ];

  return (
    <div className="flex gap-2 md:gap-4 justify-center">
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center group">
            {/* Heart Shape Background */}
            <svg 
              viewBox="0 0 24 24" 
              className="absolute inset-0 w-full h-full text-white/90 fill-white/90 drop-shadow-xl transition-transform duration-700 group-hover:scale-110"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            
            {/* Value */}
            <span className="relative z-10 text-lg md:text-xl font-display text-wedding-accent font-bold mt-[-5px]">
              {item.value}
            </span>
          </div>
          <span className="text-[8px] uppercase tracking-widest mt-1 text-wedding-ink/70 font-sans font-bold">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
});

const SectionTitle = ({ title, subtitle, align = 'center' }: { title: string; subtitle?: string; align?: 'center' | 'left' }) => (
  <div className={cn("mb-6 md:mb-10 px-4", align === 'center' ? "text-center" : "text-left")}>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-block mb-4"
    >
      <div className={cn("flex flex-col gap-3", align === 'center' ? "items-center" : "items-start")}>
        <div className="flex items-center gap-6">
          <div className="w-12 h-px bg-wedding-accent/20" />
          <span className="aesthetic-text !text-wedding-accent tracking-[0.4em] uppercase font-bold text-[10px]">Invitation</span>
          <div className="w-12 h-px bg-wedding-accent/20" />
        </div>
      </div>
    </motion.div>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-7xl elegant-title text-wedding-ink mb-6 leading-tight drop-shadow-sm"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        transition={{ delay: 0.2 }}
        className={cn(
          "text-wedding-grey font-serif text-lg md:text-xl max-w-2xl leading-relaxed font-light italic opacity-80",
          align === 'center' ? "mx-auto" : ""
        )}
      >
        {subtitle}
      </motion.p>
    )}
    <div className={cn("mt-4 flex", align === 'center' ? "justify-center" : "justify-start")}>
      <div className="w-8 h-px bg-wedding-accent/10" />
    </div>
  </div>
);

const EventCard = ({ 
  type, 
  time, 
  date, 
  location, 
  address, 
  mapUrl,
  buttonText = "View Map"
}: { 
  type: string; 
  time: string; 
  date: string; 
  location: string; 
  address: string; 
  mapUrl: string;
  buttonText?: string;
}) => (
  <motion.div 
    whileHover={{ y: -10 }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
    className="glass-card p-6 md:p-8 rounded-[40px] flex flex-col items-center text-center relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-wedding-accent/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
    
    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-xl flex items-center justify-center mb-4 md:mb-6 border border-wedding-accent/5">
      <Calendar className="w-6 h-6 md:w-8 md:h-8 text-wedding-accent" strokeWidth={1} />
    </div>
    
    <h3 className="text-2xl md:text-4xl elegant-title text-wedding-ink mb-4 md:mb-6">{type}</h3>
    
    <div className="space-y-4 md:space-y-6 mb-6 md:mb-8 w-full">
      <div className="flex flex-col gap-2">
        <span className="aesthetic-text !text-wedding-accent/40 tracking-wider">Time & Date</span>
        <div className="flex flex-col gap-1">
          <p className="text-xl font-display text-wedding-ink">{time}</p>
          <p className="text-wedding-grey font-serif italic">{date}</p>
        </div>
      </div>
      
      <div className="w-12 h-px bg-wedding-accent/10 mx-auto" />
      
      <div className="flex flex-col gap-2">
        <span className="aesthetic-text !text-wedding-accent/40 tracking-wider">Location</span>
        <div className="flex flex-col gap-1 px-4">
          <p className="text-2xl font-display text-wedding-ink leading-tight">{location}</p>
          <p className="text-sm text-wedding-grey leading-relaxed font-serif font-light italic">{address}</p>
        </div>
      </div>
    </div>
    
    <a 
      href={mapUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="mt-auto w-full py-4 rounded-2xl bg-wedding-accent text-white hover:bg-wedding-accent transition-all aesthetic-text !text-white shadow-xl flex items-center justify-center gap-3 group/btn"
    >
      <MapPin className="w-4 h-4 group-hover/btn:animate-bounce" />
      {buttonText}
    </a>
  </motion.div>
);

const Guestbook = () => {
  const messages = [
    { name: "Gia đình Bác Hùng", message: "Chúc hai cháu trăm năm hạnh phúc, sớm sinh quý tử nhé!", date: "2 giờ trước" },
    { name: "Bạn thân Đại học", message: "Cuối cùng cũng chịu lấy vợ rồi à? Chúc mừng hai bạn nhé, mãi hạnh phúc nha!", date: "5 giờ trước" },
    { name: "Chị Lan Anh", message: "Đám cưới đẹp quá, chúc hai em luôn yêu thương nhau như ngày đầu.", date: "1 ngày trước" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 rounded-3xl border border-wedding-accent/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-wedding-accent/5 rounded-bl-full -z-10" />
            <div className="flex flex-col h-full">
              <p className="text-wedding-ink/80 font-serif italic text-lg mb-4 leading-relaxed">"{msg.message}"</p>
              <div className="mt-auto flex items-center justify-between border-t border-wedding-accent/10 pt-4">
                <span className="aesthetic-text !text-wedding-ink font-bold text-[10px] uppercase tracking-wider">{msg.name}</span>
                <span className="text-[10px] text-wedding-grey font-serif italic">{msg.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-12">
        <button className="px-8 py-3 rounded-full border border-wedding-accent/20 text-wedding-accent aesthetic-text !text-wedding-accent hover:bg-wedding-accent hover:text-white transition-all text-sm">
          Xem tất cả lời chúc
        </button>
      </div>
    </div>
  );
};

const BentoGallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev !== null ? (prev + 1) % GALLERY_IMAGES.length : 0));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev !== null ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : GALLERY_IMAGES.length - 1));
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 auto-rows-[250px] md:auto-rows-[350px]">
        {GALLERY_IMAGES.slice(0, 6).map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setSelectedImage(idx)}
            className={cn(
              "relative overflow-hidden group shadow-xl cursor-pointer rounded-2xl md:rounded-[40px]",
              idx === 0 && "col-span-2 row-span-2",
              idx === 1 && "col-span-1 row-span-1",
              idx === 2 && "col-span-1 row-span-1",
              idx === 3 && "col-span-1 row-span-1",
              idx === 4 && "col-span-1 row-span-1",
              idx === 5 && "col-span-2 md:col-span-1 row-span-1"
            )}
          >
            <img 
              src={img.src} 
              alt={img.caption} 
              loading="lazy"
              className="w-full h-full object-cover object-[center_15%] transition-transform duration-1000 group-hover:scale-110 grayscale-[0.1] group-hover:grayscale-0"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-wedding-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px] p-6 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/30 flex items-center justify-center mb-4">
                <Camera className="text-white w-5 h-5 md:w-6 md:h-6" strokeWidth={1} />
              </div>
              <p className="text-white font-serif italic text-sm md:text-lg opacity-0 group-hover:opacity-100 transition-all delay-100 translate-y-4 group-hover:translate-y-0">
                {img.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-wedding-ink/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 md:-top-12 md:-right-12 text-white/60 hover:text-white transition-colors p-4 z-50"
              >
                <span className="text-4xl font-light">&times;</span>
              </button>
              
              <div className="w-full h-full flex items-center justify-center relative group/lightbox">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedImage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    src={GALLERY_IMAGES[selectedImage].src} 
                    alt={GALLERY_IMAGES[selectedImage].caption}
                    className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain shadow-2xl rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button 
                  onClick={prevImage}
                  className="absolute left-0 md:-left-20 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all z-50"
                >
                  <ChevronDown className="w-6 h-6 rotate-90" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-0 md:-right-20 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all z-50"
                >
                  <ChevronDown className="w-6 h-6 -rotate-90" />
                </button>
              </div>

              <div className="mt-8 text-center space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-8 h-px bg-wedding-accent/40" />
                  <span className="aesthetic-text !text-white/60 tracking-wider">
                    {selectedImage + 1} / {GALLERY_IMAGES.length}
                  </span>
                  <div className="w-8 h-px bg-wedding-accent/40" />
                </div>
                <h3 className="text-2xl md:text-4xl elegant-title text-white italic">
                  {GALLERY_IMAGES[selectedImage].caption}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Timeline = () => {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const isBrideSide = params.get('side') === '1';
  const events = [
    { 
      date: '2022.02.13', 
      title: 'Lần đầu gặp gỡ', 
      desc: 'Cái đích đến của hạnh phúc không chỉ nằm ở những khoảnh khắc lộng lẫy trên sân khấu mà nó xuất phát từ những điều nhỏ nhất... Giây phút này chúng mình vừa yêu và được yêu 🥰',
      img: '/images/16.jpg',
      isHeart: true
    },
    { 
      date: '2022.03.16', 
      title: 'Chính thức hẹn hò', 
      desc: 'Những năm tháng này, những chuyến đi này sẽ trở thành kỷ niệm đáng nhớ và quý giá nhất trong hành trình yêu của chúng mình.',
      img: '/images/17.jpg',
      isHeart: true
    },
    { 
      date: '2022.08.10', 
      title: 'Chuyến đi đầu tiên', 
      desc: 'Cùng nhau đi qua những vùng đất mới, cùng nhau ngắm nhìn thế giới rộng lớn. Mỗi bước chân đi cùng nhau đều là một kỷ niệm đẹp.',
      img: '/images/18.jpg',
      isHeart: true
    },
    { 
      date: '2025.08.24', 
      title: 'Lời cầu hôn ngọt ngào', 
      desc: 'Dưới ánh đèn lung linh của đêm Giáng sinh, anh đã trao em chiếc nhẫn và lời hứa sẽ bên nhau trọn đời. Và em đã nói "Đồng ý"!',
      img: '/images/19.jpg',
      isHeart: true
    },
    { 
      date: isBrideSide ? '2026.04.04' : '2026.04.05', 
      title: 'Về chung một nhà', 
      desc: 'Và khi tình yêu đủ lớn, chúng mình đã quyết định về chung một nhà, cùng viết tiếp một hành trình mới - hành trình của tình yêu và hạnh phúc. Chúng mình không hoàn hảo, nhưng vừa vặn cho nhau ❤️',
      img: '/images/20.jpg',
      isHeart: true
    }
  ];

  return (
    <div className="relative max-w-5xl mx-auto px-6 py-4">
      {/* Vertical Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-wedding-accent/10 -translate-x-1/2 hidden md:block" />
      
      <div className="space-y-8">
        {events.map((event, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative flex flex-col md:flex-row items-center gap-12 md:gap-0",
              idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            )}
          >
            {/* Image Side */}
            <div className="w-full md:w-1/2 flex justify-center px-8">
              <div className={cn(
                "relative w-full aspect-square max-w-[340px] overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-105",
                idx % 2 === 0 ? "rounded-[80px_20px_80px_20px]" : "rounded-[20px_80px_20px_80px]"
              )}>
                 <img src={event.img} alt={event.title} loading="lazy" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-wedding-accent/10 mix-blend-overlay" />
              </div>
            </div>

            {/* Center Pin */}
            <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center justify-center">
              {event.isHeart ? (
                <div className="w-10 h-10 rounded-full bg-white shadow-xl border border-wedding-accent/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-wedding-accent" fill="currentColor" />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-wedding-accent border-4 border-white shadow-xl" />
              )}
            </div>

            {/* Content Side */}
            <div className={cn(
              "w-full md:w-1/2 px-8 text-center",
              idx % 2 === 0 ? "md:text-left" : "md:text-right"
            )}>
              <div className={cn("flex items-center gap-4 mb-6 justify-center", idx % 2 === 0 ? "md:justify-start" : "md:justify-end")}>
                <span className="aesthetic-text !text-wedding-accent tracking-wider font-bold">{event.date}</span>
                <div className="w-8 h-px bg-wedding-accent/20" />
              </div>
              <h4 className="text-3xl md:text-4xl elegant-title text-wedding-ink mb-6">{event.title}</h4>
              <p className="text-wedding-grey font-serif font-light leading-relaxed text-lg italic">{event.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Envelope = ({ onOpen, isPlaying, onToggleMusic, playMusic }: { onOpen: () => void; isPlaying: boolean; onToggleMusic: () => void; playMusic: () => void }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [guestName, setGuestName] = useState("");
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const isBrideSide = params.get('side') === '1';

  useEffect(() => {
    // Get guest name from URL parameter 'to'
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) setGuestName(decodeURIComponent(to));
  }, []);

  const handleOpen = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);
    
    // Ensure music starts on interaction
    playMusic();
    
    setTimeout(onOpen, 2500);
  }, [isOpening, onOpen, playMusic]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpening) {
        handleOpen();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpening, handleOpen]);

  return (
    <motion.div 
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 z-[100] bg-[#FDFBF7] flex items-center justify-center overflow-hidden p-6"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D5A27 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Formal Frame */}
      <div className="absolute inset-8 border border-wedding-accent/10 pointer-events-none" />
      <div className="absolute inset-10 border-[0.5px] border-wedding-accent/5 pointer-events-none" />
      
      {/* Corner Decorations */}
      <DecorativeAccent className="top-4 left-4" color="#2D5A27" />
      <DecorativeAccent className="top-4 right-4 rotate-90" color="#2D5A27" />
      <DecorativeAccent className="bottom-4 left-4 -rotate-90" color="#2D5A27" />
      <DecorativeAccent className="bottom-4 right-4 rotate-180" color="#2D5A27" />
      
      <Watermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.01] scale-[2]" />
      
      <div className="max-w-lg w-full text-center space-y-8 relative z-10 translate-y-12 md:translate-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <h2 className="text-5xl md:text-6xl script-text !text-wedding-accent/80">Save our date</h2>
            <p className="aesthetic-text tracking-[0.4em] opacity-40">Đức Anh & Phạm Nga</p>
          </div>
        </motion.div>

        <div className="envelope-wrapper relative flex flex-col items-center space-y-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: isOpening ? 0 : [0, -15, 0]
            }}
            transition={{ 
              scale: { delay: 0.4, duration: 1 },
              opacity: { delay: 0.4, duration: 1 },
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="envelope relative cursor-pointer"
            onClick={!isOpening ? handleOpen : undefined}
          >
            {/* Flap */}
            <motion.div 
              className="envelope-flap overflow-hidden"
              animate={{ rotateX: isOpening ? 180 : 0 }}
              transition={{ duration: 1.2, ease: [0.645, 0.045, 0.355, 1] }}
              style={{ zIndex: isOpening ? 0 : 3 }}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D5A27 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
            </motion.div>
            
            {/* Front */}
            <div className="envelope-front overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D5A27 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
              <LaceBorder className="bottom-0 left-0 w-full text-wedding-accent opacity-30" />
            </div>

            {/* Polaroid Card inside */}
            <motion.div 
              className="absolute top-4 left-4 w-[calc(100%-32px)] h-[calc(100%-32px)] z-1"
              animate={{ y: isOpening ? -180 : 0, rotate: isOpening ? -5 : 0 }}
              transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="polaroid w-full h-full flex flex-col relative">
                <div className="flex-1 overflow-hidden relative">
                  <img 
                    src="/images/10.jpg"
                    className="w-full h-full object-cover"
                    alt="Wedding"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute bottom-3 left-0 w-full text-center text-[11px] font-sans text-wedding-accent/60 tracking-[0.4em] uppercase font-medium">
                  {isBrideSide ? "04.04.2026" : "05.04.2026"}
                </div>
              </div>
            </motion.div>

            {/* Wax Seal */}
            <motion.div 
              animate={{ 
                scale: isOpening ? 0 : 1,
                opacity: isOpening ? 0 : 1,
                y: isOpening ? -40 : 0
              }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[4]"
            >
              <div className="wax-seal bg-[#8B7355] border-2 border-[#705E45]">
                <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
                  <DoubleHappiness className="scale-[0.4] text-white/90" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-4 pb-2 border-y border-wedding-accent/10 inline-block px-8 text-center"
          >
            <p className="aesthetic-text !text-[11px] tracking-[0.2em] mb-2 text-wedding-accent/60 italic">Trân trọng kính mời</p>
            <p className="script-text text-3xl md:text-4xl text-wedding-ink">
              {guestName || "Bạn và Người thương"}
            </p>
          </motion.div>
        </div>

        <AnimatePresence>
          {!isOpening && (
            <motion.div 
              exit={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="pt-8"
            >
              <p className="aesthetic-text !text-[10px] tracking-[0.4em]">Chạm để mở thiệp</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const MusicDisc = React.memo(({ isPlaying, onToggleMusic }: { isPlaying: boolean; onToggleMusic: () => void }) => (
  <div className="relative group">
    {/* Fixed Needle Arm */}
    <div className="absolute top-0 right-0 w-6 h-8 z-30 pointer-events-none origin-top-right transition-transform duration-700" 
         style={{ transform: isPlaying ? 'rotate(-5deg)' : 'rotate(-25deg)' }}>
      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-gray-400 rounded-full shadow-sm" />
      <div className="absolute top-0.5 right-0.5 w-0.5 h-6 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full origin-top rotate-[20deg]" />
      <div className="absolute bottom-0 left-0 w-2.5 h-1 bg-gray-600 rounded-sm rotate-[20deg]" />
    </div>

    <motion.button 
      onClick={onToggleMusic}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "w-12 h-12 rounded-full bg-[#121212] shadow-[0_10px_25px_rgba(0,0,0,0.5),inset_0_0_10px_rgba(255,255,255,0.1)] flex items-center justify-center border-[3px] border-[#222] relative overflow-hidden",
        isPlaying && "animate-spin-slow"
      )}
      aria-label="Toggle Music"
    >
      {/* Vinyl Grooves Texture */}
      <div className="absolute inset-0 rounded-full opacity-40" 
           style={{ background: 'repeating-radial-gradient(circle, #000 0px, #000 1px, #111 2px, #111 3px)' }} />
      
      {/* Vinyl Shine/Reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-30 rotate-45" />
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/5 to-transparent opacity-20 -rotate-45" />
      
      {/* Center Label */}
      <div className="w-4 h-4 rounded-full bg-wedding-accent border border-black/20 z-10 flex items-center justify-center shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        {/* Metallic Pin */}
        <div className="w-1.5 h-1.5 bg-gradient-to-tr from-gray-400 via-white to-gray-500 rounded-full z-20 shadow-[0_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center">
          <div className="w-0.5 h-0.5 bg-gray-800 rounded-full opacity-50" />
        </div>
      </div>
      
      {/* Small Music Icon (Floating) */}
      <div className="absolute top-2 right-2 z-20">
        <Music className={cn("w-2.5 h-2.5 text-white/90 drop-shadow-md", isPlaying && "animate-bounce")} />
      </div>

      {/* Sparkles when playing */}
      {isPlaying && (
        <>
          <motion.div 
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
            className="absolute top-1 left-3 w-1 h-1 bg-white rounded-full z-30 shadow-[0_0_4px_white]"
          />
          <motion.div 
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.8 }}
            className="absolute bottom-2 right-4 w-1 h-1 bg-white rounded-full z-30 shadow-[0_0_4px_white]"
          />
        </>
      )}

      {/* Pulse effect when playing */}
      {isPlaying && (
        <div className="absolute inset-0 rounded-full animate-ping bg-wedding-accent/30 -z-10" />
      )}
    </motion.button>
  </div>
));

const ScrollToTopButton = React.memo(({ onClick }: { onClick: () => void }) => {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="pointer-events-auto w-12 h-12 rounded-full bg-white shadow-[0_15px_35px_rgba(0,0,0,0.2)] flex items-center justify-center text-wedding-accent relative group border-[3px] border-wedding-accent/10"
      aria-label="Back to Top"
    >
      {/* Progress Ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
        <motion.circle
          cx="24"
          cy="24"
          r="21"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="transparent"
          strokeDasharray="131.9"
          style={{ pathLength: scrollYProgress }}
          className="opacity-20"
        />
      </svg>
      
      <ArrowUp className="w-5 h-5 relative z-10 group-hover:-translate-y-1 transition-transform duration-300" />
      
      {/* Decorative inner ring */}
      <div className="absolute inset-1.5 rounded-full border border-wedding-accent/5" />
    </motion.button>
  );
});



const ConfigPage = () => {
  const [recipient, setRecipient] = useState('');
  const [side, setSide] = useState('0'); // 0: Groom, 1: Bride
  const [useNDAMap, setUseNDAMap] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    if (recipient) params.set('to', recipient);
    if (side === '1') params.set('side', '1');
    if (useNDAMap) params.set('map', '1');
    
    const queryString = params.toString();
    const link = queryString ? `${baseUrl}/?${queryString}` : baseUrl;
    setGeneratedLink(link);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 font-serif will-change-transform">
      <div className="max-w-md w-full glass-card p-8 rounded-[40px] shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl elegant-title text-wedding-accent">Cấu hình thiệp</h1>
          <p className="text-wedding-grey italic">Tạo link mời riêng cho từng khách</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="aesthetic-text block">Tên người nhận</label>
            <input 
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="VD: Anh Tuấn, Chị Lan..."
              className="w-full bg-transparent border-b-2 border-wedding-ink/20 px-0 py-2 focus:outline-none focus:border-wedding-accent transition-all text-wedding-ink"
            />
          </div>

          <div className="space-y-3">
            <label className="aesthetic-text block">Đại diện bên nào?</label>
            <div className="flex gap-4">
              {[
                { label: 'Nhà Trai', value: '0' },
                { label: 'Nhà Gái', value: '1' }
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setSide(item.value)}
                  className={cn(
                    "flex-1 py-3 rounded-2xl border-2 transition-all aesthetic-text text-xs",
                    side === item.value 
                      ? "bg-wedding-accent border-wedding-accent !text-white" 
                      : "border-wedding-ink/10 !text-wedding-ink/60 hover:border-wedding-ink/30"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-wedding-accent/5 rounded-2xl border border-wedding-accent/10">
            <div className="space-y-1">
              <p className="aesthetic-text !text-wedding-accent">Sử dụng NDA Map</p>
              <p className="text-[10px] text-wedding-grey italic">Dùng bản đồ NDAMaps thay vì Google Maps</p>
            </div>
            <button 
              onClick={() => setUseNDAMap(!useNDAMap)}
              className={cn(
                "w-12 h-6 rounded-full relative transition-colors duration-300",
                useNDAMap ? "bg-wedding-accent" : "bg-gray-300"
              )}
            >
              <motion.div 
                animate={{ x: useNDAMap ? 24 : 4 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>

          <button 
            onClick={generateLink}
            className="w-full py-4 bg-wedding-accent text-white rounded-2xl aesthetic-text !text-white hover:bg-wedding-accent/90 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            Tạo Link Mời
          </button>
        </div>

        {generatedLink && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-6 border-t border-wedding-accent/10"
          >
            <div className="relative group">
              <div className="w-full bg-white p-4 rounded-2xl border border-wedding-accent/10 text-xs break-all text-wedding-ink/70 pr-12 font-mono">
                {generatedLink}
              </div>
              <button 
                onClick={copyToClipboard}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-wedding-accent hover:bg-wedding-accent/10 rounded-lg transition-all"
                title="Copy link"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <a 
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-wedding-accent aesthetic-text hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Xem thử thiệp
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const isConfigPage = typeof window !== 'undefined' && window.location.pathname === '/config';

  if (isConfigPage) {
    return <ConfigPage />;
  }
  
  // Determine side from URL parameter
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const isBrideSide = params.get('side') === '1';

  const { register, handleSubmit, reset, formState: { isSubmitting, isSubmitSuccessful } } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      side: isBrideSide ? 'Nhà Gái' : 'Nhà Trai',
      guests: '1',
      message: ''
    }
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [openGroomBox, setOpenGroomBox] = useState(false);
  const [openBrideBox, setOpenBrideBox] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedQR, setSelectedQR] = useState<{src: string, name: string} | null>(null);
  const [brideHouseMapUrl, setBrideHouseMapUrl] = useState("https://www.google.com/maps/place/20%C2%B040'33.4%22N+106%C2%B001'20.8%22E/@20.6759104,106.0217952,19.04z/data=!4m4!3m3!8m2!3d20.6759524!4d106.022434!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDMxNS4wIKXMDSoASAFQAw%3D%3D");
  const [brideHouseMapText, setBrideHouseMapText] = useState("View Map");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { scrollYProgress, scrollY } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 500) {
      if (!showBackToTop) setShowBackToTop(true);
    } else {
      if (showBackToTop) setShowBackToTop(false);
    }
  });

  const playMusic = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log("Play blocked", e));
    }
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(e => {
        console.log("Initial autoplay blocked, waiting for interaction", e);
        setIsPlaying(false); // Set to false if blocked, so user can manually start
      });
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mapParam = params.get('map');
    if (mapParam !== null) {
      setBrideHouseMapUrl("https://ndamaps.vn/place/cqEQFw4dXYJA20VDuLt3L3OHSTQY51Y-RYV_OCm_WkV90A0oQkjIhRVy-SmM?typeMap=mapNDA");
      if (mapParam === '1') {
        setBrideHouseMapText("VIEW NDAMAPS");
      }
    }

    // Auto-play attempt on first interaction
    const playOnInteraction = () => {
      playMusic();
      window.removeEventListener('click', playOnInteraction);
      window.removeEventListener('touchstart', playOnInteraction);
      window.removeEventListener('mousedown', playOnInteraction);
      window.removeEventListener('keydown', playOnInteraction);
    };

    window.addEventListener('click', playOnInteraction);
    window.addEventListener('touchstart', playOnInteraction);
    window.addEventListener('mousedown', playOnInteraction);
    window.addEventListener('keydown', playOnInteraction);

    return () => {
      window.removeEventListener('click', playOnInteraction);
      window.removeEventListener('touchstart', playOnInteraction);
      window.removeEventListener('mousedown', playOnInteraction);
      window.removeEventListener('keydown', playOnInteraction);
    };
  }, [playMusic]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onRSVP = async (data: any) => {
    setSubmitError(null);
    try {
      // Client-only RSVP: Just show success and reset
      console.log('RSVP Success (Client-only):', data);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2D5A27', '#FFFFFF', '#6B7280']
      });
      reset();
    } catch (error) {
      console.error('RSVP Error:', error);
      setSubmitError('Có lỗi xảy ra khi gửi xác nhận. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="app-frame selection:bg-wedding-accent/20">
      <FloatingHearts />
      
      <audio 
        ref={audioRef} 
        src="/music/background.mp3"
        loop 
        autoPlay
      />

      <AnimatePresence mode="wait">
        {!isEnvelopeOpen ? (
          <Envelope 
            onOpen={() => setIsEnvelopeOpen(true)} 
            isPlaying={isPlaying}
            onToggleMusic={toggleMusic}
            playMusic={playMusic}
          />
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Background Music & Back to Top */}
            
            {/* Fixed Top Music Disc */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-[768px] px-6 z-50 pointer-events-none flex justify-end">
              <AnimatePresence>
                {!showBackToTop && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                    className="pointer-events-auto"
                  >
                    <MusicDisc isPlaying={isPlaying} onToggleMusic={toggleMusic} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fixed Bottom Music Disc */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[768px] px-6 z-50 pointer-events-none flex justify-start">
              <AnimatePresence>
                {showBackToTop && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                    className="pointer-events-auto"
                  >
                    <MusicDisc isPlaying={isPlaying} onToggleMusic={toggleMusic} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fixed Bottom Controls Container (Reactions & Scroll to Top) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[768px] px-6 z-50 pointer-events-none flex justify-end">
              <div className="flex flex-col items-center gap-3 pointer-events-auto">

                <AnimatePresence>
                  {showBackToTop && (
                    <ScrollToTopButton onClick={scrollToTop} />
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* QR Zoom Modal */}
            <AnimatePresence>
              {selectedQR && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedQR(null)}
                  className="fixed inset-0 z-[100] bg-wedding-ink/90 backdrop-blur-md flex items-center justify-center p-6"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-white p-8 rounded-[40px] max-w-sm w-full shadow-2xl flex flex-col items-center"
                  >
                    <button 
                      onClick={() => setSelectedQR(null)}
                      className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-wedding-ink shadow-lg hover:bg-wedding-accent hover:text-white transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    
                    <div className="w-full aspect-square bg-white rounded-2xl p-4 shadow-inner border border-wedding-accent/5">
                      <img 
                        src={selectedQR.src} 
                        alt="Zoomed QR" 
                         className="w-full h-auto object-contain md:max-w-[300px] md:max-h-[300px]"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden bg-white md:max-h-[700px] transform-gpu">
              <motion.div 
                style={{ opacity, scale }}
                className="absolute inset-0 z-0 will-change-transform"
              >
                <img 
                  src="/images/6.jpg"
                  alt="Wedding Background" 
                  className="w-full h-full object-cover object-[center_0%] brightness-[0.75] grayscale-[0.1]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
              </motion.div>

              <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-12 pb-8 md:pt-16 md:pb-12 flex flex-col items-center h-full min-h-screen md:min-h-[700px]">
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  className="text-center mb-auto md:mb-0"
                >
                  <span className="text-white/90 uppercase tracking-wider font-sans text-[10px] font-bold border-b border-white/30 pb-1">Trân trọng kính mời</span>
                </motion.div>

                <div className="flex flex-col items-center text-center w-full mt-auto md:mt-[250px] lg:mt-[300px]">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full mb-8"
                  >
                    <h1 className="text-2xl md:text-4xl lg:text-5xl text-white mb-6 font-light drop-shadow-2xl">
                      <span className="script-text !text-white !text-4xl md:!text-6xl lg:!text-7xl block leading-[1.1]">{GROOM_NAME}</span>
                      <span className="italic font-serif text-lg md:text-xl lg:text-2xl opacity-80 block my-2">&</span> 
                      <span className="script-text !text-white !text-4xl md:!text-6xl lg:!text-7xl block leading-[1.1]">{BRIDE_NAME}</span>
                    </h1>
                    
                    <div className="flex items-center gap-12 justify-center">
                      <div className="text-xs md:text-sm font-serif font-light tracking-wider drop-shadow-md border-y border-white/20 py-1 px-4">
                        {isBrideSide ? "16:30 - Thứ 7, ngày 4 tháng 4, 2026" : "9:30 - Chủ nhật, ngày 5 tháng 4, 2026"}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                  >
                    <CountdownTimer />
                  </motion.div>
                </div>
              </div>

              <div className="absolute bottom-12 right-4 flex flex-col items-end gap-12 z-20">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.5, delay: 1 }}
                  className="flex flex-col items-center gap-6"
                >
                  <motion.div 
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-4 vertical-text"
                  >
                    <motion.span 
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-white/80"
                    >
                      Kéo xuống để xem thêm
                    </motion.span>
                    <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 5, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChevronDown className="w-5 h-5 text-white/80" />
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Groom & Bride Section */}
            <section className="py-8 px-6 bg-white overflow-hidden relative">
              <BotanicalAccent className="top-0 right-0 -translate-y-1/4 translate-x-1/4 rotate-90" />
              <BotanicalAccent className="bottom-0 left-0 translate-y-1/4 -translate-x-1/4 -rotate-90" />
              
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  {/* Groom */}
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-[100px_20px_100px_20px] shadow-2xl relative">
                      <img 
                        src="/images/b.png"
                        alt="Groom" 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-wedding-ink/10 mix-blend-multiply" />
                    </div>
                    <div className="mt-8 md:mt-12 text-center md:text-left">
                      <span className="aesthetic-text !text-wedding-accent tracking-wider mb-4 block">Chú Rể</span>
                      <h3 className="text-4xl md:text-6xl script-text mb-4 md:mb-6">{GROOM_NAME}</h3>
                      <p className="text-wedding-grey font-serif italic text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                        "Anh không hứa sẽ mang cho em cả thế giới, nhưng anh hứa sẽ dành trọn cả thế giới của anh cho em."
                      </p>
                    </div>
                  </motion.div>

                  {/* Bride */}
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-[20px_100px_20px_100px] shadow-2xl relative">
                      <img
                          src="/images/9.png"
                          alt="Bride"
                          loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-wedding-ink/10 mix-blend-multiply" />
                    </div>
                    <div className="mt-8 md:mt-12 text-center md:text-right flex flex-col md:items-end">
                      <span className="aesthetic-text !text-wedding-accent tracking-wider mb-4 block">Cô Dâu</span>
                      <h3 className="text-4xl md:text-6xl script-text mb-4 md:mb-6">{BRIDE_NAME}</h3>
                      <p className="text-wedding-grey font-serif italic text-base md:text-lg leading-relaxed max-w-md mx-auto md:mr-0 md:ml-auto">
                        "Em chọn anh, không phải vì anh hoàn hảo, mà vì anh là mảnh ghép vừa vặn nhất cho trái tim em."
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Invitation Text */}
            <SectionDivider />
            <section className="relative py-6 md:py-12 px-6 overflow-hidden bg-white">
              <Watermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015] scale-150" />
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-5 relative"
                  >
                    <div className="aspect-[3/4] overflow-hidden rounded-full shadow-2xl border-8 border-white">
                      <img
                          src="/images/13.jpg"
                          alt="Invitation"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-wedding-sage rounded-full -z-10" />
                  </motion.div>

                  <div className="lg:col-span-7">
                    <SectionTitle 
                      align="left"
                      title="Lời Ngỏ" 
                      subtitle="Tình yêu không phải là tìm thấy một người hoàn hảo, mà là học cách nhìn thấy điều tuyệt vời từ một người không hoàn hảo."
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="space-y-3 text-lg md:text-xl leading-relaxed text-wedding-ink/70 font-serif font-light"
                    >
                      <p className="first-letter:text-6xl first-letter:font-display first-letter:mr-4 first-letter:float-left first-letter:text-wedding-accent">
                        Trân trọng kính mời Quý vị đến dự tiệc cưới chúng con. Sự hiện diện của Quý vị là niềm vinh hạnh lớn nhất.
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quote Section */}
            <section className="relative py-6 md:py-12 px-6 overflow-hidden flex items-center justify-center bg-wedding-ink">
              <div className="absolute inset-0 z-0">
                <img
                    src="/images/1.jpg"
                    alt="Quote Background"
                  className="w-full h-full object-cover opacity-30 grayscale"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 text-center max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="space-y-8 md:space-y-12"
                >
                  <div className="flex items-center justify-center gap-6">
                    <div className="w-16 h-px bg-white/20" />
                    <span className="aesthetic-text !text-white/40">The Philosophy</span>
                    <div className="w-16 h-px bg-white/20" />
                  </div>
                  <p className="text-xl md:text-4xl lg:text-5xl elegant-title text-white leading-tight">
                    "Tình yêu không phải là nhìn nhau, mà là cùng nhau nhìn về một hướng."
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-px h-12 bg-wedding-accent/40" />
                    <p className="aesthetic-text !text-white/60 tracking-wider uppercase font-bold">Antoine de Saint-Exupéry</p>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Love Story Section */}
            <SectionDivider />
            <section className="py-8 px-4 relative overflow-hidden">
              <Watermark className="top-0 left-0 opacity-[0.02]" />
              <Watermark className="bottom-0 right-0 opacity-[0.02] rotate-180" />
              <div className="max-w-6xl mx-auto">
                <SectionTitle title="Our Love Story" subtitle="Mỗi khoảnh khắc bên nhau đều là một món quà vô giá" />
                <Timeline />
              </div>
            </section>

            {/* Calendar Section */}
            <SectionDivider />
            <section className="py-8 bg-white px-4">
              <div className="max-w-4xl mx-auto text-center">
                <SectionTitle title="Lịch cưới chúng mình!" subtitle="Hãy lưu lại ngày trọng đại này nhé" />
                <WeddingCalendar />
              </div>
            </section>

            {/* Schedule Section */}
            <SectionDivider />
            <section className="py-8 bg-[#FDFBF7] px-4 relative overflow-hidden">
              <BotanicalAccent className="top-0 left-0 -translate-y-1/4 -translate-x-1/4" />
              <BotanicalAccent className="bottom-0 right-0 translate-y-1/4 translate-x-1/4 rotate-180" />
              <div className="max-w-4xl mx-auto text-center">
                <SectionTitle title="Chương trình tiệc" subtitle="Cùng chung vui trong ngày hạnh phúc" />
                <WeddingSchedule />
              </div>
            </section>

            {/* Event Details Section */}
            <SectionDivider />
            <section className="py-8 bg-white px-4 relative overflow-hidden">
              <Watermark className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.01] scale-125" />
              <div className="max-w-6xl mx-auto">
                <SectionTitle title="Thời Gian & Địa Điểm" subtitle="Rất hân hạnh được đón tiếp" />
                
                <div className="grid md:grid-cols-2 gap-8">
                    <>
                      <EventCard 
                        type="Tiệc Cưới"
                        time="10:00 AM"
                        date="Chủ Nhật, 05/04/2026"
                        location="Tư Gia Nhà Trai"
                        address="Thôn Vọng Hải, xã Thái Ninh, Hưng Yên"
                        mapUrl="https://maps.app.goo.gl/gy6E3pdaUpmVEXM3A"
                      />
                      <EventCard 
                        type="Tiệc Cưới"
                        time="04:30 PM"
                        date="Thứ Bảy, 04/04/2026"
                        location="Tư Gia Nhà Gái"
                        address="Thôn Yên Bình, xã Mộc Hoàn, Ninh Bình"
                        mapUrl={brideHouseMapUrl}
                        buttonText={brideHouseMapText}
                      />
                    </>
                  </div>
                </div>
              </section>

            {/* Gallery Section */}
            <SectionDivider />
            <section className="py-8 bg-[#FDFBF7] px-4 relative overflow-hidden">
              <BotanicalAccent className="top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 -rotate-90 opacity-20" />
              <BotanicalAccent className="top-1/2 right-0 -translate-y-1/2 translate-x-1/2 rotate-90 opacity-20" />
              <div className="max-w-7xl mx-auto">
                <SectionTitle title="Wedding Gallery" subtitle="Lưu giữ những khoảnh khắc hạnh phúc nhất" />
                <BentoGallery />
              </div>
            </section>

            {/* Wedding Gift Section */}
            <SectionDivider />
            <section className="py-12 bg-white px-4 relative overflow-hidden">
              <div className="max-w-5xl mx-auto text-center">
                <SectionTitle title="Gửi Lời Chúc & Quà Tặng" subtitle="Sự hiện diện của bạn là món quà lớn nhất, nhưng nếu bạn muốn gửi lời chúc riêng..." />
                
                <div className="mt-12 grid grid-cols-2 gap-4 md:gap-12 w-full max-w-3xl mx-auto px-2">
                  {/* Groom Side Card */}
                  <div className="relative h-[280px] md:h-[380px] group">
                    <motion.div 
                      className="absolute inset-0 bg-wedding-sage/10 rounded-[2.5rem] border border-wedding-accent/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      onClick={() => !openGroomBox && setOpenGroomBox(true)}
                      whileHover={{ scale: 1.01 }}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                           style={{ backgroundImage: 'radial-gradient(circle, #2D5A27 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                      
                      {/* Cover Content */}
                      <motion.div 
                        animate={{ 
                          y: openGroomBox ? -40 : 0, 
                          opacity: openGroomBox ? 0 : 1,
                          scale: openGroomBox ? 0.9 : 1
                        }}
                        className="flex flex-col items-center z-10"
                      >
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                          <Gift className="w-8 h-8 md:w-10 md:h-10 text-wedding-accent" strokeWidth={1} />
                        </div>
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-wedding-grey mb-2">Mừng cưới</span>
                        <h4 className="elegant-title text-wedding-ink text-lg md:text-2xl">Chú Rể</h4>
                        <div className="mt-4 w-8 h-px bg-wedding-accent/30" />
                      </motion.div>

                      {/* Revealed Content (QR & Info) */}
                      <AnimatePresence>
                        {openGroomBox && (
                          <motion.div 
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 p-4 md:p-8 flex flex-col items-center justify-center"
                          >
                            <div className="w-full flex flex-col items-center">
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedQR({
                                    src: '/images/21.jpg',
                                    name: 'QR_ChuRe.png'
                                  });
                                }}
                                className="group/qr relative aspect-square w-full max-w-[140px] md:max-w-[180px] bg-white rounded-2xl p-2 shadow-lg mb-6 flex items-center justify-center border border-wedding-accent/5 cursor-pointer overflow-hidden"
                              >
                                <img
                                  src="/images/21.jpg"
                                  alt="Groom QR"
                                  className="w-full h-full object-contain group-hover/qr:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-wedding-ink/60 opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                  <ZoomIn className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              
                              <div className="space-y-1 text-center">
                                <p className="text-wedding-ink font-bold text-xs md:text-base tracking-widest uppercase">Vũ Đức Anh</p>
                                <p className="text-wedding-grey font-serif italic text-[10px] md:text-sm">VP Bank</p>
                                <p className="text-wedding-accent font-mono text-xs md:text-base font-bold mt-1">0355301887</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Bride Side Card */}
                  <div className="relative h-[280px] md:h-[380px] group">
                    <motion.div 
                      className="absolute inset-0 bg-wedding-sage/10 rounded-[2.5rem] border border-wedding-accent/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      onClick={() => !openBrideBox && setOpenBrideBox(true)}
                      whileHover={{ scale: 1.01 }}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                           style={{ backgroundImage: 'radial-gradient(circle, #2D5A27 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                      
                      {/* Cover Content */}
                      <motion.div 
                        animate={{ 
                          y: openBrideBox ? -40 : 0, 
                          opacity: openBrideBox ? 0 : 1,
                          scale: openBrideBox ? 0.9 : 1
                        }}
                        className="flex flex-col items-center z-10"
                      >
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                          <Gift className="w-8 h-8 md:w-10 md:h-10 text-wedding-accent" strokeWidth={1} />
                        </div>
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-wedding-grey mb-2">Mừng cưới</span>
                        <h4 className="elegant-title text-wedding-ink text-lg md:text-2xl">Cô Dâu</h4>
                        <div className="mt-4 w-8 h-px bg-wedding-accent/30" />
                      </motion.div>

                      {/* Revealed Content (QR & Info) */}
                      <AnimatePresence>
                        {openBrideBox && (
                          <motion.div 
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 p-4 md:p-8 flex flex-col items-center justify-center"
                          >
                            <div className="w-full flex flex-col items-center">
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedQR({
                                    src: '/images/22.jpg',
                                    name: 'QR_CoDau.png'
                                  });
                                }}
                                className="group/qr relative aspect-square w-full max-w-[140px] md:max-w-[180px] bg-white rounded-2xl p-2 shadow-lg mb-6 flex items-center justify-center border border-wedding-accent/5 cursor-pointer overflow-hidden"
                              >
                                <img 
                                  src="/images/22.jpg"
                                  alt="Bride QR" 
                                  className="w-full h-full object-contain group-hover/qr:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-wedding-ink/60 opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                  <ZoomIn className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              
                              <div className="space-y-1 text-center">
                                <p className="text-wedding-ink font-bold text-xs md:text-base tracking-widest uppercase">Phạm Thị Nga</p>
                                <p className="text-wedding-grey font-serif italic text-[10px] md:text-sm">MB Bank</p>
                                <p className="text-wedding-accent font-mono text-xs md:text-base font-bold mt-1">0326872723</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-8 md:py-16 text-center px-6 bg-white border-t border-wedding-accent/5 relative overflow-hidden">
              <BotanicalAccent className="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
              <div className="max-w-4xl mx-auto space-y-12 md:space-y-16 relative z-10">
                <div className="flex items-center justify-center gap-6">
                  <div className="w-16 h-px bg-wedding-accent/10" />
                  <div className="w-12 h-12 border border-wedding-accent/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-wedding-accent rounded-full shadow-[0_0_10px_rgba(45,90,39,0.3)]" />
                  </div>
                  <div className="w-16 h-px bg-wedding-accent/10" />
                </div>
                
                <div className="space-y-8 relative">
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                    className="flex justify-center mb-2"
                  >
                    <div className="relative">
                      <Heart className="w-16 h-16 text-wedding-accent/10 fill-wedding-accent/5" />
                      <Heart className="w-8 h-8 text-wedding-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-wedding-accent shadow-sm" />
                      
                      {/* Floating particles */}
                      <motion.div 
                        animate={{ y: [-10, -30], opacity: [0, 1, 0], x: [-5, 5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="absolute -top-2 left-1/4 w-1 h-1 bg-wedding-accent rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [-5, -25], opacity: [0, 1, 0], x: [5, -5] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
                        className="absolute -top-4 right-1/4 w-1.5 h-1.5 bg-wedding-accent/40 rounded-full"
                      />
                    </div>
                  </motion.div>
                  
                  <div className="space-y-6">
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-4xl md:text-7xl elegant-title text-wedding-ink"
                    >
                      Trân Trọng Cảm Ơn
                    </motion.h2>
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "120px" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-px bg-gradient-to-r from-transparent via-wedding-accent/40 to-transparent mx-auto"
                    />
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                      className="text-wedding-grey font-serif font-light text-lg md:text-xl italic leading-relaxed max-w-xl mx-auto px-4"
                    >
                      "Sự hiện diện của bạn là niềm vinh dự to lớn và là món quà ý nghĩa nhất dành cho chúng tôi trong ngày trọng đại này."
                    </motion.p>
                  </div>
                </div>

                <div className="pt-12">
                  <div className="aesthetic-text !text-wedding-accent tracking-[0.5em] uppercase font-bold text-xs">
                    {GROOM_NAME} & {BRIDE_NAME} — 2026
                  </div>
                  <p className="text-wedding-grey font-serif italic text-sm mt-2 opacity-60">Made by Chú Rể - Test by Cô Dâu</p>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
