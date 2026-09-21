import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  // Public: full catalog grouped by category, for the customer booking flow.
  findAllCatalog() {
    return this.prisma.serviceCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        services: {
          where: { active: true },
          include: { addons: true },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.service.findUniqueOrThrow({
      where: { id },
      include: { addons: true, category: true },
    });
  }

  create(data: {
    categoryId: string;
    name: string;
    description?: string;
    priceCents: number;
    durationMin: number;
  }) {
    return this.prisma.service.create({ data });
  }

  update(id: string, data: Partial<{
    name: string;
    description: string;
    priceCents: number;
    durationMin: number;
    active: boolean;
  }>) {
    return this.prisma.service.update({ where: { id }, data });
  }

  remove(id: string) {
    // Soft-delete: keep history for past bookings intact.
    return this.prisma.service.update({ where: { id }, data: { active: false } });
  }
}
