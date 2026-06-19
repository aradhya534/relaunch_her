'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Plus, Check, Eye, Users, FileCheck, Layers, FileDown, Power, ToggleLeft, ToggleRight, X, AlertCircle, Mail, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function EmployerDashboard() {
  const { data: session } = useSession();

  const [stats, setStats] = useState({ activeListings: 0, totalApplicants: 0, placementsMade: 0 });
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal View Profile State
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = (session as any)?.user?.accessToken;

      const headers = { Authorization: `Bearer ${token}` };

      const statsRes = await fetch(`${apiURL}/jobs/employer/stats`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      const jobsRes = await fetch(`${apiURL}/jobs/employer`, { headers });
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      }

      const appsRes = await fetch(`${apiURL}/applications`, { headers });
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplicants(appsData);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load employer dashboard metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = (session as any)?.user?.accessToken;

      const response = await fetch(`${apiURL}/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update job status.');
      }

      toast.success(`Job listing successfully ${!currentStatus ? 'activated' : 'paused'}.`);
      fetchDashboardData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error updating listing status.');
    }
  };

  const handleUpdateApplicantStatus = async (appId: string, newStatus: string) => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = (session as any)?.user?.accessToken;

      const response = await fetch(`${apiURL}/applications/${appId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update applicant status.');
      }

      toast.success(`Applicant marked as ${newStatus.toLowerCase()}!`);
      setSelectedApplicant(null);
      fetchDashboardData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error updating application status.');
    }
  };

  if (isLoading) {
    return <EmployerSkeleton />;
  }

  // Animation settings
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 border-b border-brand-bgLight/40 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-black text-brand-primary">Employer Control Panel</h1>
          <p className="text-xs text-brand-dark/50 mt-1">Review verifiably qualified candidates and manage algorithm-bypass listings.</p>
        </div>
        <Link href="/employer/post-job">
          <Button variant="primary" className="flex items-center space-x-2 shrink-0 text-brand-dark bg-brand-accent hover:opacity-95 rounded-xl py-3 px-5 font-bold shadow-md shadow-brand-accent/10">
            <Plus className="w-4.5 h-4.5" />
            <span>Post a Job</span>
          </Button>
        </Link>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card variant="light" className="glow-card flex items-center space-x-4 p-6 bg-white border border-brand-bgLight/40 rounded-3xl">
          <div className="h-12 w-12 rounded-2xl bg-brand-primary/5 text-brand-primary flex items-center justify-center shrink-0 border border-brand-primary/10">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-serif font-black text-brand-primary">{stats.activeListings}</div>
            <div className="text-[9px] uppercase font-black tracking-widest text-brand-dark/40 mt-0.5">Active Listings</div>
          </div>
        </Card>

        <Card variant="light" className="glow-card flex items-center space-x-4 p-6 bg-white border border-brand-bgLight/40 rounded-3xl">
          <div className="h-12 w-12 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center shrink-0 border border-brand-accent/25">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-serif font-black text-brand-primary">{stats.totalApplicants}</div>
            <div className="text-[9px] uppercase font-black tracking-widest text-brand-dark/40 mt-0.5">Total Applicants</div>
          </div>
        </Card>

        <Card variant="light" className="glow-card flex items-center space-x-4 p-6 bg-white border border-brand-bgLight/40 rounded-3xl">
          <div className="h-12 w-12 rounded-2xl bg-brand-highlight/10 text-brand-highlight flex items-center justify-center shrink-0 border border-brand-highlight/25">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-serif font-black text-brand-primary">{stats.placementsMade}</div>
            <div className="text-[9px] uppercase font-black tracking-widest text-brand-dark/40 mt-0.5">Shortlisted Candidates</div>
          </div>
        </Card>
      </motion.div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Listings */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
          <h2 className="text-lg font-bold font-serif text-brand-primary border-b border-brand-bgLight/40 pb-2 flex items-center space-x-2">
            <span>Your Listings</span>
          </h2>
          {jobs.length === 0 ? (
            <Card variant="light" className="text-center p-8 bg-white border border-brand-bgLight/40 rounded-3xl">
              <p className="text-xs text-brand-dark/40 font-medium">No active job listings.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} variant="light" className="glow-card p-5 bg-white border border-brand-bgLight/40 rounded-3xl font-semibold text-brand-primary">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="font-bold text-brand-primary text-xs leading-snug">{job.title}</h4>
                    <button
                      onClick={() => handleToggleJobStatus(job.id, job.isActive)}
                      className={`text-xs p-1 rounded-xl transition-colors shrink-0 ${
                        job.isActive ? 'text-brand-accent hover:opacity-85' : 'text-brand-dark/30 hover:text-brand-dark/60'
                      }`}
                      title={job.isActive ? 'Pause Job' : 'Activate Job'}
                    >
                      {job.isActive ? (
                        <ToggleRight className="w-7 h-7" />
                      ) : (
                        <ToggleLeft className="w-7 h-7" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-brand-dark/40 font-black uppercase tracking-widest border-t border-brand-bgLight/40 pt-3 mt-3">
                    <span>{job.applicantCount} Applicants</span>
                    <Badge variant={job.isActive ? 'teal' : 'gray'} className="py-0.5 px-2 rounded">
                      {job.isActive ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Column: Applicants feed */}
        <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
          <h2 className="text-lg font-bold font-serif text-brand-primary border-b border-brand-bgLight/40 pb-2">
            Applicants Feed
          </h2>
          {applicants.length === 0 ? (
            <Card variant="light" className="text-center p-12 bg-white border border-brand-bgLight/40 rounded-3xl">
              <Users className="w-10 h-10 text-brand-primary/15 mx-auto mb-4" />
              <h3 className="font-bold text-brand-primary text-base">No Applications Yet</h3>
              <p className="text-xs text-brand-dark/50 mt-1 font-medium">Candidates matching your criteria will appear here.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {applicants.map((app) => (
                <Card key={app.id} variant="light" className="glow-card p-6 bg-white border border-brand-bgLight/40 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-brand-primary">{app.applicantName}</span>
                      <Badge variant="gold" className="py-0.5 px-2 text-[10px] font-bold border border-brand-highlight/25 bg-brand-highlight/10">{app.skillsMatchScore}% Match</Badge>
                    </div>
                    <div className="text-xs text-brand-dark/50 font-semibold leading-tight">
                      Applied for: <span className="text-brand-primary font-bold">{app.jobTitle}</span> &middot; Gap: <span className="text-brand-primary font-bold">{app.gapYears} Yrs</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {app.skills.slice(0, 3).map((skill: string) => (
                        <span key={skill} className="px-2 py-0.5 bg-brand-bgLight/30 border border-brand-bgLight text-[9px] font-black uppercase tracking-wider rounded text-brand-primary">
                          {skill}
                        </span>
                      ))}
                      {app.skills.length > 3 && <span className="text-[9px] font-bold text-brand-dark/45 mt-1">+{app.skills.length - 3} more</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-end shrink-0">
                    <Badge variant={app.status === 'SHORTLISTED' ? 'teal' : app.status === 'REVIEWING' ? 'gold' : 'gray'} className="py-0.5 px-2.5 rounded text-[10px] uppercase font-black tracking-wider">
                      {app.status}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => setSelectedApplicant(app)} className="text-xs flex items-center space-x-1.5 py-1.5 px-3 border border-brand-primary/20 hover:bg-brand-primary hover:text-white font-bold rounded-xl">
                      <Eye className="w-4 h-4" />
                      <span>View Profile</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal Profile Viewer */}
      <AnimatePresence>
        {selectedApplicant && (
          <div className="fixed inset-0 z-50 bg-brand-dark/65 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl relative"
            >
              <Card variant="light" className="p-8 sm:p-10 bg-white max-h-[90vh] overflow-y-auto relative rounded-3xl border border-brand-bgLight/50 shadow-2xl">
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-brand-bgLight text-brand-dark/40 hover:text-brand-dark transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Profile Header */}
                <div className="mb-6 text-left">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-black font-serif text-brand-primary">{selectedApplicant.applicantName}</h3>
                    <Badge variant="gold" className="py-0.5 px-2 border border-brand-highlight/25 bg-brand-highlight/10 text-xs font-bold">{selectedApplicant.skillsMatchScore}% Match</Badge>
                  </div>
                  <p className="text-xs text-brand-dark/50 font-bold flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-brand-dark/30" />
                    <span>{selectedApplicant.applicantEmail}</span>
                  </p>
                </div>

                {/* Profile Details Container */}
                <div className="space-y-6 border-t border-brand-bgLight pt-6 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brand-bgLight/15 p-4 rounded-2xl border border-brand-bgLight/50 flex flex-col justify-between">
                      <p className="text-[9px] uppercase font-black tracking-widest text-brand-dark/40 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-brand-accent" />
                        <span>Career Break</span>
                      </p>
                      <p className="text-sm font-bold text-brand-primary mt-2">{selectedApplicant.gapYears} Years Duration</p>
                    </div>
                    
                    <div className="bg-brand-bgLight/15 p-4 rounded-2xl border border-brand-bgLight/50 flex flex-col justify-between">
                      <p className="text-[9px] uppercase font-black tracking-widest text-brand-dark/40 flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-brand-accent" />
                        <span>Primary Reason</span>
                      </p>
                      <p className="text-xs font-bold text-brand-primary mt-2 leading-snug">{selectedApplicant.gapReason}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[9px] uppercase font-black tracking-widest text-brand-dark/40">Verified Skills Checklist</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApplicant.skills.map((skill: string) => (
                        <Badge key={skill} variant="indigo" className="py-0.5 px-2.5 rounded-lg border border-brand-primary/10 bg-brand-primary/5 text-xs font-semibold">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  {selectedApplicant.cvUrl && (
                    <div className="p-4 rounded-2xl border border-brand-bgLight bg-brand-bgLight/15 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-3 text-left">
                        <div className="h-10 w-10 bg-brand-accent/10 border border-brand-accent/20 rounded-xl flex items-center justify-center text-brand-accent shrink-0 shadow-sm">
                          <FileCheck className="w-5 h-5 text-brand-accent animate-pulse" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-brand-primary">Curriculum Vitae (CV)</p>
                          <p className="text-[9px] text-brand-dark/40 font-semibold">Verified Candidate PDF Document</p>
                        </div>
                      </div>
                      
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${selectedApplicant.cvUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1.5 py-2 px-3 rounded-xl border border-brand-accent/30 text-brand-accent hover:bg-brand-accent hover:text-brand-dark text-xs font-bold transition-all shrink-0"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="border-t border-brand-bgLight pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                    <span className="text-[10px] text-brand-dark/40 font-black uppercase tracking-widest">
                      Status: <strong className="text-brand-primary">{selectedApplicant.status}</strong>
                    </span>
                    <div className="flex space-x-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateApplicantStatus(selectedApplicant.id, 'REVIEWING')}
                        className="w-full sm:w-auto text-xs text-brand-primary hover:bg-brand-bgLight border border-brand-primary/20 py-2.5 px-4 font-bold rounded-xl"
                      >
                        Mark Reviewing
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateApplicantStatus(selectedApplicant.id, 'SHORTLISTED')}
                        className="w-full sm:w-auto text-xs py-2.5 px-4 font-bold rounded-xl text-brand-dark bg-brand-accent shadow-md shadow-brand-accent/15"
                      >
                        Shortlist Candidate
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EmployerSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse text-left space-y-10">
      <div className="flex justify-between items-center border-b border-brand-primary/5 pb-6">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-brand-primary/10 rounded-xl" />
          <div className="h-4 w-48 bg-brand-primary/5 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-brand-primary/10 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-24 bg-white/40 rounded-3xl border border-brand-bgLight/30" />
        <div className="h-24 bg-white/40 rounded-3xl border border-brand-bgLight/30" />
        <div className="h-24 bg-white/40 rounded-3xl border border-brand-bgLight/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 h-96 bg-white/40 rounded-3xl border border-brand-bgLight/30" />
        <div className="lg:col-span-8 h-96 bg-white/40 rounded-3xl border border-brand-bgLight/30" />
      </div>
    </div>
  );
}
