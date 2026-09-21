import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: 'Maniküre',
      services: [
        { name: 'Deluxe Maniküre', durationMin: 45, priceCents: 4000 },
        { name: 'MIYU Maniküre', durationMin: 20, priceCents: 2200 },
      ],
    },
    {
      name: 'Pediküre',
      services: [
        { name: 'Deluxe Pediküre', durationMin: 70, priceCents: 6500 },
        { name: 'MIYU Pediküre', durationMin: 45, priceCents: 3800 },
      ],
    },
    {
      name: 'Nagel Service',
      services: [
        { name: 'Natur Look (Neu)', durationMin: 90, priceCents: 4300 },
        { name: 'Natur Look (Refill)', durationMin: 75, priceCents: 3900 },
        { name: 'French / Babyboomer (Neu)', durationMin: 100, priceCents: 5300 },
        { name: 'French / Babyboomer (Refill)', durationMin: 85, priceCents: 4500 },
        { name: 'Verlauf / French mit Farbe (Neu)', durationMin: 100, priceCents: 5800 },
        { name: 'Verlauf / French mit Farbe (Refill)', durationMin: 85, priceCents: 5000 },
        { name: 'Cat Eye / Chrome / Glitzer (Neu)', durationMin: 100, priceCents: 6000 },
        { name: 'Cat Eye / Chrome / Glitzer (Refill)', durationMin: 85, priceCents: 5500 },
        { name: 'Shellac Farbe', durationMin: 45, priceCents: 3000 },
        { name: 'Shellac French', durationMin: 55, priceCents: 3800 },
      ],
    },
    {
      name: 'Wimpern & Augenbrauen',
      services: [
        { name: 'Wimpernverlängerung Classic 1:1', durationMin: 90, priceCents: 6800 },
        { name: 'Wimpernverlängerung Hybrid', durationMin: 100, priceCents: 7800 },
        { name: 'Wimpernverlängerung Volume', durationMin: 110, priceCents: 8800 },
        { name: 'Wimpernverlängerung Mega', durationMin: 120, priceCents: 10800 },
        { name: 'Wimpern Refill', durationMin: 60, priceCents: 3800 },
        { name: 'Wimpernlifting', durationMin: 45, priceCents: 4500 },
        { name: 'Augenbrauen Formen', durationMin: 15, priceCents: 1000 },
        { name: 'Augenbrauen Formen + Färben', durationMin: 30, priceCents: 2500 },
      ],
    },
    {
      name: 'Headspa',
      services: [
        { name: 'Yu', durationMin: 45, priceCents: 7900 },
        { name: 'Sora', durationMin: 60, priceCents: 9900 },
        { name: 'Tsuki', durationMin: 75, priceCents: 11900 },
        { name: 'Miyu Signature', durationMin: 90, priceCents: 13900 },
      ],
    },
    {
      name: 'Skincare',
      services: [
        { name: 'MIYU Glow', durationMin: 60, priceCents: 7000 },
        { name: 'MIYU Aqua', durationMin: 90, priceCents: 9500 },
        { name: 'MIYU Needling', durationMin: 120, priceCents: 12500 },
      ],
    },
  ];

  for (const [order, cat] of categories.entries()) {
    const category = await prisma.serviceCategory.create({
      data: { name: cat.name, order },
    });
    for (const s of cat.services) {
      await prisma.service.create({
        data: {
          categoryId: category.id,
          name: s.name,
          durationMin: s.durationMin,
          priceCents: s.priceCents,
        },
      });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
