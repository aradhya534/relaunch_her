'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, LogOut, Briefcase, BookOpen, FileText, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

export const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const isReturner = session?.user?.role === 'RETURNER';

  const navLinks = session
    ? isReturner
      ? [
          { name: 'Dashboard', href: '/dashboard', icon: BookOpen },
          { name: 'Assessment', href: '/assessment', icon: FileText },
          { name: 'Job Board', href: '/jobs', icon: Briefcase },
        ]
      : [
          { name: 'Dashboard', href: '/employer/dashboard', icon: BookOpen },
          { name: 'Post a Job', href: '/employer/post-job', icon: Briefcase },
        ]
    : [];

  const isActive = (href: string) => pathname === href;

  // The whole website is now light-themed for consistent layout
  const isDarkPage = false;

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300 ${
        isDarkPage 
          ? 'bg-brand-dark/90 border-brand-cardDark text-white' 
          : 'bg-white/90 border-brand-bgLight/80 text-brand-dark'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="font-serif text-xl font-black tracking-tight flex items-center">
                Relaunch
                <span className="ml-1 text-brand-primary">
                  Her
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full ml-1 bg-brand-accent" />
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 h-full">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center h-16 text-[11px] font-bold tracking-wide uppercase transition-colors px-1 ${
                    active
                      ? isDarkPage ? 'text-brand-accent' : 'text-brand-primary'
                      : isDarkPage ? 'text-white/70 hover:text-brand-accent' : 'text-brand-dark/65 hover:text-brand-primary'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        isDarkPage ? 'bg-brand-accent' : 'bg-brand-primary'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-3">
                <div 
                  className={`flex items-center space-x-2 py-1 px-3 rounded-xl border ${
                    isDarkPage 
                      ? 'bg-white/5 border-white/10' 
                      : 'bg-brand-bgLight/40 border-brand-bgLight/80'
                  }`}
                >
                  <div 
                    className={`h-5 w-5 rounded-lg flex items-center justify-center ${
                      isDarkPage ? 'bg-white/10 text-brand-accent' : 'bg-brand-primary/10 text-brand-primary'
                    }`}
                  >
                    <User className="h-3 w-3" />
                  </div>
                  <div className="text-left">
                    <div className={`text-[10px] font-bold leading-tight ${isDarkPage ? 'text-white' : 'text-brand-dark'}`}>
                      {session.user.name}
                    </div>
                    <div className="text-[7.5px] text-brand-accent uppercase font-black tracking-widest leading-none mt-0.5">
                      {session.user.role}
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSignOut}
                  className={`p-2.5 rounded-xl transition-all duration-200 border ${
                    isDarkPage 
                      ? 'bg-white/5 border-white/10 text-white/60 hover:bg-brand-accent hover:text-brand-dark hover:border-brand-accent' 
                      : 'bg-brand-bgLight/40 border-brand-bgLight/80 text-brand-dark/60 hover:bg-brand-primary hover:text-white hover:border-brand-primary'
                  }`}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className={`text-xs font-bold tracking-wide uppercase transition-colors py-2 px-3 ${
                    isDarkPage ? 'text-white/80 hover:text-brand-accent' : 'text-brand-dark/80 hover:text-brand-primary'
                  }`}
                >
                  Log In
                </Link>
                <Link href="/signup">
                  <Button variant={isDarkPage ? 'primary' : 'secondary'} size="sm" className="shadow-sm font-bold">
                    Start My Return
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl transition-colors focus:outline-none ${
                isDarkPage 
                  ? 'text-white/80 hover:text-white hover:bg-white/5' 
                  : 'text-brand-dark/80 hover:text-brand-dark hover:bg-brand-bgLight/40'
              }`}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`md:hidden border-t overflow-hidden py-3 space-y-1 ${
                isDarkPage 
                  ? 'bg-brand-dark border-brand-cardDark text-white' 
                  : 'bg-white border-brand-bgLight text-brand-dark'
              }`}
            >
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      active 
                        ? isDarkPage 
                          ? 'bg-brand-accent/15 text-brand-accent border-l-4 border-brand-accent' 
                          : 'bg-brand-primary/10 text-brand-primary border-l-4 border-brand-primary'
                        : isDarkPage 
                          ? 'text-white/70 hover:bg-white/5 hover:text-white' 
                          : 'text-brand-dark/70 hover:bg-brand-bgLight/40 hover:text-brand-primary'
                    }`}
                  >
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              
              <div className={`pt-3 pb-2 border-t px-2 mt-2 ${isDarkPage ? 'border-brand-cardDark' : 'border-brand-bgLight'}`}>
                {session ? (
                  <div className="space-y-3 px-2">
                    <div className="flex items-center space-x-3">
                      <div 
                        className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                          isDarkPage ? 'bg-white/10 text-brand-accent' : 'bg-brand-primary/10 text-brand-primary'
                        }`}
                      >
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isDarkPage ? 'text-white' : 'text-brand-dark'}`}>
                          {session.user.name}
                        </div>
                        <div className="text-[9px] text-brand-accent uppercase tracking-widest font-black leading-none mt-0.5">
                          {session.user.role}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      fullWidth 
                      onClick={handleSignOut} 
                      className={`flex items-center justify-center space-x-2 py-2 text-xs border ${
                        isDarkPage 
                          ? 'border-white/20 text-white hover:bg-white/5' 
                          : 'border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5'
                      }`}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Log Out</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 px-2">
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        fullWidth 
                        className={isDarkPage ? 'border-white/20 text-white hover:bg-white/5' : 'border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5'}
                      >
                        Log In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full">
                      <Button variant={isDarkPage ? 'primary' : 'secondary'} size="sm" fullWidth>
                        Start My Return
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
