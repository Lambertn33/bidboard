import bcrypt from 'bcryptjs';
import prisma from './prisma';

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@taskbid.com' },
    update: {},
    create: {
      names: 'TaskBid Admin',
      email: 'admin@taskbid.com',
      password,
      role: 'ADMIN',
    },
  });

  // Create Freelancer User
  const freelancerUser = await prisma.user.upsert({
    where: { email: 'freelancer@taskbid.com' },
    update: {},
    create: {
      names: 'Demo Freelancer',
      email: 'freelancer@taskbid.com',
      password,
      role: 'FREELANCER',
      freelancer: {
        create: {
          telephone: '+250780000000',
        },
      },
    },
    include: {
      freelancer: true,
    },
  });

  const projectBlueprints = [
    {
      name: 'Marketing Blitz',
      description: 'Launch quick marketing assets to boost client reach.',
      basePrice: 150,
      skills: ['Design', 'Photoshop', 'Illustrator', 'Marketing'],
    },
    {
      name: 'Web Revamp',
      description: 'Frontend refresh tasks for client sites.',
      basePrice: 200,
      skills: ['React', 'Vue', 'CSS', 'TypeScript', 'HTML'],
    },
    {
      name: 'Data Cleanup',
      description: 'Micro data tasks for admin insights.',
      basePrice: 120,
      skills: ['Python', 'SQL', 'Data Analysis', 'Excel'],
    },
  ];

  for (const blueprint of projectBlueprints) {
    const exists = await prisma.project.findFirst({
      where: { name: blueprint.name },
    });
    if (exists) {
      continue;
    }

    await prisma.project.create({
      data: {
        name: blueprint.name,
        description: blueprint.description,
        tasks: {
          create: Array.from({ length: 5 }).map((_, idx) => ({
            name: `${blueprint.name} Task ${idx + 1}`,
            description: `Deliverable ${idx + 1} for ${blueprint.name}.`,
            price: blueprint.basePrice + idx * 25,
            skills: blueprint.skills,
          })),
        },
      },
    });
  }

  console.log('Seeded data:', {
    admin: adminUser.email,
    freelancer: freelancerUser.email,
    projects: projectBlueprints.length,
    tasksPerProject: 5,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
