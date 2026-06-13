'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Sparkles, BookOpen, User, Briefcase, ChevronRight, UserCheck, CheckCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressRing from '@/components/ui/ProgressRing';

export default function ReturnerDashboard() {
  const router = useRouter();
  const { data: session } = useSession();

  const [profile, setProfile] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock Mentors for MVP
  const mentors = [
    {
      name: 'Narmada Wijerathne',
      title: 'Principal Architect at WSO2',
      specialty: 'Cloud Integrations & Java',
      avatarText: 'NW',
    },
    {
      name: 'Lakmini Fernando',
      title: 'Head of Products at Dialog',
      specialty: 'Agile Leadership & Fintech',
      avatarText: 'LF',
    },
  ];

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

      // Fetch profile
      const profileRes = await fetch(`${apiURL}/users/profile`, { headers });
      const profileData = await profileRes.json();
      
      if (profileRes.ok) {
        setProfile(profileData.profile);
      }

      // Fetch courses
      const coursesRes = await fetch(`${apiURL}/courses`, { headers });
      const coursesData = await coursesRes.json();
      if (coursesRes.ok) {
        setCourses(coursesData);
      }

      // Fetch jobs
      const jobsRes = await fetch(`${apiURL}/jobs`, { headers });
      const jobsData = await jobsRes.json();
      if (jobsRes.ok) {
        setJobs(jobsData.slice(0, 2)); // Limit preview to 2 jobs
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not retrieve dashboard metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestIntro = (mentorName: string) => {
    toast.success(`Introduction request sent to ${mentorName}! They will respond within 48 hours.`);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Determine if assessment is completed
  const hasAssessment = profile && profile.gapYears > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-brand-primary">
          Welcome back, {session?.user?.name || 'Developer'} 👋
        </h1>
        <p className="text-sm text-brand-dark/50 mt-1">Let's coordinate your transition back into technology.</p>
      </div>

      {!hasAssessment ? (
        /* Uncompleted Assessment Banner */
        <Card variant="dark" className="glow-card-dark bg-gradient-to-r from-brand-primary to-brand-cardDark text-brand-bgLight p-10 flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="max-w-xl mb-6 md:mb-0">
            <Badge variant="gold" className="mb-3">Action Required</Badge>
            <h3 className="text-2xl font-bold font-serif mb-2 text-white">Complete Your Skills Assessment</h3>
            <p className="text-sm text-brand-bgLight/85 leading-relaxed">
              Upload your CV, confirm your competencies, and specify your availability. This unlocks targeted course recommendations and displays your match index on the job placement board.
            </p>
          </div>
          <Link href="/assessment">
            <Button variant="primary" size="lg" className="flex items-center space-x-2">
              <span>Take Assessment</span>
              <ChevronRight className="w-4.5 h-4.5" />
            </Button>
          </Link>
        </Card>
      ) : (
        /* Completed Assessment Dashboard View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Circular Score Widget */}
          <Card variant="light" className="glow-card flex flex-col items-center justify-center text-center p-8 lg:col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-dark/40 mb-6">Skills Gap Score</h4>
            <ProgressRing percentage={profile.skillScore} size={150} strokeWidth={12} color="#00C9B1" trailColor="#F0EBF8" textColor="#2D1B69" />
            <div className="mt-6">
              <Badge variant="teal">Verifiably Match-Ready</Badge>
              <p className="text-xs text-brand-dark/50 mt-3 leading-relaxed max-w-xs">
                You are currently {profile.skillScore}% ready for the Sri Lankan job board. Complete recommended courses below to cover the remaining gap!
              </p>
            </div>
          </Card>

          {/* Jobs preview block */}
          <Card variant="light" className="glow-card lg:col-span-2 flex flex-col justify-between p-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-brand-dark/40">Top Placement Matches</h4>
                <Link href="/jobs" className="text-xs font-bold text-brand-accent hover:underline flex items-center space-x-1">
                  <span>View All Matches</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4 rounded-xl border border-brand-bgLight hover:border-brand-accent/30 transition-all flex items-center justify-between bg-brand-bgLight/10">
                    <div>
                      <h5 className="font-bold text-sm text-brand-primary">{job.title}</h5>
                      <p className="text-xs text-brand-dark/60 mt-0.5">{job.companyName} &middot; {job.workType}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="gold">{job.matchScore}% Match</Badge>
                      <Link href="/jobs">
                        <Button variant="outline" size="sm" className="px-3 py-1.5 text-xs">View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-bgLight flex items-center justify-between text-xs text-brand-dark/50">
              <span>Matching against: <strong>{profile.skills.join(', ')}</strong></span>
            </div>
          </Card>
        </div>
      )}

      {/* Courses Catalog Section */}
      <section className="mb-12" id="courses">
        <div className="mb-6 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-brand-primary" />
          <h2 className="text-2xl font-bold font-serif text-brand-primary">Recommended upskilling paths</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} variant="light" className="glow-card flex flex-col justify-between p-6">
              <div>
                <Badge variant="indigo" className="mb-3">{course.level}</Badge>
                <h3 className="text-lg font-bold font-serif text-brand-primary mb-2">{course.title}</h3>
                <p className="text-xs text-brand-dark/60 leading-relaxed mb-6">{course.description}</p>
              </div>

              <div className="border-t border-brand-bgLight pt-4 flex items-center justify-between mt-auto">
                <span className="text-xs font-semibold text-brand-dark/50">{course.duration}</span>
                <Link href={`/courses/${course.id}`}>
                  <Button variant="outline" size="sm" className="text-xs px-4 py-2">
                    Start Course
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Mentor Match Section */}
      <section>
        <div className="mb-6 flex items-center space-x-2">
          <User className="w-5 h-5 text-brand-primary" />
          <h2 className="text-2xl font-bold font-serif text-brand-primary">Your Dedicated Mentors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentors.map((mentor) => (
            <Card key={mentor.name} variant="light" className="glow-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-2xl bg-brand-primary text-brand-accent flex items-center justify-center font-bold text-lg border border-brand-accent/20">
                  {mentor.avatarText}
                </div>
                <div>
                  <h4 className="font-bold text-brand-primary text-base">{mentor.name}</h4>
                  <p className="text-xs text-brand-dark/50">{mentor.title}</p>
                  <p className="text-[10px] text-brand-accent uppercase tracking-wider font-bold mt-1">Specialty: {mentor.specialty}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleRequestIntro(mentor.name)} className="text-xs shrink-0">
                Request Intro
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

// Pulsing loading skeleton loader
function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-10 w-64 bg-brand-primary/10 rounded-xl mb-3" />
      <div className="h-4 w-48 bg-brand-primary/5 rounded-lg mb-10" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="h-80 bg-white rounded-2xl border border-brand-bgLight/40 p-8 flex flex-col items-center justify-center" />
        <div className="h-80 bg-white rounded-2xl border border-brand-bgLight/40 p-8 lg:col-span-2" />
      </div>

      <div className="h-6 w-52 bg-brand-primary/10 rounded-lg mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="h-48 bg-white rounded-2xl border border-brand-bgLight/40" />
        <div className="h-48 bg-white rounded-2xl border border-brand-bgLight/40" />
        <div className="h-48 bg-white rounded-2xl border border-brand-bgLight/40" />
      </div>
    </div>
  );
}
