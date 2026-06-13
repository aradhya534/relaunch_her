import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-brand-primary text-brand-bgLight/65 border-t border-brand-primary/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {/* Logo Branding */}
          <div className="text-center md:text-left">
            <span className="font-serif text-xl font-bold text-white tracking-wide">
              Relaunch <span className="text-brand-accent">Her</span>
            </span>
            <p className="text-xs mt-2 text-brand-bgLight/50 max-w-sm">
              Sri Lanka's premier upskilling and placement platform helping women return to tech after career breaks.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center space-x-6 text-xs font-semibold">
            <Link href="/" className="hover:text-brand-accent transition-colors">Home</Link>
            <Link href="/login" className="hover:text-brand-accent transition-colors">Start My Return</Link>
            <Link href="/signup?role=EMPLOYER" className="hover:text-brand-accent transition-colors">Hire Returners</Link>
            <a href="#" className="hover:text-brand-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-accent transition-colors">Terms</a>
          </div>
        </div>
        <div className="mt-8 border-t border-brand-primary/10 pt-6 text-center text-[10px] text-brand-bgLight/35">
          &copy; {new Date().getFullYear()} Relaunch Her. Built to empower women returning to technology fields in Sri Lanka.
        </div>
      </div>
    </footer>
  );
};
export default Footer;
