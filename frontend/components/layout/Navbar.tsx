'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, LogOut, Sparkles, Briefcase, BookOpen, FileText, User } from 'lucide-react';
import Button from '../ui/Button';

export const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const isReturner = session?.user?.role === 'RETURNER';
  const isEmployer = session?.user?.role === 'EMPLOYER';

  const navLinks = session
    ? isReturner
      ? [
          { name: 'Dashboard', href: '/dashboard', icon: Sparkles },
          { name: 'Assessment', href: '/assessment', icon: FileText },
          { name: 'Upskill', href: '/dashboard#courses', icon: BookOpen }, // or direct to first course
          { name: 'Job Board', href: '/jobs', icon: Briefcase },
        ]
      : [
          { name: 'Dashboard', href: '/employer/dashboard', icon: Sparkles },
          { name: 'Post a Job', href: '/employer/post-job', icon: Briefcase },
        ]
    : [];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-brand-primary/95 backdrop-blur-md border-b border-brand-primary/20 text-brand-bgLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-primary flex items-center justify-center font-serif text-2xl font-bold shadow-md shadow-brand-accent/20 border border-brand-accent/30 text-brand-dark">
                R
              </span>
              <span className="font-serif text-2xl font-semibold tracking-wide bg-gradient-to-r from-white to-brand-bgLight bg-clip-text text-transparent">
                Relaunch <span className="text-brand-accent">Her</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-1.5 text-sm font-medium transition-colors hover:text-brand-accent ${
                    isActive(link.href) ? 'text-brand-accent border-b-2 border-brand-accent pb-1' : 'text-brand-bgLight/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-brand-cardDark py-1.5 px-3.5 rounded-xl border border-brand-bgLight/10">
                  <div className="h-7 w-7 rounded-lg bg-brand-accent/15 text-brand-accent flex items-center justify-center">
                    <User className="h-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold leading-tight text-white">{session.user.name}</div>
                    <div className="text-[10px] text-brand-accent uppercase font-bold tracking-wider">{session.user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2.5 rounded-xl bg-brand-cardDark hover:bg-brand-accent hover:text-brand-dark transition-all duration-200 border border-brand-bgLight/10 text-brand-bgLight/70"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-sm font-medium hover:text-brand-accent transition-colors py-2.5 px-4">
                  Log In
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
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
              className="p-2 rounded-xl text-brand-bgLight/80 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-brand-cardDark border-t border-brand-primary/20 px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.href) ? 'bg-brand-primary text-brand-accent font-semibold' : 'text-brand-bgLight/75 hover:bg-brand-primary/40 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          
          <div className="pt-4 pb-2 border-t border-brand-primary/10 px-3">
            {session ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-brand-accent/15 text-brand-accent flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{session.user.name}</div>
                    <div className="text-xs text-brand-accent uppercase tracking-wider font-bold">{session.user.role}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" fullWidth onClick={handleSignOut} className="flex items-center justify-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="outline" size="sm" fullWidth>
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="primary" size="sm" fullWidth>
                    Start My Return
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
