'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Briefcase, FileText, UserCheck } from 'lucide-react';

interface SidebarProps {
  role: 'RETURNER' | 'EMPLOYER';
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();

  const links = role === 'RETURNER' 
    ? [
        { name: 'My Dashboard', href: '/dashboard', icon: Sparkles },
        { name: 'Skills Assessment', href: '/assessment', icon: FileText },
        { name: 'Job Matches', href: '/jobs', icon: Briefcase },
      ]
    : [
        { name: 'Employer Dashboard', href: '/employer/dashboard', icon: Sparkles },
        { name: 'Post a Job', href: '/employer/post-job', icon: UserCheck },
      ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 bg-white border-r border-brand-bgLight/80 h-[calc(100vh-80px)] sticky top-20 hidden md:block flex-shrink-0">
      <div className="p-6">
        <div className="mb-6">
          <p className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/40">Navigation</p>
        </div>
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                    active
                      ? 'bg-brand-accent text-brand-dark shadow-md shadow-brand-accent/15'
                      : 'text-brand-dark/70 hover:bg-brand-bgLight/75 hover:text-brand-primary'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-brand-dark' : 'text-brand-dark/50'}`} />
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};
export default Sidebar;
