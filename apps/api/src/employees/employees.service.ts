import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.employee.findMany({ where: { active: true } });
  }

  // Employees who can perform a given service — for the "choose employee" step.
  findByService(serviceId: string) {
    return this.prisma.employee.findMany({
      where: { active: true, services: { some: { serviceId } } },
    });
  }

  create(data: { firstName: string; lastName: string; specialty?: string }) {
    return this.prisma.employee.create({ data });
  }

  setWorkingHours(employeeId: string, hours: { weekday: number; startTime: string; endTime: string }[]) {
    return this.prisma.$transaction([
      this.prisma.employeeWorkingHours.deleteMany({ where: { employeeId } }),
      this.prisma.employeeWorkingHours.createMany({
        data: hours.map((h) => ({ ...h, employeeId })),
      }),
    ]);
  }

  addDayOff(employeeId: string, date: string, reason?: string) {
    return this.prisma.employeeDayOff.create({
      data: { employeeId, date: new Date(date), reason },
    });
  }

  addBreak(employeeId: string, brk: { weekday: number; startTime: string; endTime: string }) {
    return this.prisma.employeeBreak.create({ data: { employeeId, ...brk } });
  }

  assignService(employeeId: string, serviceId: string) {
    return this.prisma.employeeService.create({ data: { employeeId, serviceId } });
  }
}
