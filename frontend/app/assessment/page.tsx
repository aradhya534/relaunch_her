'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { FileUp, Award, Clock, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressRing from '@/components/ui/ProgressRing';

export default function AssessmentPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Multi-step tracking
  const [step, setStep] = useState(1);
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
      setStep(4);
      toast.success('Assessment calculated successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error saving assessment details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Visual Step Tracker */}
      {step < 4 && (
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div 
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === num 
                    ? 'bg-brand-primary text-white ring-4 ring-brand-accent/20' 
                    : step > num 
                      ? 'bg-brand-accent text-brand-dark' 
                      : 'bg-white text-brand-dark/40 border border-brand-bgLight'
                }`}
              >
                {num}
              </div>
              {num < 3 && <div className={`h-1 w-12 rounded-full ${step > num ? 'bg-brand-accent' : 'bg-brand-bgLight'}`} />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Step 1: CV & Job Title */}
      {step === 1 && (
        <Card variant="light" className="glow-card p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-serif text-brand-primary mb-2">Step 1: Background Upload</h2>
            <p className="text-sm text-brand-dark/60">Upload your old CV to extract base metadata and choose your last target role.</p>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-brand-primary/10 rounded-2xl p-8 text-center bg-brand-bgLight/30 hover:border-brand-accent/50 transition-colors relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileUp className="w-10 h-10 text-brand-primary/40 mx-auto mb-4" />
              <p className="text-sm font-bold text-brand-primary">
                {cvFile ? cvFile.name : 'Click to upload your old CV (PDF)'}
              </p>
              <p className="text-xs text-brand-dark/40 mt-2">Maximum file size: 5MB</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-brand-dark/70">Last Job Title held before career break</label>
              <select
                value={lastJobTitle}
                onChange={(e) => setLastJobTitle(e.target.value)}
                className="w-full p-3 bg-white text-brand-dark rounded-xl border border-brand-bgLight focus:border-brand-accent focus:outline-none text-sm"
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

            <div className="flex justify-end pt-4">
              <Button 
                variant="primary" 
                disabled={!lastJobTitle} 
                onClick={() => setStep(2)}
                className="flex items-center space-x-2"
              >
                <span>Continue to Skills</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Skill pill tags */}
      {step === 2 && (
        <Card variant="light" className="glow-card p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-serif text-brand-primary mb-2">Step 2: Core Competencies</h2>
            <p className="text-sm text-brand-dark/60">Confirm the skill categories you have worked with or feel comfortable refreshing.</p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 p-4 bg-brand-bgLight/30 rounded-2xl border border-brand-bgLight">
              {availableSkills.map((skill) => {
                const selected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => handleToggleSkill(skill)}
                    className={`py-3 px-5 rounded-xl text-xs font-bold transition-all border ${
                      selected
                        ? 'bg-brand-accent border-brand-accent text-brand-dark shadow-md'
                        : 'bg-white border-brand-bgLight text-brand-dark/75 hover:bg-brand-bgLight hover:border-brand-bgLight'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(1)} className="flex items-center space-x-2 text-brand-dark hover:bg-brand-bgLight/60">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button 
                variant="primary" 
                disabled={selectedSkills.length === 0} 
                onClick={() => setStep(3)}
                className="flex items-center space-x-2"
              >
                <span>Define Career Gap</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 3: Gap details & submit */}
      {step === 3 && (
        <Card variant="light" className="glow-card p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-serif text-brand-primary mb-2">Step 3: Gap Details & Timeline</h2>
            <p className="text-sm text-brand-dark/60">Provide contextual information about your break to help employers understand your timeline.</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-dark/70">Break Duration (Years)</label>
                <select
                  value={gapYears}
                  onChange={(e) => setGapYears(e.target.value)}
                  className="w-full p-3 bg-white text-brand-dark rounded-xl border border-brand-bgLight focus:border-brand-accent focus:outline-none text-sm"
                >
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="4">4 years</option>
                  <option value="5">5+ years</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-dark/70">Upskilling Availability</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full p-3 bg-white text-brand-dark rounded-xl border border-brand-bgLight focus:border-brand-accent focus:outline-none text-sm"
                >
                  <option value="Full-time">Full-time (9-5 weekdays)</option>
                  <option value="Evenings">Evenings only</option>
                  <option value="Weekends">Weekends only</option>
                  <option value="Flexible">Flexible / Hybrid</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-brand-dark/70">Primary Reason for break</label>
              <select
                value={gapReason}
                onChange={(e) => setGapReason(e.target.value)}
                className="w-full p-3 bg-white text-brand-dark rounded-xl border border-brand-bgLight focus:border-brand-accent focus:outline-none text-sm"
              >
                <option value="Family (Maternity & Childcare)">Family (Maternity & Childcare)</option>
                <option value="Burnout Recovery">Burnout Recovery</option>
                <option value="Relocation / Visas">Relocation / Visas</option>
                <option value="Health / Personal Reasons">Health / Personal Reasons</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex justify-between pt-4 border-t border-brand-bgLight">
              <Button variant="ghost" onClick={() => setStep(2)} className="flex items-center space-x-2 text-brand-dark hover:bg-brand-bgLight/60">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <span>{isLoading ? 'Calculating...' : 'Submit & Compute Score'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Completion: Score Card */}
      {step === 4 && score !== null && (
        <Card variant="light" className="glow-card p-10 text-center max-w-xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-brand-accent/15 text-brand-accent flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          </div>

          <h2 className="text-3xl font-bold font-serif text-brand-primary mb-3">Assessment Completed!</h2>
          <p className="text-sm text-brand-dark/60 mb-8 max-w-sm mx-auto">
            Your credentials have been computed against active job requirements in the Sri Lankan tech sector.
          </p>

          <div className="flex justify-center mb-8">
            <ProgressRing percentage={score} size={150} strokeWidth={12} color="#00C9B1" trailColor="#F0EBF8" textColor="#2D1B69" />
          </div>

          <div className="bg-brand-bgLight/30 rounded-2xl p-5 border border-brand-bgLight text-left mb-8">
            <h4 className="text-sm font-bold text-brand-primary mb-1">Your Score: {score}% Market Readiness</h4>
            <p className="text-xs text-brand-dark/70 leading-relaxed">
              Based on your skills tag selections, you are in a great position. We have loaded custom courses on your dashboard to help bridge the remaining {100 - score}% gap.
            </p>
          </div>

          <Button variant="primary" size="lg" className="w-full flex items-center justify-center space-x-2" onClick={() => router.push('/dashboard')}>
            <span>Go to My Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Card>
      )}
    </div>
  );
}
