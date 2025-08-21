import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const demo = await prisma.meditation.create({
    data: {
      title: 'Breath Focus (5 min)',
      description: 'A short breath awareness practice.',
      category: 'Focus',
      level: 'Beginner',
      lengthSec: 300,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/03/30/audio_42b5c7af83.mp3',
      isPremium: false
    }
  });

  const form = await prisma.form.upsert({
    where: { slug: 'daily-checkin' },
    update: {},
    create: {
      slug: 'daily-checkin',
      title: 'Daily Check-in',
      description: 'How are you feeling today?',
      fields: {
        create: [
          { name: 'mood', label: 'Mood', type: 'SELECT', required: true, sortOrder: 1, options: { options: ['stressed','neutral','calm'] } },
          { name: 'sleep', label: 'Sleep hours', type: 'NUMBER', required: false, sortOrder: 2 },
          { name: 'note', label: 'Note', type: 'TEXT', required: false, sortOrder: 3 }
        ]
      }
    }
  });

  console.log({ demo, form });
}

main().catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
