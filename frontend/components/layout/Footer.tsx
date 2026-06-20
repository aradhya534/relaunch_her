import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="relative bg-brand-bgLight text-brand-dark/70 border-t border-brand-bgLight/80 py-16 overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-brand-bgLight/80">
          {/* Logo Branding column */}
          <div className="md:col-span-5 text-left space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="font-serif text-lg font-black text-brand-dark tracking-tight flex items-center">
                Relaunch
                <span className="text-brand-primary ml-1">Her</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-accent ml-1" />
              </span>
            </Link>
            <p className="text-xs text-brand-dark/60 max-w-md leading-relaxed">
              Sri Lanka's leading return-to-work tech engine. We help women bridge skills gaps, bypass filtering algorithms, and step directly into supportive careers.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 text-left">
            <h4 className="text-[10px] uppercase font-black tracking-widest text-brand-primary mb-4">Platform</h4>
            <ul className="space-y-2 text-xs text-brand-dark/75 font-medium">
              <li>
                <Link href="/" className="hover:text-brand-primary transition-colors">Home Page</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-primary transition-colors">Start Relaunch</Link>
              </li>
              <li>
                <Link href="/signup?role=EMPLOYER" className="hover:text-brand-primary transition-colors">Hire Talent</Link>
              </li>
            </ul>
          </div>

          {/* Corporate Support Column */}
          <div className="md:col-span-4 text-left">
            <h4 className="text-[10px] uppercase font-black tracking-widest text-brand-primary mb-4">Support & Terms</h4>
            <div className="flex flex-col space-y-2 text-xs text-brand-dark/75 font-medium">
              <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-primary transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-brand-primary transition-colors">Partner Directory</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-brand-dark/50 font-semibold">
          <div>
            &copy; {new Date().getFullYear()} Relaunch Her. Built to empower women returning to technology fields in Sri Lanka.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-brand-primary transition-colors">Linkedin</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
