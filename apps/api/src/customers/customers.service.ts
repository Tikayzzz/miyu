import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // Re-use an existing customer record by email if one exists, else create.
  async findOrCreate(data: { firstName: string; lastName: string; phone: string; email: string; note?: string }) {
    const existing = await this.prisma.customer.findFirst({ where: { email: data.email } });
    if (existing) return existing;
    return this.prisma.customer.create({ data });
  }
}
