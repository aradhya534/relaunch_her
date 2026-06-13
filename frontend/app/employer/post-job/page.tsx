'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, MapPin, Briefcase, Eye, Cpu, CheckCircle } from 'lucide-react';
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

  // Preview properties
  const companyName = session?.user?.name?.replace(' Hiring Manager', '').replace(' Careers', '').replace(' Global Recruiter', '').replace(' Recruiting', '').replace(' HR', '') || 'WSO2';
  const logoInitials = companyName.substring(0, 2).toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <button
        onClick={() => router.push('/employer/dashboard')}
        className="flex items-center space-x-2 text-xs font-semibold text-brand-dark/50 hover:text-brand-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Control Panel</span>
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold font-serif text-brand-primary">Create Job Listing</h1>
        <p className="text-sm text-brand-dark/50 mt-1">Publish returner-friendly jobs to bypass algorithm screening.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <Card variant="light" className="glow-card p-6 bg-white space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark/40 border-b border-brand-bgLight pb-3 mb-2">Job Details</h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-brand-dark/70">Job Role / Title</label>
              <input
                type="text"
                placeholder="Senior Backend Engineer (NodeJS/AWS)..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-brand-bgLight/20 border border-brand-bgLight text-brand-dark rounded-xl text-sm focus:border-brand-accent focus:outline-none"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-dark/70">Work Arrangement</label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full p-3 bg-brand-bgLight/20 border border-brand-bgLight text-brand-dark rounded-xl text-sm focus:border-brand-accent focus:outline-none"
                  disabled={isLoading}
                >
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">Onsite</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-dark/70">Required Skill Category</label>
                <span className="text-[10px] text-brand-dark/40 block mt-0.5">Choose multiple</span>
              </div>
            </div>

            {/* Select tags */}
            <div className="flex flex-wrap gap-2 p-3 bg-brand-bgLight/30 rounded-xl border border-brand-bgLight">
              {availableSkills.map((skill) => {
                const selected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
                      selected
                        ? 'bg-brand-primary border-brand-primary text-brand-bgLight shadow-sm'
                        : 'bg-white border-brand-bgLight text-brand-dark/60 hover:bg-brand-bgLight'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-dark/70">Min Monthly Salary (LKR)</label>
                <input
                  type="number"
                  placeholder="150000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full p-3 bg-brand-bgLight/20 border border-brand-bgLight text-brand-dark rounded-xl text-sm focus:border-brand-accent focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-brand-dark/70">Max Monthly Salary (LKR)</label>
                <input
                  type="number"
                  placeholder="250000"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full p-3 bg-brand-bgLight/20 border border-brand-bgLight text-brand-dark rounded-xl text-sm focus:border-brand-accent focus:outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-brand-dark/70">Job Description</label>
              <textarea
                placeholder="Include responsibilities, required years of break flexibility support details, and expectations..."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-brand-bgLight/20 border border-brand-bgLight text-brand-dark rounded-xl text-sm focus:border-brand-accent focus:outline-none"
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-brand-bgLight">
              <Button variant="primary" size="md" type="submit" disabled={isLoading} className="flex items-center space-x-2 px-6">
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Publishing...' : 'Publish Listing'}</span>
              </Button>
            </div>
          </Card>
        </form>

        {/* Right Column: Live Board Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-dark/40 pl-2">
            <Eye className="w-4 h-4 text-brand-primary" />
            <span>Live Board Preview</span>
          </div>

          <Card variant="light" className="glow-card flex flex-col justify-between p-6 bg-white relative">
            <div>
              {/* Card top bar */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-xl bg-brand-primary text-brand-accent flex items-center justify-center font-bold text-sm border border-brand-accent/10 shadow-sm shrink-0">
                    {logoInitials}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-primary text-sm leading-tight">
                      {title || 'Senior Software Engineer...'}
                    </h4>
                    <p className="text-xs text-brand-dark/50 mt-0.5">{companyName}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1.5 shrink-0">
                  <Badge variant="gold">88% Match</Badge>
                  <Badge variant="teal" className="flex items-center space-x-1 py-0.5">
                    <CheckCircle className="w-3 h-3 fill-brand-accent text-brand-dark" />
                    <span>Verified</span>
                  </Badge>
                </div>
              </div>

              {/* Card body */}
              <div className="space-y-2.5 mb-6">
                <div className="flex items-center space-x-4 text-xs text-brand-dark/60">
                  <span className="flex items-center space-x-0.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-dark/40" />
                    <span>{workType}</span>
                  </span>
                  <span className="text-brand-dark/20">|</span>
                  <span>LKR {parseInt(salaryMin || '0').toLocaleString()} - {parseInt(salaryMax || '0').toLocaleString()} / mo</span>
                </div>
                <p className="text-xs text-brand-dark/70 leading-relaxed line-clamp-3 min-h-[48px]">
                  {description || 'Provide a brief description to see a preview of how candidates will read about this opportunity.'}
                </p>
              </div>
            </div>

            {/* Card footer */}
            <div className="border-t border-brand-bgLight pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
              <div className="flex flex-wrap gap-1.5">
                {selectedSkills.length === 0 ? (
                  <span className="px-2 py-0.5 bg-brand-bgLight/40 border border-brand-bgLight text-[10px] font-bold rounded text-brand-primary/40">
                    No Skills Selected
                  </span>
                ) : (
                  selectedSkills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 bg-brand-bgLight/40 border border-brand-bgLight text-[10px] font-bold rounded text-brand-primary">
                      {skill}
                    </span>
                  ))
                )}
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto text-xs py-1.5 px-4 cursor-default opacity-80"
                disabled
              >
                Apply Now
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
