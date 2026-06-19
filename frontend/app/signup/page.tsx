'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, UserPlus, Sparkles, Building, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'EMPLOYER' ? 'EMPLOYER' : 'RETURNER';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'RETURNER' | 'EMPLOYER'>(defaultRole);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiURL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      toast.success('Registration successful! Logging in...');

      const loginRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        toast.error('Auto login failed. Please sign in manually.');
        router.push('/login');
      } else {
        if (role === 'EMPLOYER') {
          router.push('/employer/dashboard');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-brand-bgLight p-4 py-12 relative overflow-hidden">
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
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <span className="font-serif text-2xl font-black tracking-tight flex items-center text-brand-dark">
                Relaunch
                <span className="text-brand-primary ml-1">Her</span>
                <span className="inline-block w-2 h-2 rounded-full bg-brand-accent ml-1" />
              </span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-brand-dark tracking-tight">Create Account</h2>
            <p className="text-xs text-brand-dark/50 mt-1">Join Relaunch Her Sri Lanka</p>
          </div>

          {/* Role Toggle Selector */}
          <div className="relative grid grid-cols-2 gap-1 mb-6 bg-brand-bgLight p-1 rounded-xl border border-brand-bgLight/80">
            <button
              type="button"
              onClick={() => setRole('RETURNER')}
              className={`relative z-10 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                role === 'RETURNER'
                  ? 'text-brand-dark font-extrabold'
                  : 'text-brand-dark/50 hover:text-brand-dark'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>I am a Returner</span>
              {role === 'RETURNER' && (
                <motion.span
                  layoutId="roleToggleHighlight"
                  className="absolute inset-0 bg-white border border-brand-bgLight/80 rounded-lg z-[-1] shadow-sm"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setRole('EMPLOYER')}
              className={`relative z-10 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                role === 'EMPLOYER'
                  ? 'text-brand-dark font-extrabold'
                  : 'text-brand-dark/50 hover:text-brand-dark'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>I am an Employer</span>
              {role === 'EMPLOYER' && (
                <motion.span
                  layoutId="roleToggleHighlight"
                  className="absolute inset-0 bg-white border border-brand-bgLight/80 rounded-lg z-[-1] shadow-sm"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name input */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/60">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-dark/30" />
                <input
                  type="text"
                  placeholder="Aradhya Perera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-brand-bgLight/40 text-brand-dark rounded-xl border border-brand-bgLight focus:border-brand-primary focus:outline-none text-xs font-semibold transition-all placeholder:text-brand-dark/30 focus:ring-2 focus:ring-brand-primary/10"
                  disabled={isLoading}
                />
              </div>
            </div>

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

            {/* Password input */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/60">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-dark/30" />
                <input
                  type="password"
                  placeholder="Min. 6 characters"
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
                className="flex items-center justify-center space-x-2 font-bold py-3.5 shadow-md shadow-brand-primary/10"
              >
                <UserPlus className="h-4 w-4" />
                <span>{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-xs text-brand-dark/40 border-t border-brand-bgLight pt-6 font-semibold">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-primary font-bold hover:underline">
              Log In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-brand-bgLight text-brand-dark/50 text-sm">
        Loading Registration...
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
