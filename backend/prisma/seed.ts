import prisma from './client';
import { Role, WorkType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';


async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean up existing database tables
  await prisma.application.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.userProgress.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.returnProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Cleaned up old database tables.');

  // 2. Hash passwords
  const passwordHash = await bcrypt.hash('demo1234', 10);

  // 3. Create Demo Returner User
  const returner = await prisma.user.create({
    data: {
      name: 'Aradhya Perera',
      email: 'aradhya@relaunchher.lk',
      password: passwordHash,
      role: Role.RETURNER,
      profile: {
        create: {
          cvUrl: '/uploads/aradhya_cv.pdf',
          skills: ['Frontend', 'Backend', 'AI/ML'],
          gapYears: 3,
          gapReason: 'Family (Maternity & Childcare)',
          availability: 'Full-time',
          skillScore: 74,
        },
      },
    },
  });
  console.log(`👤 Created Returner: ${returner.name} (${returner.email})`);

  // 4. Create Employers
  const wso2 = await prisma.user.create({
    data: {
      name: 'WSO2 Hiring Manager',
      email: 'wso2@relaunchher.lk',
      password: passwordHash,
      role: Role.EMPLOYER,
    },
  });

  const dialog = await prisma.user.create({
    data: {
      name: 'Dialog Axiata HR',
      email: 'dialog@relaunchher.lk',
      password: passwordHash,
      role: Role.EMPLOYER,
    },
  });

  const ifs = await prisma.user.create({
    data: {
      name: 'IFS Global Recruiter',
      email: 'ifs@relaunchher.lk',
      password: passwordHash,
      role: Role.EMPLOYER,
    },
  });

  const syscolabs = await prisma.user.create({
    data: {
      name: 'Sysco LABS Careers',
      email: 'syscolabs@relaunchher.lk',
      password: passwordHash,
      role: Role.EMPLOYER,
    },
  });

  const ninetyninex = await prisma.user.create({
    data: {
      name: '99X Recruiting',
      email: '99x@relaunchher.lk',
      password: passwordHash,
      role: Role.EMPLOYER,
    },
  });

  console.log('🏢 Created 5 Employer user accounts.');

  // 5. Create Seed Jobs
  const jobWso2 = await prisma.job.create({
    data: {
      employerId: wso2.id,
      title: 'Senior Software Engineer (Java/Go)',
      description: 'We are looking for a Senior Software Engineer to join our middleware team. You will design, build, and deploy high-performance REST and gRPC API integrations. Relaunch Her candidates are encouraged to apply; we offer dedicated onboarding mentorship and a flexible phased-return structure.',
      skills: ['Backend', 'Cloud', 'DevOps'],
      workType: WorkType.HYBRID,
      salaryMin: 250000,
      salaryMax: 400000,
      isActive: true,
    },
  });

  const jobDialog = await prisma.job.create({
    data: {
      employerId: dialog.id,
      title: 'Product Manager - Fintech Products',
      description: 'Help us build the next generation of mobile wallet and digital bank tools for Sri Lankans. You will coordinate between engineering, marketing, and business stakeholders. We support returners transitioning back into leadership and offer flexible working arrangements.',
      skills: ['Product Management', 'Data'],
      workType: WorkType.REMOTE,
      salaryMin: 200000,
      salaryMax: 350000,
      isActive: true,
    },
  });

  const jobIfs = await prisma.job.create({
    data: {
      employerId: ifs.id,
      title: 'QA Automation Lead',
      description: 'Lead our test automation team validating ERP cloud components. Perfect for experienced QA engineers returning from a career break. We value strong analytical skills and offer training in the latest modern automation tools.',
      skills: ['QA', 'Frontend', 'Backend'],
      workType: WorkType.ONSITE,
      salaryMin: 180000,
      salaryMax: 300000,
      isActive: true,
    },
  });

  const jobSysco = await prisma.job.create({
    data: {
      employerId: syscolabs.id,
      title: 'DevOps & Platform Infrastructure Engineer',
      description: 'Manage AWS cloud infrastructures, build container configurations, and oversee CI/CD deployment pipelines. This role has a supportive work culture that welcomes mothers on career breaks. Phased onboarding is fully supported.',
      skills: ['DevOps', 'Cloud', 'Backend'],
      workType: WorkType.HYBRID,
      salaryMin: 220000,
      salaryMax: 380000,
      isActive: true,
    },
  });

  const job99x = await prisma.job.create({
    data: {
      employerId: ninetyninex.id,
      title: 'Frontend React Developer',
      description: 'Create pixel-perfect, highly accessible user interfaces using React, Next.js, and Tailwind CSS. Perfect for returners passionate about design and front-end engineering. Collaboration is key; work in a flexible, agile project team.',
      skills: ['Frontend', 'QA'],
      workType: WorkType.HYBRID,
      salaryMin: 150000,
      salaryMax: 260000,
      isActive: true,
    },
  });

  console.log('💼 Created 5 seed Jobs linked to employers.');

  // 6. Create Seed Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'AI Integration Basics',
      description: 'Learn how to incorporate cutting-edge Generative AI features and Large Language Models (LLMs) into modern web applications.',
      duration: '4 weeks',
      level: 'Beginner-friendly',
      modules: {
        create: [
          { order: 1, title: 'Week 1: Introduction to Generative AI & LLMs', content: 'Understand the landscape of foundation models, text generation mechanics, and basic capabilities of modern LLMs. Learn about tokens, temperature, and API safety principles.' },
          { order: 2, title: 'Week 2: Working with OpenAI & Anthropic APIs', content: 'Get hands-on experience calling the Chat Completions API, handling system prompts, structure JSON formatting outputs, and managing API key environments.' },
          { order: 3, title: 'Week 3: Vector Databases & RAG Systems', content: 'Learn how Retrieval-Augmented Generation extends LLM knowledge. Seed documents, create embeddings, query vector databases, and synthesize context-rich answers.' },
          { order: 4, title: 'Week 4: Prompt Engineering & AI Agents', content: 'Design advanced prompt chains, learn about tool calling (functions), agents, and construct a real-world chatbot integrated into a web frontend.' },
        ],
      },
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Modern DevOps & CI/CD',
      description: 'Master Docker containerization, cloud orchestration, and automatic deployments to build frictionless shipping experiences.',
      duration: '6 weeks',
      level: 'Intermediate',
      modules: {
        create: [
          { order: 1, title: 'Week 1: Introduction to DevOps & Git workflows', content: 'Review the DevOps culture, trunk-based development, branching strategies, and merge conflict resolution. Understand why deployment pipeline automation is essential.' },
          { order: 2, title: 'Week 2: Containerization with Docker', content: 'Write Dockerfiles, containerize complex Node and frontend applications, explore multi-stage builds, and manage multi-container local deployments using Docker Compose.' },
          { order: 3, title: 'Week 3: CI/CD Pipelines with GitHub Actions', content: 'Configure automatic workflows that trigger on pull requests to run linters, formatters, and unit tests. Understand GitHub Secrets configuration.' },
          { order: 4, title: 'Week 4: Deploying to AWS & Vercel Services', content: 'Explore target hosting options. Deploy frontend components to Vercel and backend services to AWS EC2/ECS or Railway. Implement automatic SSL and DNS routing.' },
        ],
      },
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'Agile Product Management 2026',
      description: 'Gain a solid foundation in roadmap design, agile rituals, and metrics to successfully steer cross-functional product squads.',
      duration: '3 weeks',
      level: 'All levels',
      modules: {
        create: [
          { order: 1, title: 'Week 1: Agile Principles & Scrum Framework', content: 'Examine the Agile Manifesto. Master scrum core roles (PO, Scrum Master, Developer), ceremony routines (standups, reviews, retros), and sprints.' },
          { order: 2, title: 'Week 2: Backlog Grooming & Story Mapping', content: 'Learn to write actionable user stories with robust acceptance criteria. Build visual story maps to prioritize feature delivery incrementally.' },
          { order: 3, title: 'Week 3: Sprint Planning & Agile Metrics', content: 'Determine squad velocity, build burn-down/up charts, manage scope changes, and run retrospectives using modern visual canvas templates.' },
          { order: 4, title: 'Week 4: Tooling in 2026: Jira & Miro Systems', content: 'Collaborate inside modern product workboards. Practice setting up sprints, epics, dashboards, and managing feedback boards.' },
        ],
      },
    },
  });

  console.log('📚 Created 3 seed Courses with 4 modules each.');

  // 7. Pre-fill some progress for Aradhya
  const modulesCourse1 = await prisma.module.findMany({
    where: { courseId: course1.id },
    orderBy: { order: 'asc' },
  });

  if (modulesCourse1.length >= 2) {
    await prisma.userProgress.create({
      data: {
        userId: returner.id,
        moduleId: modulesCourse1[0].id,
        completed: true,
        completedAt: new Date(),
      },
    });

    await prisma.userProgress.create({
      data: {
        userId: returner.id,
        moduleId: modulesCourse1[1].id,
        completed: true,
        completedAt: new Date(),
      },
    });

    console.log('✅ Pre-filled 50% course completion progress for Aradhya on course 1.');
  }

  // 8. Pre-fill a job application for Aradhya to WSO2
  await prisma.application.create({
    data: {
      jobId: jobWso2.id,
      userId: returner.id,
      matchScore: 88,
      status: 'SHORTLISTED',
    },
  });
  console.log('✅ Pre-filled a shortlisted application for Aradhya on the WSO2 listing.');

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
