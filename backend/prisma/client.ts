import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../prisma/db.json');

interface DbState {
  users: any[];
  profiles: any[];
  courses: any[];
  modules: any[];
  userProgresses: any[];
  jobs: any[];
  applications: any[];
}

const getInitialDb = (): DbState => ({
  users: [],
  profiles: [],
  courses: [],
  modules: [],
  userProgresses: [],
  jobs: [],
  applications: [],
});

const readDb = (): DbState => {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(getInitialDb(), null, 2), 'utf-8');
  }
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch (e) {
    return getInitialDb();
  }
};

const writeDb = (data: DbState) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};

const uuid = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

class MockModel {
  tableName: keyof DbState;

  constructor(tableName: keyof DbState) {
    this.tableName = tableName;
  }

  async deleteMany(args?: any) {
    const db = readDb();
    db[this.tableName] = [];
    writeDb(db);
    return { count: 0 };
  }

  async findUnique(args: any) {
    const db = readDb();
    const list = db[this.tableName];
    const whereKeys = Object.keys(args.where);

    const match = list.find((item: any) => {
      // Check composite keys if they exist in schema (e.g. userId_moduleId for userProgress, jobId_userId for application)
      if (args.where.userId_moduleId) {
        return item.userId === args.where.userId_moduleId.userId && item.moduleId === args.where.userId_moduleId.moduleId;
      }
      if (args.where.jobId_userId) {
        return item.jobId === args.where.jobId_userId.jobId && item.userId === args.where.jobId_userId.userId;
      }

      return whereKeys.every((key) => item[key] === args.where[key]);
    });

    if (!match) return null;

    // Handle include relations if requested
    return this.applyIncludes(match, args.include, db);
  }

  async findFirst(args: any) {
    const db = readDb();
    const list = db[this.tableName];
    const whereKeys = Object.keys(args.where || {});

    const match = list.find((item: any) =>
      whereKeys.every((key) => item[key] === args.where[key])
    );

    if (!match) return null;
    return this.applyIncludes(match, args.include, db);
  }

  async findMany(args?: any) {
    const db = readDb();
    let list = [...db[this.tableName]];

    if (args && args.where) {
      list = list.filter((item: any) => {
        return Object.keys(args.where).every((key) => {
          const condition = args.where[key];
          
          if (condition && typeof condition === 'object') {
            // Handle { contains: '...', mode: 'insensitive' }
            if ('contains' in condition) {
              const val = (item[key] || '').toString().toLowerCase();
              const search = condition.contains.toLowerCase();
              return val.includes(search);
            }
            // Handle { in: [...] }
            if ('in' in condition) {
              return condition.in.includes(item[key]);
            }
            // Handle relation filters e.g. employer: { name: { contains: '...' } }
            if (key === 'employer' && condition.name) {
              const employer = db.users.find((u) => u.id === item.employerId);
              if (!employer) return false;
              const nameVal = (employer.name || '').toLowerCase();
              const search = condition.name.contains.toLowerCase();
              return nameVal.includes(search);
            }
            // Handle array filters e.g. skills: { hasSome: [...] }
            if ('hasSome' in condition) {
              const itemSkills = item[key] || [];
              return condition.hasSome.some((s: string) => 
                itemSkills.map((sk: string) => sk.toLowerCase()).includes(s.toLowerCase())
              );
            }
            return true;
          }
          
          return item[key] === condition;
        });
      });
    }

    // Sort if orderBy specified
    if (args && args.orderBy) {
      const orderKey = Object.keys(args.orderBy)[0];
      const direction = args.orderBy[orderKey];
      list.sort((a: any, b: any) => {
        if (a[orderKey] < b[orderKey]) return direction === 'asc' ? -1 : 1;
        if (a[orderKey] > b[orderKey]) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply includes for relations
    return list.map((item: any) => this.applyIncludes(item, args?.include, db));
  }

  async create(args: any) {
    const db = readDb();
    const newItem = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      ...args.data,
    };

    // If create query contains nested creates (like user profile create or modules create)
    if (args.data.profile?.create) {
      const profileData = args.data.profile.create;
      delete newItem.profile;
      const newProfile = {
        id: uuid(),
        userId: newItem.id,
        ...profileData,
      };
      db.profiles.push(newProfile);
    }

    if (args.data.modules?.create) {
      const modulesData = args.data.modules.create;
      delete newItem.modules;
      modulesData.forEach((mod: any) => {
        db.modules.push({
          id: uuid(),
          courseId: newItem.id,
          ...mod,
        });
      });
    }

    db[this.tableName].push(newItem);
    writeDb(db);

    return this.applyIncludes(newItem, args.include, db);
  }

  async update(args: any) {
    const db = readDb();
    const list = db[this.tableName];
    const index = list.findIndex((item: any) => item.id === args.where.id);

    if (index === -1) {
      throw new Error(`Record to update not found.`);
    }

    list[index] = {
      ...list[index],
      ...args.data,
      updatedAt: new Date().toISOString(),
    };

    writeDb(db);
    return this.applyIncludes(list[index], args.include, db);
  }

  async upsert(args: any) {
    const db = readDb();
    const list = db[this.tableName];
    
    let index = -1;
    // Composite key check
    if (args.where.userId_moduleId) {
      index = list.findIndex((item: any) => item.userId === args.where.userId_moduleId.userId && item.moduleId === args.where.userId_moduleId.moduleId);
    } else if (args.where.jobId_userId) {
      index = list.findIndex((item: any) => item.jobId === args.where.jobId_userId.jobId && item.userId === args.where.jobId_userId.userId);
    } else if (args.where.userId) {
      index = list.findIndex((item: any) => item.userId === args.where.userId);
    } else if (args.where.id) {
      index = list.findIndex((item: any) => item.id === args.where.id);
    }

    let item: any;
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...args.update,
        updatedAt: new Date().toISOString(),
      };
      item = list[index];
    } else {
      item = {
        id: uuid(),
        createdAt: new Date().toISOString(),
        ...args.create,
      };
      list.push(item);
    }

    writeDb(db);
    return this.applyIncludes(item, args.include, db);
  }

  async count(args?: any) {
    const list = await this.findMany(args);
    return list.length;
  }

  private applyIncludes(item: any, include: any, db: DbState) {
    if (!include) return item;
    const result = { ...item };

    if (include.profile) {
      result.profile = db.profiles.find((p) => p.userId === item.id) || null;
    }

    if (include.modules) {
      let mods = db.modules.filter((m) => m.courseId === item.id);
      if (include.modules.orderBy) {
        mods.sort((a, b) => a.order - b.order);
      }
      result.modules = mods;
    }

    if (include.employer) {
      const employer = db.users.find((u) => u.id === item.employerId);
      if (employer) {
        result.employer = {
          id: employer.id,
          name: employer.name,
          email: employer.email,
        };
      }
    }

    if (include.applications) {
      // Check if filtering by user exists in includes (e.g. applications where userId)
      let apps = db.applications.filter((a) => a.jobId === item.id);
      if (include.applications.where && include.applications.where.userId) {
        apps = apps.filter((a) => a.userId === include.applications.where.userId);
      }
      result.applications = apps;
    }

    if (include.user) {
      const user = db.users.find((u) => u.id === item.userId);
      if (user) {
        result.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          profile: db.profiles.find((p) => p.userId === user.id) || null,
        };
      }
    }

    if (include.job) {
      const job = db.jobs.find((j) => j.id === item.jobId);
      if (job) {
        result.job = {
          id: job.id,
          title: job.title,
        };
      }
    }

    return result;
  }
}

class MockPrismaClient {
  user = new MockModel('users');
  returnProfile = new MockModel('profiles');
  course = new MockModel('courses');
  module = new MockModel('modules');
  userProgress = new MockModel('userProgresses');
  job = new MockModel('jobs');
  application = new MockModel('applications');

  async $connect() {}
  async $disconnect() {}
}

const prisma = new MockPrismaClient() as any;

export default prisma;
