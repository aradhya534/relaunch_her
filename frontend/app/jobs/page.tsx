'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Search, MapPin, Briefcase, Award, CheckCircle, SlidersHorizontal, Loader2 } from 'lucide-react';
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

      // Build query string
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
      
      // Update local state to show applied
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-serif text-brand-primary">Job Match Board</h1>
        <p className="text-sm text-brand-dark/50 mt-1">Direct algorithmic-bypass jobs with returner-friendly onboarding support.</p>
      </div>

      {/* Filter panel */}
      <Card variant="light" className="glow-card p-6 mb-8">
        <div className="flex items-center space-x-2 mb-4 text-brand-primary font-bold text-sm border-b border-brand-bgLight pb-3">
          <SlidersHorizontal className="w-4 h-4 text-brand-accent" />
          <span>Search Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Role Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/50">Role Title</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-brand-dark/30" />
              <input
                type="text"
                placeholder="Software Engineer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-brand-bgLight/30 border border-brand-bgLight text-brand-dark rounded-xl text-xs focus:border-brand-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Company Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/50">Company Name</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-brand-dark/30" />
              <input
                type="text"
                placeholder="WSO2, Dialog..."
                value={companyTerm}
                onChange={(e) => setCompanyTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-brand-bgLight/30 border border-brand-bgLight text-brand-dark rounded-xl text-xs focus:border-brand-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Work Type Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/50">Arrangement</label>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full p-2.5 bg-brand-bgLight/30 border border-brand-bgLight text-brand-dark rounded-xl text-xs focus:border-brand-accent focus:outline-none"
            >
              <option value="">All Arrangements</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">Onsite</option>
            </select>
          </div>

          {/* Skill Tag Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/50">Core Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full p-2.5 bg-brand-bgLight/30 border border-brand-bgLight text-brand-dark rounded-xl text-xs focus:border-brand-accent focus:outline-none"
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
        <Card variant="light" className="text-center p-12 max-w-md mx-auto">
          <Briefcase className="w-12 h-12 text-brand-primary/25 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-brand-primary">No Matching Jobs Found</h3>
          <p className="text-xs text-brand-dark/50 mt-1">Try widening your filters or selecting other skill tags.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => {
            const initial = job.companyName.substring(0, 2).toUpperCase();
            return (
              <Card key={job.id} variant="light" className="glow-card flex flex-col justify-between p-6">
                <div>
                  {/* Top Line: Company and Badges */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      {/* Logo Placeholder */}
                      <div className="h-12 w-12 rounded-xl bg-brand-primary text-brand-accent flex items-center justify-center font-bold text-sm border border-brand-accent/10 shadow-sm shrink-0">
                        {initial}
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-primary text-sm leading-tight">{job.title}</h4>
                        <p className="text-xs text-brand-dark/50 mt-0.5">{job.companyName}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1.5 shrink-0">
                      <Badge variant="gold">{job.matchScore}% Match</Badge>
                      <Badge variant="teal" className="flex items-center space-x-1 py-0.5">
                        <CheckCircle className="w-3 h-3 fill-brand-accent text-brand-dark" />
                        <span>Verified</span>
                      </Badge>
                    </div>
                  </div>

                  {/* Body: Location, Salary, Description */}
                  <div className="space-y-2.5 mb-6">
                    <div className="flex items-center space-x-4 text-xs text-brand-dark/60">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-dark/40" />
                        <span>{job.workType}</span>
                      </span>
                      <span className="text-brand-dark/20">|</span>
                      <span>LKR {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} / mo</span>
                    </div>
                    <p className="text-xs text-brand-dark/70 leading-relaxed line-clamp-3">
                      {job.description}
                    </p>
                  </div>
                </div>

                {/* Bottom line: Skills tags & CTA button */}
                <div className="border-t border-brand-bgLight pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((skill: string) => (
                      <span key={skill} className="px-2.5 py-0.5 bg-brand-bgLight/40 border border-brand-bgLight text-[10px] font-bold rounded-lg text-brand-primary">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant={job.hasApplied ? 'secondary' : 'primary'}
                    size="sm"
                    disabled={job.hasApplied}
                    onClick={() => handleApply(job.id)}
                    className="w-full sm:w-auto text-xs py-2 px-4 shrink-0"
                  >
                    {job.hasApplied ? (
                      job.applicationStatus === 'SHORTLISTED' ? 'Shortlisted ✓' : 'Applied ✓'
                    ) : (
                      'Apply Now'
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
