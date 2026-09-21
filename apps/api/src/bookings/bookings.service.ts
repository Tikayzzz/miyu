import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { CustomersService } from '../customers/customers.service';

interface CreateBookingInput {
  employeeId: string;
  serviceId: string;
  addonIds?: string[];
  startTime: string; // ISO
  customer: { firstName: string; lastName: string; phone: string; email: string; note?: string };
}

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private availability: AvailabilityService,
    private customers: CustomersService,
  ) {}

  async create(input: CreateBookingInput) {
    const service = await this.prisma.service.findUnique({
      where: { id: input.serviceId },
      include: { addons: true },
    });
    if (!service) throw new NotFoundException('Service not found');

    const selectedAddons = service.addons.filter((a) => input.addonIds?.includes(a.id));
    const totalDurationMin = service.durationMin + selectedAddons.reduce((s, a) => s + a.extraDurationMin, 0);
    const totalPriceCents = service.priceCents + selectedAddons.reduce((s, a) => s + a.extraPriceCents, 0);
    const start = new Date(input.startTime);

    const customer = await this.customers.findOrCreate(input.customer);

    // Transaction: re-check for conflicts and create atomically, so two
    // customers can't both grab the same slot in a race condition.
    return this.prisma.$transaction(async (tx) => {
      await this.availability.assertNoConflict(input.employeeId, start, totalDurationMin, tx as any);

      return tx.booking.create({
        data: {
          customerId: customer.id,
          employeeId: input.employeeId,
          startTime: start,
          endTime: new Date(start.getTime() + totalDurationMin * 60000),
          totalPriceCents,
          totalDurationMin,
          status: 'PENDING',
          services: {
            create: {
              serviceId: service.id,
              addonIds: selectedAddons.map((a) => a.id),
            },
          },
        },
        include: { services: true, customer: true },
      });
    });
  }

  findAll() {
    return this.prisma.booking.findMany({
      include: { customer: true, employee: true, services: { include: { service: true } } },
      orderBy: { startTime: 'asc' },
    });
  }

  updateStatus(id: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW') {
    return this.prisma.booking.update({ where: { id }, data: { status } });
  }
}
