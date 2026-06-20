'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Sparkles, BookOpen, User, Briefcase, ChevronRight, CheckCircle2, Award, Mail, ArrowUpRight, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // Determine if assessment is completed
  const hasAssessment = profile && profile.skillScore != null && profile.gapYears > 0;

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-bgLight/40 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-brand-primary">
            Welcome back, {session?.user?.name || 'Developer'} 👋
          </h1>
          <p className="text-xs text-brand-dark/50 mt-1">Ready to relaunch your tech career? Let's take the next step.</p>
        </div>
        
        {hasAssessment && (
          <div className="flex items-center space-x-2 bg-brand-primary/5 py-2 px-4 rounded-2xl border border-brand-primary/10">
            <Award className="w-4 h-4 text-brand-primary" />
            <span className="text-[10px] uppercase font-black tracking-widest text-brand-primary">Returner Member</span>
          </div>
        )}
      </motion.div>

      {!hasAssessment ? (
        /* Uncompleted Assessment Banner */
        <motion.div variants={itemVariants} className="mb-12">
          <div className="relative bg-white border border-brand-bgLight/80 rounded-3xl overflow-hidden shadow-sm">
            {/* Left accent stripe */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-primary to-brand-accent rounded-l-3xl" />

            <div className="pl-8 pr-6 py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Left: Icon + Text */}
              <div className="flex items-start space-x-5">
                <div className="h-12 w-12 rounded-2xl bg-brand-primary/8 border border-brand-primary/12 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] uppercase font-black tracking-widest text-brand-primary bg-brand-primary/8 border border-brand-primary/15 px-2.5 py-1 rounded-lg">
                      Action Required
                    </span>
                  </div>
                  <h3 className="text-lg font-black font-serif text-brand-dark leading-tight">
                    Complete Your Skills Assessment
                  </h3>
                  <p className="text-xs text-brand-dark/55 leading-relaxed font-medium max-w-lg">
                    Upload your CV, confirm your competencies, and specify your availability to unlock course recommendations and your job match index.
                  </p>

                  {/* Step mini-indicators */}
                  <div className="flex items-center space-x-3 pt-1">
                    {['Upload CV', 'Select Skills', 'Gap Details'].map((step, i) => (
                      <div key={step} className="flex items-center space-x-1">
                        <div className="h-4 w-4 rounded-full bg-brand-bgLight border border-brand-bgLight/80 flex items-center justify-center">
                          <span className="text-[8px] font-black text-brand-dark/40">{i + 1}</span>
                        </div>
                        <span className="text-[9px] font-semibold text-brand-dark/40">{step}</span>
                        {i < 2 && <div className="w-3 h-px bg-brand-bgLight/80" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: CTA Button */}
              <Link href="/assessment" className="shrink-0">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2.5 bg-brand-primary text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-brand-primary/20 hover:bg-brand-primary/90 transition-colors cursor-pointer"
                >
                  <span>Start Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Completed Assessment Bento Dashboard View */
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Circular Score Widget */}
          <div className="lg:col-span-4 h-full">
            <Card variant="light" className="glow-card flex flex-col items-center justify-center text-center p-8 bg-white border border-brand-bgLight/40 rounded-3xl h-full">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 mb-6">Skills Gap Score</h4>
              <div className="relative p-2 rounded-full bg-brand-bgLight/30 border border-brand-bgLight/60">
                <ProgressRing percentage={profile.skillScore} size={140} strokeWidth={10} color="#10B981" trailColor="#E2E8F0" textColor="#0F172A" />
              </div>
              <div className="mt-6 space-y-2">
                <Badge variant="teal" className="py-1 px-3.5 rounded-full border border-brand-accent/20 bg-brand-accent/10">Verifiably Match-Ready</Badge>
                <p className="text-xs text-brand-dark/50 mt-3 leading-relaxed max-w-xs font-medium">
                  You are currently {profile.skillScore}% ready for the Sri Lankan job board. Complete recommended courses below to cover the remaining gap!
                </p>
              </div>
            </Card>
          </div>

          {/* Jobs preview block */}
          <div className="lg:col-span-8 h-full">
            <Card variant="light" className="glow-card flex flex-col justify-between p-8 bg-white border border-brand-bgLight/40 rounded-3xl h-full">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-bgLight/40">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4.5 h-4.5 text-brand-primary" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Top Placement Matches</h4>
                  </div>
                  <Link href="/jobs" className="text-xs font-bold text-brand-accent hover:underline flex items-center space-x-1">
                    <span>View All Matches</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {jobs.map((job) => (
                    <motion.div 
                      key={job.id} 
                      whileHover={{ scale: 1.01 }}
                      className="p-4 rounded-2xl border border-brand-bgLight hover:border-brand-accent/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-brand-bgLight/10 hover:bg-brand-bgLight/20"
                    >
                      <div className="text-left">
                        <h5 className="font-bold text-sm text-brand-primary">{job.title}</h5>
                        <p className="text-xs text-brand-dark/50 mt-0.5 font-medium">{job.companyName} &middot; {job.workType}</p>
                      </div>
                      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                        <Badge variant="teal" className="py-1 px-3 border border-brand-accent/20 bg-brand-accent/10 text-xs font-bold">{job.matchScore}% Match</Badge>
                        <Link href="/jobs">
                          <Button variant="outline" size="sm" className="px-3.5 py-1.5 text-[10px] font-bold rounded-lg border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white">View Match</Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-brand-bgLight flex items-center justify-between text-xs text-brand-dark/50 font-medium">
                <span>Matching against: <strong className="text-brand-primary">{profile.skills.join(', ')}</strong></span>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Courses Catalog Section */}
      <motion.section variants={itemVariants} className="mb-12" id="courses">
        <div className="mb-6 flex items-center space-x-2 pb-2 border-b border-brand-bgLight/40">
          <BookOpen className="w-5 h-5 text-brand-primary" />
          <h2 className="text-xl font-bold font-serif text-brand-primary">Recommended Upskilling Paths</h2>
        </div>

        {courses.length === 0 ? (
          <Card variant="light" className="p-10 text-center bg-white border border-brand-bgLight/40 rounded-3xl">
            <BookOpen className="w-10 h-10 text-brand-primary/15 mx-auto mb-4" />
            <h3 className="font-bold text-brand-primary text-base mb-1">No Courses Loaded Yet</h3>
            <p className="text-xs text-brand-dark/50 max-w-xs mx-auto font-medium">
              Complete your skills assessment first. Our engine will then recommend tailored upskilling paths for your profile.
            </p>
            {!hasAssessment && (
              <Link href="/assessment" className="inline-block mt-4">
                <Button variant="primary" size="sm" className="text-xs px-5 py-2.5 font-bold bg-brand-accent text-brand-dark rounded-xl">
                  Start Assessment
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} variant="light" className="glow-card flex flex-col justify-between p-6 bg-white border border-brand-bgLight/40 rounded-3xl h-full">
                <div className="text-left space-y-3">
                  <Badge variant="indigo" className="text-[10px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-lg border border-brand-primary/20 bg-brand-primary/10">{course.level}</Badge>
                  <h3 className="text-lg font-bold font-serif text-brand-primary leading-snug">{course.title}</h3>
                  <p className="text-xs text-brand-dark/60 leading-relaxed font-medium line-clamp-3">{course.description}</p>
                </div>

                <div className="border-t border-brand-bgLight pt-4 flex items-center justify-between mt-6">
                  <span className="text-xs font-semibold text-brand-dark/40">{course.duration}</span>
                  <Link href={`/courses/${course.id}`}>
                    <Button variant="outline" size="sm" className="text-xs px-4 py-2 font-bold text-brand-accent border-brand-accent/30 hover:bg-brand-accent hover:text-brand-dark rounded-xl flex items-center space-x-1">
                      <span>Start Path</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </motion.section>

      {/* Mentor Match Section */}
      <motion.section variants={itemVariants}>
        <div className="mb-6 flex items-center space-x-2 pb-2 border-b border-brand-bgLight/40">
          <User className="w-5 h-5 text-brand-primary" />
          <h2 className="text-xl font-bold font-serif text-brand-primary">Your Dedicated Mentors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentors.map((mentor) => (
            <Card key={mentor.name} variant="light" className="glow-card p-6 bg-white border border-brand-bgLight/40 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4 text-left">
                <div className="h-14 w-14 rounded-2xl bg-brand-primary text-brand-accent flex items-center justify-center font-bold text-lg border border-brand-accent/20 shrink-0 shadow-inner">
                  {mentor.avatarText}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-brand-primary text-base leading-tight">{mentor.name}</h4>
                  <p className="text-xs text-brand-dark/50 font-medium">{mentor.title}</p>
                  <p className="text-[10px] text-brand-accent uppercase tracking-widest font-black">Specialty: {mentor.specialty}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleRequestIntro(mentor.name)} 
                className="text-xs font-bold px-4 py-2 text-brand-primary border-brand-primary/20 hover:bg-brand-primary hover:text-white rounded-xl shrink-0 w-full sm:w-auto flex items-center justify-center space-x-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Request Intro</span>
              </Button>
            </Card>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}

// Pulsing loading skeleton loader
function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse text-left space-y-10">
      <div className="border-b border-brand-primary/5 pb-6">
        <div className="h-10 w-64 bg-brand-primary/10 rounded-xl mb-3" />
        <div className="h-4 w-48 bg-brand-primary/5 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 h-80 bg-white/40 rounded-3xl border border-brand-bgLight/30" />
        <div className="lg:col-span-8 h-80 bg-white/40 rounded-3xl border border-brand-bgLight/30" />
      </div>

      <div>
        <div className="h-6 w-52 bg-brand-primary/10 rounded-lg mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-56 bg-white/40 rounded-3xl border border-brand-bgLight/30" />
          <div className="h-56 bg-white/40 rounded-3xl border border-brand-bgLight/30" />
          <div className="h-56 bg-white/40 rounded-3xl border border-brand-bgLight/30" />
        </div>
      </div>
    </div>
  );
}
