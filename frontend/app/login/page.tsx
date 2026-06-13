'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn, ShieldAlert } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error || 'Invalid credentials');
      } else {
        toast.success('Successfully logged in!');
        
        // Fetch session to determine role and redirect
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        
        if (session?.user?.role === 'EMPLOYER') {
          router.push('/employer/dashboard');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-b from-[#1A0F3D] to-brand-primary p-4">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-highlight/5 rounded-full blur-3xl" />

      <Card variant="dark" className="w-full max-w-md glow-card-dark border border-brand-primary/40 p-8 relative z-10">
        <div className="text-center mb-8">
          <span className="h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-primary flex items-center justify-center font-serif text-3xl font-bold shadow-md shadow-brand-accent/20 border border-brand-accent/30 text-brand-dark mx-auto mb-4">
            R
          </span>
          <h2 className="text-2xl font-bold font-serif text-white">Welcome Back</h2>
          <p className="text-xs text-brand-bgLight/60 mt-2">Resume your tech career relaunch journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-bgLight/80">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-bgLight/40" />
              <input
                type="email"
                placeholder="email@relaunchher.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-brand-primary/50 text-white rounded-xl border border-brand-bgLight/10 focus:border-brand-accent focus:outline-none text-sm transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-bgLight/80">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-bgLight/40" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-brand-primary/50 text-white rounded-xl border border-brand-bgLight/10 focus:border-brand-accent focus:outline-none text-sm transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button variant="primary" size="md" fullWidth type="submit" disabled={isLoading} className="flex items-center justify-center space-x-2">
              <LogIn className="h-4 w-4" />
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-brand-bgLight/50">
          Don't have an account?{' '}
          <Link href="/signup" className="text-brand-accent font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </Card>
    </div>
  );
}
