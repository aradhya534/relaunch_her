'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, UserPlus, Sparkles, Building } from 'lucide-react';
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

      // Auto login after signup
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
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-b from-[#1A0F3D] to-brand-primary p-4 py-12">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-highlight/5 rounded-full blur-3xl" />

      <Card variant="dark" className="w-full max-w-md glow-card-dark border border-brand-primary/40 p-8 relative z-10">
        <div className="text-center mb-6">
          <span className="h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-primary flex items-center justify-center font-serif text-3xl font-bold shadow-md shadow-brand-accent/20 border border-brand-accent/30 text-brand-dark mx-auto mb-4">
            R
          </span>
          <h2 className="text-2xl font-bold font-serif text-white">Create Account</h2>
          <p className="text-xs text-brand-bgLight/60 mt-2">Join Relaunch Her Sri Lanka</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-brand-primary/40 p-1.5 rounded-xl border border-brand-bgLight/10">
          <button
            type="button"
            onClick={() => setRole('RETURNER')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              role === 'RETURNER'
                ? 'bg-brand-accent text-brand-dark shadow'
                : 'text-brand-bgLight/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>I am a Returner</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('EMPLOYER')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              role === 'EMPLOYER'
                ? 'bg-brand-accent text-brand-dark shadow'
                : 'text-brand-bgLight/60 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>I am an Employer</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-bgLight/80">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-bgLight/40" />
              <input
                type="text"
                placeholder="Aradhya Perera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-brand-primary/50 text-white rounded-xl border border-brand-bgLight/10 focus:border-brand-accent focus:outline-none text-sm transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

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
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-brand-primary/50 text-white rounded-xl border border-brand-bgLight/10 focus:border-brand-accent focus:outline-none text-sm transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button variant="primary" size="md" fullWidth type="submit" disabled={isLoading} className="flex items-center justify-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-brand-bgLight/50">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-accent font-bold hover:underline">
            Log In
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#1A0F3D] text-white">
        Loading Registration...
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
