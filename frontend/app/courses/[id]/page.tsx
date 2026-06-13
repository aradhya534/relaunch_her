'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Play, CheckSquare, Square, ChevronRight, BookOpen, ArrowLeft, Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (session) {
      fetchCourseDetails();
    }
  }, [session, courseId]);

  const fetchCourseDetails = async () => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = (session as any)?.user?.accessToken;

      const response = await fetch(`${apiURL}/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch course details.');
      }

      setCourse(data);
      
      // Select first incomplete module if available, otherwise first module
      const firstIncomplete = data.modules.findIndex((m: any) => !m.completed);
      if (firstIncomplete !== -1) {
        setActiveModuleIndex(firstIncomplete);
      } else {
        setActiveModuleIndex(0);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error loading course material.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleModule = async (moduleId: string, currentStatus: boolean, isMainAction: boolean = false) => {
    setIsUpdating(true);
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = (session as any)?.user?.accessToken;

      const response = await fetch(`${apiURL}/courses/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          moduleId,
          completed: !currentStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update progress.');
      }

      // Update local state
      setCourse((prev: any) => {
        const updatedModules = prev.modules.map((m: any) => {
          if (m.id === moduleId) {
            return { ...m, completed: !currentStatus };
          }
          return m;
        });

        return {
          ...prev,
          modules: updatedModules,
          progressPercentage: data.progressPercentage,
        };
      });

      if (!currentStatus) {
        toast.success('Module marked as completed!');
        
        // If completed from the main big button, automatically advance to next module
        if (isMainAction && activeModuleIndex < course.modules.length - 1) {
          setActiveModuleIndex((prev) => prev + 1);
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Could not save your progress.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!course || !course.modules || course.modules.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h3 className="text-xl font-bold text-brand-primary">Course not found</h3>
        <Link href="/dashboard" className="text-xs text-brand-accent mt-2 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  const activeModule = course.modules[activeModuleIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header Row */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center space-x-2 text-xs font-semibold text-brand-dark/50 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center space-x-3">
          <Badge variant="indigo">{course.level}</Badge>
          <span className="text-xs font-bold text-brand-dark/40">{course.duration}</span>
        </div>
      </div>

      {/* Course Title and Global Progress Bar */}
      <div className="mb-8 bg-white rounded-2xl p-6 border border-brand-bgLight/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-brand-primary">{course.title}</h1>
          <span className="text-sm font-bold text-brand-primary">{course.progressPercentage}% Complete</span>
        </div>
        
        {/* Progress bar container */}
        <div className="w-full bg-brand-bgLight rounded-full h-3.5 overflow-hidden">
          <div
            className="bg-brand-accent h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${course.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Course split Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar: Modules checkboxes */}
        <aside className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
          <Card variant="light" className="glow-card p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark/40 mb-4 flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Syllabus modules</span>
            </h3>

            <div className="space-y-2">
              {course.modules.map((mod: any, index: number) => {
                const isActive = index === activeModuleIndex;
                return (
                  <div
                    key={mod.id}
                    onClick={() => setActiveModuleIndex(index)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      isActive
                        ? 'bg-brand-primary text-brand-bgLight border-brand-primary font-bold shadow'
                        : 'bg-brand-bgLight/10 border-brand-bgLight hover:bg-brand-bgLight/40'
                    }`}
                  >
                    {/* Toggle checkmark */}
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleModule(mod.id, mod.completed);
                      }}
                      className="mt-0.5 text-brand-accent shrink-0 focus:outline-none"
                    >
                      {mod.completed ? (
                        <CheckSquare className="w-4.5 h-4.5 fill-brand-accent text-brand-dark" />
                      ) : (
                        <Square className={`w-4.5 h-4.5 ${isActive ? 'text-brand-bgLight/40' : 'text-brand-dark/30'}`} />
                      )}
                    </button>
                    <div className="text-xs text-left leading-snug">
                      {mod.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </aside>

        {/* Main Area: Video Player & Description content */}
        <main className="flex-grow order-1 lg:order-2 space-y-6">
          {/* Styled Video Player card */}
          <div className="relative aspect-video rounded-3xl bg-gradient-to-tr from-brand-primary to-brand-cardDark border border-brand-primary/20 shadow-xl overflow-hidden flex flex-col items-center justify-center text-center p-6 text-brand-bgLight">
            <div className="absolute inset-0 bg-black/10 z-0" />
            <button className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-brand-accent text-brand-dark flex items-center justify-center shadow-lg shadow-brand-accent/25 hover:scale-[1.05] transition-all relative z-10">
              <Play className="h-8 w-8 fill-brand-dark ml-1" />
            </button>
            <div className="mt-4 relative z-10">
              <p className="text-xs uppercase tracking-widest text-brand-accent font-bold">Now Playing</p>
              <h4 className="text-sm md:text-base font-semibold mt-1 opacity-90 max-w-md mx-auto">{activeModule.title}</h4>
            </div>
          </div>

          {/* Lesson Details and text */}
          <Card variant="light" className="glow-card p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-brand-bgLight">
              <div>
                <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">Module {activeModule.order} of {course.modules.length}</span>
                <h2 className="text-xl font-bold font-serif text-brand-primary mt-1">{activeModule.title}</h2>
              </div>
              
              {/* Mark Complete action */}
              <Button
                variant={activeModule.completed ? 'outline' : 'primary'}
                size="sm"
                onClick={() => handleToggleModule(activeModule.id, activeModule.completed, true)}
                disabled={isUpdating}
                className="w-full md:w-auto shrink-0 flex items-center justify-center space-x-1.5"
              >
                <span>{activeModule.completed ? 'Mark Incomplete' : 'Mark Complete & Continue'}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div>
              <h3 className="text-sm font-bold text-brand-primary mb-3">Lesson Description</h3>
              <p className="text-sm text-brand-dark/75 leading-relaxed bg-brand-bgLight/15 p-4 rounded-2xl border border-brand-bgLight/40">
                {activeModule.content}
              </p>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
