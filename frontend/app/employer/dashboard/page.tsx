'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Plus, Check, Eye, Users, FileCheck, Layers, FileDown, Power, ToggleLeft, ToggleRight, X, AlertCircle } from 'lucide-react';
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

      // 1. Fetch stats
      const statsRes = await fetch(`${apiURL}/jobs/employer/stats`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 2. Fetch jobs
      const jobsRes = await fetch(`${apiURL}/jobs/employer`, { headers });
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      }

      // 3. Fetch applicants
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
      fetchDashboardData(); // Refresh metrics
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
      
      // Close profile modal if open
      setSelectedApplicant(null);
      
      // Refresh metrics
      fetchDashboardData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error updating application status.');
    }
  };

  if (isLoading) {
    return <EmployerSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold font-serif text-brand-primary">Employer Control Panel</h1>
          <p className="text-sm text-brand-dark/50 mt-1">Review candidates and post open listings.</p>
        </div>
        <Link href="/employer/post-job">
          <Button variant="primary" className="flex items-center space-x-2 shrink-0">
            <Plus className="w-4.5 h-4.5" />
            <span>Post a Job</span>
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card variant="light" className="glow-card flex items-center space-x-4 p-6 bg-white">
          <div className="h-12 w-12 rounded-2xl bg-brand-primary/5 text-brand-primary flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-brand-primary">{stats.activeListings}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/40">Active Listings</div>
          </div>
        </Card>

        <Card variant="light" className="glow-card flex items-center space-x-4 p-6 bg-white">
          <div className="h-12 w-12 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-brand-primary">{stats.totalApplicants}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/40">Total Applicants</div>
          </div>
        </Card>

        <Card variant="light" className="glow-card flex items-center space-x-4 p-6 bg-white">
          <div className="h-12 w-12 rounded-2xl bg-brand-highlight/10 text-brand-highlight flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-brand-primary">{stats.placementsMade}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/40">Shortlisted Candidates</div>
          </div>
        </Card>
      </div>

      {/* Listed Jobs Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold font-serif text-brand-primary mb-4">Your Listings</h2>
          {jobs.length === 0 ? (
            <Card variant="light" className="text-center p-8 bg-white border border-brand-bgLight/40">
              <p className="text-xs text-brand-dark/40">No active job listings.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} variant="light" className="glow-card p-5 bg-white border border-brand-bgLight/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-brand-primary text-xs leading-snug max-w-[150px]">{job.title}</h4>
                    <button
                      onClick={() => handleToggleJobStatus(job.id, job.isActive)}
                      className={`text-xs p-1 rounded transition-colors ${
                        job.isActive ? 'text-brand-accent hover:opacity-85' : 'text-brand-dark/30 hover:text-brand-dark/60'
                      }`}
                      title={job.isActive ? 'Pause Job' : 'Activate Job'}
                    >
                      {job.isActive ? (
                        <ToggleRight className="w-8 h-8" />
                      ) : (
                        <ToggleLeft className="w-8 h-8" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-brand-dark/40 font-bold border-t border-brand-bgLight pt-3 mt-3">
                    <span>{job.applicantCount} Applicants</span>
                    <Badge variant={job.isActive ? 'teal' : 'gray'}>
                      {job.isActive ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Applicants reviews Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold font-serif text-brand-primary mb-4">Applicants Feed</h2>
          {applicants.length === 0 ? (
            <Card variant="light" className="text-center p-12 bg-white border border-brand-bgLight/60">
              <Users className="w-12 h-12 text-brand-primary/15 mx-auto mb-4" />
              <h3 className="font-bold text-brand-primary">No Applications Yet</h3>
              <p className="text-xs text-brand-dark/50 mt-1">Candidates matching your criteria will appear here.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {applicants.map((app) => (
                <Card key={app.id} variant="light" className="glow-card p-6 bg-white border border-brand-bgLight/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-brand-primary">{app.applicantName}</span>
                      <Badge variant="gold">{app.skillsMatchScore}% Match</Badge>
                    </div>
                    <div className="text-xs text-brand-dark/60 leading-tight">
                      Applied for: <strong>{app.jobTitle}</strong> &middot; Gap: <strong>{app.gapYears} Years</strong>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {app.skills.slice(0, 3).map((skill: string) => (
                        <span key={skill} className="px-2 py-0.5 bg-brand-bgLight/40 border border-brand-bgLight text-[9px] font-bold rounded text-brand-primary">
                          {skill}
                        </span>
                      ))}
                      {app.skills.length > 3 && <span className="text-[9px] font-bold text-brand-dark/40 mt-1">+{app.skills.length - 3} more</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    <Badge variant={app.status === 'SHORTLISTED' ? 'teal' : app.status === 'REVIEWING' ? 'gold' : 'gray'}>
                      {app.status}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => setSelectedApplicant(app)} className="text-xs flex items-center space-x-1 py-1.5 px-3">
                      <Eye className="w-4 h-4" />
                      <span>View Profile</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Profile Viewer */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="light" className="w-full max-w-xl p-8 bg-white max-h-[90vh] overflow-y-auto relative animate-in fade-in-50 zoom-in-95">
            <button
              onClick={() => setSelectedApplicant(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-brand-bgLight text-brand-dark/50 hover:text-brand-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Content */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-2xl font-bold font-serif text-brand-primary">{selectedApplicant.applicantName}</h3>
                <Badge variant="gold">{selectedApplicant.skillsMatchScore}% Match</Badge>
              </div>
              <p className="text-xs text-brand-dark/50">{selectedApplicant.applicantEmail}</p>
            </div>

            <div className="space-y-5 border-t border-brand-bgLight pt-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-bgLight/20 p-3 rounded-xl border border-brand-bgLight/40">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/40">Career Break Duration</p>
                  <p className="text-sm font-bold text-brand-primary mt-0.5">{selectedApplicant.gapYears} Years</p>
                </div>
                <div className="bg-brand-bgLight/20 p-3 rounded-xl border border-brand-bgLight/40">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/40">Gap Reason</p>
                  <p className="text-xs font-bold text-brand-primary mt-0.5">{selectedApplicant.gapReason}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/40 mb-1.5">Confirmed Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApplicant.skills.map((skill: string) => (
                    <Badge key={skill} variant="indigo">{skill}</Badge>
                  ))}
                </div>
              </div>

              {selectedApplicant.cvUrl && (
                <div className="p-4 rounded-xl border border-brand-bgLight bg-brand-bgLight/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileCheck className="w-5 h-5 text-brand-accent" />
                    <div>
                      <p className="text-xs font-bold text-brand-primary">Curriculum Vitae (CV)</p>
                      <p className="text-[10px] text-brand-dark/40">Uploaded PDF Document</p>
                    </div>
                  </div>
                  
                  {/* Download CV link */}
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${selectedApplicant.cvUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 py-1.5 px-3 rounded-lg border border-brand-accent/30 text-brand-accent hover:bg-brand-accent hover:text-brand-dark text-xs font-bold transition-all"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              )}

              {/* Status Update Actions */}
              <div className="border-t border-brand-bgLight pt-5 flex items-center justify-between gap-4">
                <span className="text-xs text-brand-dark/40 font-bold">Current State: <strong className="text-brand-primary">{selectedApplicant.status}</strong></span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateApplicantStatus(selectedApplicant.id, 'REVIEWING')}
                    className="text-xs text-brand-primary hover:bg-brand-bgLight py-1.5 px-3"
                  >
                    Mark Reviewing
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateApplicantStatus(selectedApplicant.id, 'SHORTLISTED')}
                    className="text-xs py-1.5 px-3"
                  >
                    Shortlist Candidate
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function EmployerSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="flex justify-between items-center mb-10">
        <div className="h-10 w-64 bg-brand-primary/10 rounded-xl" />
        <div className="h-10 w-32 bg-brand-primary/10 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="h-24 bg-white rounded-2xl border border-brand-bgLight/40" />
        <div className="h-24 bg-white rounded-2xl border border-brand-bgLight/40" />
        <div className="h-24 bg-white rounded-2xl border border-brand-bgLight/40" />
      </div>
    </div>
  );
}
