import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen, UserCheck, Briefcase, Award, TrendingUp, Cpu } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function LandingPage() {
  const steps = [
    {
      title: '1. Assess',
      desc: 'Map your past tech expertise, upload your CV, and compute your current Skills Gap Score to plan your recovery.',
      icon: Cpu,
    },
    {
      title: '2. Upskill',
      desc: 'Enroll in curated, fast-track upskilling pathways (AI Integration, DevOps, Agile) targeted specifically to active market openings.',
      icon: BookOpen,
    },
    {
      title: '3. Place',
      desc: 'Unlock direct placement channels with partnering Sri Lankan tech firms offering supportive returnee-onboarding programs.',
      icon: UserCheck,
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
    <div className="bg-brand-bgLight min-h-screen text-brand-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-primary via-brand-primary to-brand-cardDark text-brand-bgLight py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-brand-highlight/5 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge variant="teal" className="mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Sri Lanka's #1 Return-to-Tech Platform
          </Badge>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Your tech career didn't end. <br/>
            <span className="bg-gradient-to-r from-brand-accent to-brand-highlight bg-clip-text text-transparent">
              It paused.
            </span>
          </h1>
          
          <p className="mt-6 text-base sm:text-lg md:text-xl text-brand-bgLight/80 max-w-2xl mx-auto leading-relaxed">
            Bridge the gap, upgrade your stack, and match directly with Sri Lankan tech giants welcoming women on career breaks back into leadership.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/signup?role=RETURNER">
              <Button variant="primary" size="lg" className="flex items-center space-x-2 w-full sm:w-auto">
                <span>Start My Return</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/signup?role=EMPLOYER">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white hover:text-brand-dark">
                Hire Returners
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 sm:-mt-12 relative z-20">
        <div className="bg-brand-highlight rounded-3xl p-6 md:p-8 shadow-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-primary/10 gap-6 text-brand-dark">
          <div className="flex items-center space-x-4 p-4 justify-center md:justify-start">
            <TrendingUp className="w-8 h-8 text-brand-primary flex-shrink-0" />
            <div>
              <div className="text-3xl font-extrabold font-serif text-brand-primary">43%</div>
              <div className="text-xs font-semibold text-brand-primary/80 uppercase tracking-wider">of tech-women leave the sector</div>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 justify-center md:p-4">
            <Award className="w-8 h-8 text-brand-primary flex-shrink-0" />
            <div>
              <div className="text-3xl font-extrabold font-serif text-brand-primary">2–5 Yrs</div>
              <div className="text-xs font-semibold text-brand-primary/80 uppercase tracking-wider">average career gap duration</div>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 justify-center md:p-4">
            <Cpu className="w-8 h-8 text-brand-primary flex-shrink-0" />
            <div>
              <div className="text-3xl font-extrabold font-serif text-brand-primary">78%</div>
              <div className="text-xs font-semibold text-brand-primary/80 uppercase tracking-wider">are rejected by CV filter algorithms</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-brand-primary">
            Our 3-Step Relaunch Formula
          </h2>
          <p className="mt-4 text-brand-dark/60 max-w-xl mx-auto">
            We bypass automated screening algorithms to focus on your actual capability, upskilling, and direct connection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} variant="light" className="glow-card flex flex-col justify-between p-8">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-brand-primary/5 text-brand-primary flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-serif mb-3 text-brand-primary">{step.title}</h3>
                  <p className="text-sm text-brand-dark/70 leading-relaxed">{step.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brand-primary/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-brand-primary">
              Relaunch Success Stories
            </h2>
            <p className="mt-4 text-brand-dark/60">
              Read how returning Sri Lankan tech-women restarted their career journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <Card key={t.name} variant="light" className="glow-card p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-bold text-lg text-brand-primary">{t.name}</span>
                    <Badge variant="gold">{t.gap}</Badge>
                  </div>
                  <p className="text-sm italic text-brand-dark/80 leading-relaxed mb-6">
                    "{t.text}"
                  </p>
                </div>
                <div className="border-t border-brand-bgLight pt-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">{t.role}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 mb-8">
          Partnering Corporates Open to Career Breaks
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-75">
          {partners.map((partner) => (
            <div 
              key={partner} 
              className="py-3 px-6 rounded-2xl bg-white border border-brand-bgLight/80 text-brand-primary font-serif font-bold text-xl tracking-wider shadow-sm hover:scale-[1.05] transition-all cursor-pointer"
            >
              {partner}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
