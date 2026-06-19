'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-brand-bgLight p-4 relative overflow-hidden">
      {/* Subtle ambient glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-accent/6 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-dark/50 hover:text-brand-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Card variant="light" className="glow-card bg-white border border-brand-bgLight/60 p-8 sm:p-10 rounded-3xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className="font-serif text-2xl font-black tracking-tight flex items-center text-brand-dark">
                Relaunch
                <span className="text-brand-primary ml-1">Her</span>
                <span className="inline-block w-2 h-2 rounded-full bg-brand-accent ml-1" />
              </span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-brand-dark tracking-tight">Welcome Back</h2>
            <p className="text-xs text-brand-dark/50 mt-1">Resume your tech career relaunch journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email input */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/60">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-dark/30" />
                <input
                  type="email"
                  placeholder="email@relaunchher.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-brand-bgLight/40 text-brand-dark rounded-xl border border-brand-bgLight focus:border-brand-primary focus:outline-none text-xs font-semibold transition-all placeholder:text-brand-dark/30 focus:ring-2 focus:ring-brand-primary/10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/60">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-dark/30" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-brand-bgLight/40 text-brand-dark rounded-xl border border-brand-bgLight focus:border-brand-primary focus:outline-none text-xs font-semibold transition-all placeholder:text-brand-dark/30 focus:ring-2 focus:ring-brand-primary/10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 font-bold py-3.5"
              >
                <LogIn className="h-4 w-4" />
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-xs text-brand-dark/40 border-t border-brand-bgLight pt-6 font-semibold">
            Don't have an account?{' '}
            <Link href="/signup" className="text-brand-primary font-bold hover:underline">
              Register Here
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
