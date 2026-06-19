'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Search, MapPin, Briefcase, Award, CheckCircle, SlidersHorizontal, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function JobBoardPage() {
  const { data: session } = useSession();

  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [companyTerm, setCompanyTerm] = useState('');
  const [workType, setWorkType] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const skillFilterOptions = [
    'Frontend',
    'Backend',
    'DevOps',
    'AI/ML',
    'Product Management',
    'QA',
    'Data',
    'Cloud',
  ];

  useEffect(() => {
    if (session) {
      fetchJobs();
    }
  }, [session, searchTerm, companyTerm, workType, selectedSkill]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = (session as any)?.user?.accessToken;

      const params = new URLSearchParams();
      if (searchTerm) params.append('title', searchTerm);
      if (companyTerm) params.append('company', companyTerm);
      if (workType) params.append('workType', workType);
      if (selectedSkill) params.append('skills', selectedSkill);

      const response = await fetch(`${apiURL}/jobs?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to retrieve jobs list.');
      }

      setJobs(data);
    } catch (err: any) {
      console.error(err);
      toast.error('Error fetching jobs board.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = (session as any)?.user?.accessToken;

      const response = await fetch(`${apiURL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      toast.success('Application submitted successfully! Bypassed algorithm filters.');
      
      setJobs((prev) =>
        prev.map((job) => {
          if (job.id === jobId) {
            return { ...job, hasApplied: true, applicationStatus: 'APPLIED' };
          }
          return job;
        })
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error submitting job application.');
    }
  };

  // Stagger load settings
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Title */}
      <div className="mb-10 border-b border-brand-bgLight/40 pb-6">
        <h1 className="text-3xl font-serif font-black text-brand-primary">Job Match Board</h1>
        <p className="text-xs text-brand-dark/50 mt-1">Direct algorithmic-bypass job listings with dedicated returner onboarding frameworks.</p>
      </div>

      {/* Filter panel */}
      <Card variant="light" className="glow-card p-6 mb-8 bg-white border border-brand-bgLight/40 rounded-3xl">
        <div className="flex items-center space-x-2 mb-4 text-brand-primary font-black text-xs border-b border-brand-bgLight/40 pb-3">
          <SlidersHorizontal className="w-4 h-4 text-brand-accent animate-pulse" />
          <span className="uppercase tracking-wider">Search Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Role Filter */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-black tracking-widest text-brand-dark/45">Role Title</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-dark/30" />
              <input
                type="text"
                placeholder="Software Engineer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-brand-bgLight/20 border border-brand-bgLight text-brand-dark rounded-xl text-xs font-semibold focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/10"
              />
            </div>
          </div>

          {/* Company Filter */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-black tracking-widest text-brand-dark/45">Company Name</label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-dark/30" />
              <input
                type="text"
                placeholder="WSO2, Dialog..."
                value={companyTerm}
                onChange={(e) => setCompanyTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-brand-bgLight/20 border border-brand-bgLight text-brand-dark rounded-xl text-xs font-semibold focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/10"
              />
            </div>
          </div>

          {/* Work Type Filter */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-black tracking-widest text-brand-dark/45">Arrangement</label>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full p-2.5 bg-brand-bgLight/20 border border-brand-bgLight text-brand-dark rounded-xl text-xs font-semibold focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/10"
            >
              <option value="">All Arrangements</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">Onsite</option>
            </select>
          </div>

          {/* Skill Tag Filter */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-black tracking-widest text-brand-dark/45">Core Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full p-2.5 bg-brand-bgLight/20 border border-brand-bgLight text-brand-dark rounded-xl text-xs font-semibold focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/10"
            >
              <option value="">All Skills</option>
              {skillFilterOptions.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Jobs list grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <Card variant="light" className="text-center p-12 max-w-md mx-auto bg-white rounded-3xl border border-brand-bgLight/40">
          <Briefcase className="w-10 h-10 text-brand-primary/20 mx-auto mb-4" />
          <h3 className="font-bold text-brand-primary text-base">No Matching Jobs</h3>
          <p className="text-xs text-brand-dark/50 mt-1 font-medium">Try broadening your search query or selecting other skills.</p>
        </Card>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {jobs.map((job) => {
            const initial = job.companyName.substring(0, 2).toUpperCase();
            return (
              <motion.div key={job.id} variants={itemVariants}>
                <Card variant="light" className="glow-card flex flex-col justify-between p-6 bg-white border border-brand-bgLight/40 rounded-3xl h-full">
                  <div>
                    {/* Top Line: Company and Badges */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-11 w-11 rounded-xl bg-brand-primary text-brand-accent flex items-center justify-center font-bold text-sm border border-brand-accent/10 shadow-sm shrink-0">
                          {initial}
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-primary text-sm leading-tight">{job.title}</h4>
                          <p className="text-xs text-brand-dark/50 mt-0.5 font-medium">{job.companyName}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-1 shrink-0">
                        <Badge variant="gold" className="py-0.5 px-2.5 rounded-lg border border-brand-highlight/25 bg-brand-highlight/10 text-xs font-bold">{job.matchScore}% Match</Badge>
                        <Badge variant="teal" className="flex items-center space-x-1 py-0.5 px-2 border border-brand-accent/20 bg-brand-accent/10 text-[9px] font-black uppercase tracking-wider">
                          <CheckCircle className="w-2.5 h-2.5 fill-brand-accent text-brand-dark" />
                          <span>Verified</span>
                        </Badge>
                      </div>
                    </div>

                    {/* Body: Location, Salary, Description */}
                    <div className="space-y-2.5 mb-6">
                      <div className="flex items-center space-x-3 text-xs text-brand-dark/60 font-semibold">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-dark/40" />
                          <span>{job.workType}</span>
                        </span>
                        <span className="text-brand-dark/20">|</span>
                        <span>LKR {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} / mo</span>
                      </div>
                      <p className="text-xs text-brand-dark/70 leading-relaxed line-clamp-3 font-medium">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom line: Skills tags & CTA button */}
                  <div className="border-t border-brand-bgLight pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.map((skill: string) => (
                        <span key={skill} className="px-2.5 py-0.5 bg-brand-bgLight/30 border border-brand-bgLight/60 text-[9px] font-black uppercase tracking-wider rounded-lg text-brand-primary">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <Button
                      variant={job.hasApplied ? 'secondary' : 'primary'}
                      size="sm"
                      disabled={job.hasApplied}
                      onClick={() => handleApply(job.id)}
                      className="w-full sm:w-auto text-xs py-2 px-4 shrink-0 font-bold rounded-xl"
                    >
                      {job.hasApplied ? (
                        job.applicationStatus === 'SHORTLISTED' ? 'Shortlisted ✓' : 'Applied ✓'
                      ) : (
                        <span className="flex items-center space-x-1">
                          <span>Apply Now</span>
                          <Sparkles className="w-3 h-3 text-brand-dark animate-pulse" />
                        </span>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
