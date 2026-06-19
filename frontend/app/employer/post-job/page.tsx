'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, MapPin, Briefcase, Eye, Cpu, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function PostJobPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workType, setWorkType] = useState('HYBRID');
  const [salaryMin, setSalaryMin] = useState('150000');
  const [salaryMax, setSalaryMax] = useState('250000');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableSkills = [
    'Frontend',
    'Backend',
    'DevOps',
    'AI/ML',
    'Product Management',
    'QA',
    'Data',
    'Cloud',
  ];

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !salaryMin || !salaryMax || selectedSkills.length === 0) {
      toast.error('Please fill in all fields and select at least one skill.');
      return;
    }

    setIsLoading(true);
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = (session as any)?.user?.accessToken;

      const response = await fetch(`${apiURL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          skills: selectedSkills,
          workType,
          salaryMin: parseInt(salaryMin, 10),
          salaryMax: parseInt(salaryMax, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post job listing.');
      }

      toast.success('Job listing published successfully!');
      router.push('/employer/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error publishing job listing.');
    } finally {
      setIsLoading(false);
    }
  };

  const companyName = session?.user?.name?.replace(' Hiring Manager', '').replace(' Careers', '').replace(' Global Recruiter', '').replace(' Recruiting', '').replace(' HR', '') || 'WSO2';
  const logoInitials = companyName.substring(0, 2).toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Back button */}
      <button
        onClick={() => router.push('/employer/dashboard')}
        className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-dark/50 hover:text-brand-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Control Panel</span>
      </button>

      <div className="mb-10 border-b border-brand-bgLight/40 pb-6">
        <h1 className="text-3xl font-serif font-black text-brand-primary">Create Job Listing</h1>
        <p className="text-xs text-brand-dark/50 mt-1">Publish returner-friendly jobs that bypass screening algorithms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <Card variant="light" className="glow-card p-6 bg-white border border-brand-bgLight/40 rounded-3xl space-y-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-brand-dark/40 border-b border-brand-bgLight/40 pb-3 mb-2 flex items-center space-x-1">
              <span>Job Details Form</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/65">Job Role / Title</label>
              <input
                type="text"
                placeholder="Senior Backend Engineer (NodeJS/AWS)..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-brand-bgLight/20 border border-brand-bgLight text-brand-dark rounded-xl text-xs font-semibold focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/10"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/65">Work Arrangement</label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full p-3 bg-brand-bgLight/20 border border-brand-bgLight text-brand-dark rounded-xl text-xs font-semibold focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/10"
                  disabled={isLoading}
                >
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">Onsite</option>
                </select>
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/65">Skills Parameters</label>
                <span className="text-[9px] text-brand-dark/40 font-semibold block mt-1">Select one or more categories</span>
              </div>
            </div>

            {/* Select tags */}
            <div className="flex flex-wrap gap-2 p-3 bg-brand-bgLight/15 rounded-2xl border border-brand-bgLight/40">
              {availableSkills.map((skill) => {
                const selected = selectedSkills.includes(skill);
                return (
                  <motion.button
                    key={skill}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToggleSkill(skill)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border ${
                      selected
                        ? 'bg-brand-primary border-brand-primary text-brand-bgLight shadow-sm'
                        : 'bg-white border-brand-bgLight text-brand-dark/60 hover:bg-brand-bgLight/30'
                    }`}
                  >
                    {skill}
                  </motion.button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/65">Min Monthly Salary (LKR)</label>
                <input
                  type="number"
                  placeholder="150000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full p-3 bg-brand-bgLight/20 border border-brand-bgLight text-brand-dark rounded-xl text-xs font-semibold focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/10"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/65">Max Monthly Salary (LKR)</label>
                <input
                  type="number"
                  placeholder="250000"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full p-3 bg-brand-bgLight/20 border border-brand-bgLight text-brand-dark rounded-xl text-xs font-semibold focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/65">Job Description</label>
              <textarea
                placeholder="Include key responsibilities, required skills, gap parameters, and expected support onboarding details..."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-brand-bgLight/20 border border-brand-bgLight text-brand-dark rounded-xl text-xs font-semibold focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/10 leading-relaxed"
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-brand-bgLight/40">
              <Button variant="primary" size="md" type="submit" disabled={isLoading} className="flex items-center space-x-1.5 px-6 py-3 rounded-xl font-bold bg-brand-accent text-brand-dark shadow-md shadow-brand-accent/15">
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Publishing...' : 'Publish Listing'}</span>
              </Button>
            </div>
          </Card>
        </form>

        {/* Right Column: Live Board Preview */}
        <div className="lg:col-span-5 space-y-4 sticky top-28">
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-brand-dark/40 pl-2">
            <Eye className="w-4 h-4 text-brand-primary" />
            <span>Live Card Preview</span>
          </div>

          <motion.div 
            layout
            className="w-full"
          >
            <Card variant="light" className="glow-card flex flex-col justify-between p-6 bg-white border border-brand-bgLight/40 rounded-3xl relative min-h-[300px]">
              <div>
                {/* Card top bar */}
                <div className="flex items-start justify-between gap-4 mb-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="h-11 w-11 rounded-xl bg-brand-primary text-brand-accent flex items-center justify-center font-bold text-sm border border-brand-accent/10 shadow-sm shrink-0">
                      {logoInitials}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-primary text-sm leading-tight">
                        {title || 'Senior Software Engineer...'}
                      </h4>
                      <p className="text-xs text-brand-dark/50 mt-0.5 font-medium">{companyName}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1 shrink-0">
                    <Badge variant="gold" className="py-0.5 px-2 text-[10px] font-bold border border-brand-highlight/25 bg-brand-highlight/10">88% Match</Badge>
                    <Badge variant="teal" className="flex items-center space-x-1 py-0.5 px-2 border border-brand-accent/20 bg-brand-accent/10 text-[9px] font-black uppercase tracking-wider">
                      <CheckCircle className="w-2.5 h-2.5 fill-brand-accent text-brand-dark" />
                      <span>Verified</span>
                    </Badge>
                  </div>
                </div>

                {/* Card body */}
                <div className="space-y-2.5 mb-6 text-left">
                  <div className="flex items-center space-x-3 text-xs text-brand-dark/60 font-semibold">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-dark/40" />
                      <span>{workType}</span>
                    </span>
                    <span className="text-brand-dark/20">|</span>
                    <span>LKR {parseInt(salaryMin || '0').toLocaleString()} - {parseInt(salaryMax || '0').toLocaleString()} / mo</span>
                  </div>
                  <p className="text-xs text-brand-dark/70 leading-relaxed line-clamp-4 min-h-[64px] font-medium bg-brand-bgLight/5 p-3 rounded-2xl border border-brand-bgLight/30">
                    {description || 'Type a job description in the form to see how it will preview live to returning candidates.'}
                  </p>
                </div>
              </div>

              {/* Card footer */}
              <div className="border-t border-brand-bgLight/40 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
                <div className="flex flex-wrap gap-1">
                  {selectedSkills.length === 0 ? (
                    <span className="px-2.5 py-0.5 bg-brand-bgLight/30 border border-brand-bgLight text-[9px] font-black uppercase tracking-wider rounded text-brand-primary/30">
                      No Skills Selected
                    </span>
                  ) : (
                    selectedSkills.map((skill) => (
                      <span key={skill} className="px-2.5 py-0.5 bg-brand-bgLight/30 border border-brand-bgLight text-[9px] font-black uppercase tracking-wider rounded text-brand-primary">
                        {skill}
                      </span>
                    ))
                  )}
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto text-xs py-1.5 px-4 cursor-default opacity-80 rounded-xl font-bold"
                  disabled
                >
                  <span className="flex items-center space-x-1">
                    <span>Apply Now</span>
                    <Sparkles className="w-3 h-3 text-brand-dark animate-pulse" />
                  </span>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
