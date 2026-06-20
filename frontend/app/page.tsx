'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen, UserCheck, Award, TrendingUp, Cpu, Users, Star, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function LandingPage() {
  const steps = [
    {
      title: '1. Assess Capabilities',
      desc: 'Upload your past credentials and old CV. Our engine extracts your base meta-skills and computes a real-time Market Readiness Index.',
      icon: Cpu,
      badge: 'Bypass Filters',
    },
    {
      title: '2. Curated Upskilling',
      desc: 'Access targeted, modular upskilling pathways (Generative AI, DevOps, Agile Frameworks) specifically mapped to active employer hiring parameters.',
      icon: BookOpen,
      badge: 'Fast-Track',
    },
    {
      title: '3. Direct Placements',
      desc: 'Bypass cold screens and matching black-boxes. Apply directly to partnering Sri Lankan corporates offering specialized returnee onboarding programs.',
      icon: UserCheck,
      badge: '100% Verified',
    },
  ];

  const testimonials = [
    {
      name: 'Sanduni Perera',
      gap: '4 Years Out (Maternity)',
      text: 'I left engineering when my daughter was born. Relaunch Her gave me the specific AI and container skills I lacked, and connected me to a returnee internship at WSO2 where I am now a full-time Senior Engineer.',
      role: 'Placed as Senior SE at WSO2',
    },
    {
      name: 'Dilani Wijesinghe',
      gap: '3 Years Out (Family Relocation)',
      text: 'Algorithms rejected my resume instantly due to my career break. This platform bypassed the cold screens. The skills assessment verified my readiness, and Dialog AX hired me as a Fintech Product Manager.',
      role: 'Placed as PM at Dialog Axiata',
    },
  ];

  const partners = ['WSO2', 'Dialog', 'IFS', 'Sysco LABS', '99X'];

  return (
    <div className="min-h-screen overflow-hidden bg-brand-bgLight">

      {/* ── Hero: Cohesive light section ─────────────────── */}
      <div className="relative bg-brand-bgLight overflow-hidden border-b border-brand-bgLight/70">
        {/* Soft ambient glows */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-brand-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Text Column */}
            <div className="lg:col-span-7 text-left space-y-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge variant="teal" className="mb-4 py-1.5 px-4 rounded-xl border border-brand-accent/25 bg-brand-accent/10">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-brand-accent animate-pulse" />
                  <span>Sri Lanka's #1 Return-to-Tech Platform</span>
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight leading-tight text-brand-dark"
              >
                Your tech career <br />
                didn't end.{' '}
                <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                  It paused.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base sm:text-lg text-brand-dark/70 max-w-2xl leading-relaxed font-medium"
              >
                Bridge the technical skills gap, refresh your stack, and match directly with premier Sri Lankan tech firms welcoming returnees back into software, product, and leadership roles.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link href="/signup?role=RETURNER">
                  <Button variant="secondary" size="lg" className="flex items-center justify-center space-x-2 w-full sm:w-auto py-4 px-8 rounded-xl font-bold shadow-lg shadow-brand-primary/10">
                    <span>Start My Return</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/signup?role=EMPLOYER">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white py-4 px-8 rounded-xl font-bold">
                    Hire Returners
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right Visual Card Stack */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative w-full h-[450px] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 to-brand-accent/5 rounded-3xl filter blur-2xl opacity-60 z-0" />
              <div className="absolute inset-0 border border-brand-bgLight/85 bg-white/[0.4] rounded-3xl z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.01)_1px,transparent_1px)] bg-[size:24px_24px]" />
              </div>

              {/* Float Card 1 */}
              <div className="absolute top-8 left-6 w-52 p-4 rounded-2xl border border-brand-bgLight/85 bg-white shadow-xl z-20">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] uppercase tracking-widest text-brand-accent font-black">AI & DevOps Refresh</span>
                  <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-serif font-black text-brand-dark">92%</span>
                  <span className="text-[10px] text-brand-dark/50">Market Match</span>
                </div>
                <div className="w-full bg-brand-bgLight h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-brand-accent w-[92%]" />
                </div>
                <p className="text-[9px] text-brand-dark/50 mt-2">Verified readiness score</p>
              </div>

              {/* Float Card 2 */}
              <div className="absolute bottom-8 right-6 w-60 p-4 rounded-2xl border border-brand-bgLight/85 bg-white shadow-xl z-20">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="h-6 w-6 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">W</div>
                  <div>
                    <h4 className="text-[11px] font-black text-brand-dark">Senior Software Engineer</h4>
                    <p className="text-[9px] text-brand-dark/50">WSO2 &middot; Hybrid Path</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-brand-bgLight/40 pt-2.5 mt-2">
                  <span className="text-[9px] font-semibold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded">Specialist breaks program</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-dark/45" />
                </div>
              </div>

              {/* Central Box */}
              <div className="absolute p-6 rounded-3xl border border-brand-bgLight/85 bg-white shadow-2xl text-center max-w-[280px] z-10">
                <Award className="w-10 h-10 text-brand-primary mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-brand-dark leading-tight">Empowering returnees</h3>
                <p className="text-xs text-brand-dark/65 mt-2 leading-relaxed">
                  Reconnect, rebuild credentials, and secure verified direct placements.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* ── Stats Bar: Transitional medium tone ────────── */}
      <div className="bg-brand-bgLight">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="rounded-3xl p-6 md:p-8 bg-white border border-brand-bgLight/80 shadow-md grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-bgLight gap-6"
          >
            <div className="flex items-center space-x-4 p-4 justify-center md:justify-start">
              <TrendingUp className="w-8 h-8 text-brand-primary flex-shrink-0" />
              <div>
                <div className="text-3xl font-extrabold font-serif text-brand-primary">43%</div>
                <div className="text-xs font-semibold text-brand-dark/50 uppercase tracking-widest leading-none mt-1">of tech-women leave the sector</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 justify-center">
              <Users className="w-8 h-8 text-brand-primary flex-shrink-0" />
              <div>
                <div className="text-3xl font-extrabold font-serif text-brand-primary">2–5 Yrs</div>
                <div className="text-xs font-semibold text-brand-dark/50 uppercase tracking-widest leading-none mt-1">average career gap duration</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 justify-center md:justify-end">
              <Cpu className="w-8 h-8 text-brand-primary flex-shrink-0" />
              <div>
                <div className="text-3xl font-extrabold font-serif text-brand-primary">78%</div>
                <div className="text-xs font-semibold text-brand-dark/50 uppercase tracking-widest leading-none mt-1">bypassed algorithms filter</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── How it works: Clean light section ─────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black font-serif text-brand-dark">
              Our 3-Step Relaunch Formula
            </h2>
            <p className="text-brand-dark/55 max-w-xl mx-auto text-sm font-medium">
              We focus on your actual capability, target training, and direct placement, keeping you far away from matching filters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Card variant="light" className="glow-card flex flex-col h-full p-8 bg-white border border-brand-bgLight/60 rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-md shadow-brand-primary/20">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] uppercase tracking-widest font-black text-brand-accent bg-brand-accent/10 py-1 px-2.5 rounded-lg border border-brand-accent/15">
                        {step.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-serif mb-3 text-brand-dark">{step.title}</h3>
                    <p className="text-xs text-brand-dark/60 leading-relaxed font-medium">{step.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Testimonials: Slightly tinted section ──────── */}
        <section className="border-y border-brand-bgLight/80 py-24 bg-brand-bgLight/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl md:text-4xl font-black font-serif text-brand-dark">
                Relaunch Success Stories
              </h2>
              <p className="text-brand-dark/55 max-w-xl mx-auto text-sm font-medium">
                Read how returning Sri Lankan tech-women restarted their career journeys.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Card variant="light" className="glow-card p-8 flex flex-col justify-between bg-white border border-brand-bgLight/60 rounded-3xl h-full">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <div className="h-7 w-7 rounded-full bg-brand-accent/20 flex items-center justify-center text-[10px] text-brand-accent font-black">
                            {t.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-bold text-sm text-brand-dark">{t.name}</span>
                        </div>
                        <Badge variant="indigo" className="py-1 px-3 rounded-lg text-xs">
                          {t.gap}
                        </Badge>
                      </div>
                      <p className="text-xs italic text-brand-dark/70 leading-relaxed mb-6 font-medium">"{t.text}"</p>
                    </div>
                    <div className="border-t border-brand-bgLight pt-4 flex items-center justify-between mt-auto">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">{t.role}</span>
                      <div className="flex space-x-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3 h-3 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Partners: Clean light section ─────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-8">
            Partnering Corporates Welcoming Career Breaks
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {partners.map((partner) => (
              <motion.div
                key={partner}
                whileHover={{ scale: 1.05, y: -2 }}
                className="py-3.5 px-8 rounded-2xl bg-white border border-brand-bgLight/80 text-brand-dark/50 font-serif font-black text-lg tracking-widest shadow-sm hover:border-brand-accent/30 hover:text-brand-dark/80 transition-all cursor-pointer"
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
