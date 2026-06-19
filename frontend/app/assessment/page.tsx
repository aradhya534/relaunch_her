'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { FileUp, Award, Clock, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressRing from '@/components/ui/ProgressRing';

export default function AssessmentPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Multi-step tracking
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // -1 for back, 1 for forward
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [lastJobTitle, setLastJobTitle] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [gapYears, setGapYears] = useState('2');
  const [gapReason, setGapReason] = useState('Family (Maternity & Childcare)');
  const [availability, setAvailability] = useState('Full-time');

  // Results state
  const [score, setScore] = useState<number | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF documents are supported.');
        return;
      }
      setCvFile(file);
      toast.success(`Loaded: ${file.name}`);
    }
  };

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const nextStep = (target: number) => {
    setDirection(1);
    setStep(target);
  };

  const prevStep = (target: number) => {
    setDirection(-1);
    setStep(target);
  };

  const handleSubmit = async () => {
    if (selectedSkills.length === 0) {
      toast.error('Please select at least one skill.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      if (cvFile) {
        formData.append('cv', cvFile);
      }
      formData.append('lastJobTitle', lastJobTitle);
      formData.append('skills', JSON.stringify(selectedSkills));
      formData.append('gapYears', gapYears);
      formData.append('gapReason', gapReason);
      formData.append('availability', availability);

      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = (session as any)?.user?.accessToken;

      const response = await fetch(`${apiURL}/users/assessment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit assessment');
      }

      setScore(data.profile.skillScore);
      setDirection(1);
      setStep(4);
      toast.success('Assessment calculated successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error saving assessment details.');
    } finally {
      setIsLoading(false);
    }
  };

  const wizardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-left">
      {/* Visual Step Tracker */}
      {step < 4 && (
        <div className="flex items-center justify-center space-x-4 mb-10">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div 
                className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  step === num 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 ring-2 ring-brand-accent' 
                    : step > num 
                      ? 'bg-brand-accent text-brand-dark shadow-sm' 
                      : 'bg-white text-brand-dark/40 border border-brand-bgLight'
                }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div className="h-1.5 w-16 bg-brand-bgLight/60 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-accent transition-all duration-500"
                    style={{ width: step > num ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Steps Transition Container */}
      <div className="relative overflow-hidden min-h-[400px]">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={wizardVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Step 1: CV & Job Title */}
            {step === 1 && (
              <Card variant="light" className="glow-card p-8 bg-white border border-brand-bgLight/40 rounded-3xl">
                <div className="mb-6 space-y-1">
                  <Badge variant="indigo" className="text-[10px] font-black uppercase tracking-wider">Step 1</Badge>
                  <h2 className="text-2xl font-black font-serif text-brand-primary">Background Upload</h2>
                  <p className="text-xs text-brand-dark/50 font-medium">Upload your old CV to extract base metadata and select your last role.</p>
                </div>

                <div className="space-y-6">
                  {/* Styled Drag & Drop Zone */}
                  <div className="border-2 border-dashed border-brand-primary/10 rounded-2xl p-10 text-center bg-brand-bgLight/10 hover:border-brand-accent/50 hover:bg-brand-accent/5 transition-all duration-300 relative group">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FileUp className="w-10 h-10 text-brand-primary/40 group-hover:text-brand-accent group-hover:scale-110 transition-all mx-auto mb-4" />
                    <p className="text-xs font-bold text-brand-primary">
                      {cvFile ? cvFile.name : 'Click or Drag to upload your past CV (PDF)'}
                    </p>
                    <p className="text-[10px] text-brand-dark/40 mt-1.5 font-semibold">Maximum file size: 5MB</p>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/60">Last Job Title Held (Pre-Break)</label>
                    <select
                      value={lastJobTitle}
                      onChange={(e) => setLastJobTitle(e.target.value)}
                      className="w-full p-3 bg-white text-brand-dark rounded-xl border border-brand-bgLight focus:border-brand-accent focus:outline-none text-xs font-semibold focus:ring-1 focus:ring-brand-accent/20"
                    >
                      <option value="">-- Select Job Title --</option>
                      <option value="Associate Software Engineer">Associate Software Engineer</option>
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Senior Software Engineer">Senior Software Engineer</option>
                      <option value="QA Engineer">QA Engineer</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Systems Administrator">Systems Administrator</option>
                      <option value="Other">Other Tech Role</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-brand-bgLight/40">
                    <Button 
                      variant="primary" 
                      disabled={!lastJobTitle} 
                      onClick={() => nextStep(2)}
                      className="flex items-center space-x-2 px-6 text-xs py-3 rounded-xl font-bold bg-brand-accent text-brand-dark shadow-md shadow-brand-accent/10"
                    >
                      <span>Continue to Skills</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 2: Skill pills */}
            {step === 2 && (
              <Card variant="light" className="glow-card p-8 bg-white border border-brand-bgLight/40 rounded-3xl">
                <div className="mb-6 space-y-1">
                  <Badge variant="indigo" className="text-[10px] font-black uppercase tracking-wider">Step 2</Badge>
                  <h2 className="text-2xl font-black font-serif text-brand-primary">Core Competencies</h2>
                  <p className="text-xs text-brand-dark/50 font-medium">Select categories you worked with before or feel confident refreshing.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3 p-5 bg-brand-bgLight/10 rounded-2xl border border-brand-bgLight/40">
                    {availableSkills.map((skill) => {
                      const selected = selectedSkills.includes(skill);
                      return (
                        <motion.button
                          key={skill}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleToggleSkill(skill)}
                          className={`py-3 px-5 rounded-xl text-xs font-bold transition-all border ${
                            selected
                              ? 'bg-brand-primary border-brand-primary text-brand-bgLight shadow-md shadow-brand-primary/10'
                              : 'bg-white border-brand-bgLight text-brand-dark/70 hover:bg-brand-bgLight/50'
                          }`}
                        >
                          {skill}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-brand-bgLight/40">
                    <Button variant="ghost" onClick={() => prevStep(1)} className="flex items-center space-x-2 text-xs py-2 px-4 rounded-xl text-brand-dark hover:bg-brand-bgLight/40">
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </Button>
                    <Button 
                      variant="primary" 
                      disabled={selectedSkills.length === 0} 
                      onClick={() => nextStep(3)}
                      className="flex items-center space-x-2 px-6 text-xs py-3 rounded-xl font-bold bg-brand-accent text-brand-dark shadow-md"
                    >
                      <span>Define Career Gap</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 3: Gap details */}
            {step === 3 && (
              <Card variant="light" className="glow-card p-8 bg-white border border-brand-bgLight/40 rounded-3xl">
                <div className="mb-6 space-y-1">
                  <Badge variant="indigo" className="text-[10px] font-black uppercase tracking-wider">Step 3</Badge>
                  <h2 className="text-2xl font-black font-serif text-brand-primary">Gap Details & Availability</h2>
                  <p className="text-xs text-brand-dark/50 font-medium">Provide contextual timeline data to help companies coordinate your onboarding path.</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/60">Break Duration</label>
                      <select
                        value={gapYears}
                        onChange={(e) => setGapYears(e.target.value)}
                        className="w-full p-3 bg-white text-brand-dark rounded-xl border border-brand-bgLight focus:border-brand-accent focus:outline-none text-xs font-semibold focus:ring-1 focus:ring-brand-accent/20"
                      >
                        <option value="1">1 year</option>
                        <option value="2">2 years</option>
                        <option value="3">3 years</option>
                        <option value="4">4 years</option>
                        <option value="5">5+ years</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/60">Upskilling Availability</label>
                      <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-full p-3 bg-white text-brand-dark rounded-xl border border-brand-bgLight focus:border-brand-accent focus:outline-none text-xs font-semibold focus:ring-1 focus:ring-brand-accent/20"
                      >
                        <option value="Full-time">Full-time (9-5 weekdays)</option>
                        <option value="Evenings">Evenings only</option>
                        <option value="Weekends">Weekends only</option>
                        <option value="Flexible">Flexible / Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] uppercase font-black tracking-widest text-brand-dark/60">Primary Break Reason</label>
                    <select
                      value={gapReason}
                      onChange={(e) => setGapReason(e.target.value)}
                      className="w-full p-3 bg-white text-brand-dark rounded-xl border border-brand-bgLight focus:border-brand-accent focus:outline-none text-xs font-semibold focus:ring-1 focus:ring-brand-accent/20"
                    >
                      <option value="Family (Maternity & Childcare)">Family (Maternity & Childcare)</option>
                      <option value="Burnout Recovery">Burnout Recovery</option>
                      <option value="Relocation / Visas">Relocation / Visas</option>
                      <option value="Health / Personal Reasons">Health / Personal Reasons</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-brand-bgLight/40">
                    <Button variant="ghost" onClick={() => prevStep(2)} className="flex items-center space-x-2 text-xs py-2 px-4 rounded-xl text-brand-dark hover:bg-brand-bgLight/40">
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handleSubmit} 
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-6 text-xs py-3 rounded-xl font-bold bg-brand-accent text-brand-dark shadow-md"
                    >
                      <span>{isLoading ? 'Calculating Metrics...' : 'Submit & Compute'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Completion Result Screen */}
            {step === 4 && score !== null && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card variant="light" className="glow-card p-10 text-center max-w-xl mx-auto bg-white border border-brand-bgLight/40 rounded-3xl">
                  <div className="flex justify-center mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center border border-brand-accent/20 shadow-md">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  </div>

                  <h2 className="text-3xl font-black font-serif text-brand-primary mb-2">Assessment Finished!</h2>
                  <p className="text-xs text-brand-dark/50 mb-8 max-w-sm mx-auto font-medium">
                    Your readiness credentials have been generated and mapped against Sri Lankan tech parameters.
                  </p>

                  <div className="flex justify-center mb-8 bg-brand-bgLight/10 py-6 px-10 rounded-3xl border border-brand-bgLight/40 max-w-[240px] mx-auto">
                    <ProgressRing percentage={score} size={140} strokeWidth={11} color="#10B981" trailColor="#E2E8F0" textColor="#0F172A" />
                  </div>

                  <div className="bg-brand-bgLight/30 rounded-2xl p-5 border border-brand-bgLight text-left mb-8 space-y-2">
                    <div className="flex items-center space-x-1.5 text-brand-primary">
                      <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" />
                      <h4 className="text-xs font-black uppercase tracking-widest">Score Details: {score}% Readiness</h4>
                    </div>
                    <p className="text-[11px] text-brand-dark/60 leading-relaxed font-medium">
                      Based on your background skills list, you have a solid foundation. We've customized custom pathways on your personal dashboard to help bridge the remaining {100 - score}% skills gap.
                    </p>
                  </div>

                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full flex items-center justify-center space-x-2 text-brand-dark bg-brand-accent font-bold py-3.5 rounded-xl shadow-md shadow-brand-accent/15" 
                    onClick={() => router.push('/dashboard')}
                  >
                    <span>Go to My Dashboard</span>
                    <ChevronRight className="w-4.5 h-4.5" />
                  </Button>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
