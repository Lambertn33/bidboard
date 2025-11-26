import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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
      role: Role.ADMIN,
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
      role: Role.FREELANCER,
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
    },
    {
      name: 'Web Revamp',
      description: 'Frontend refresh tasks for client sites.',
      basePrice: 200,
    },
    {
      name: 'Data Cleanup',
      description: 'Micro data tasks for admin insights.',
      basePrice: 120,
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
