import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const SLOT_STEP_MIN = 15; // granularity of offered start times

interface Interval {
  start: Date;
  end: Date;
}

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns available start times for an employee on a given date,
   * for a service+addons combo of totalDurationMin.
   */
  async getAvailableSlots(employeeId: string, dateStr: string, totalDurationMin: number) {
    const date = new Date(dateStr);
    const weekday = date.getDay();

    const [workingHours, dayOff, breaks, bookings] = await Promise.all([
      this.prisma.employeeWorkingHours.findMany({ where: { employeeId, weekday } }),
      this.prisma.employeeDayOff.findFirst({
        where: { employeeId, date: this.dayBounds(date) },
      }),
      this.prisma.employeeBreak.findMany({ where: { employeeId, weekday } }),
      this.prisma.booking.findMany({
        where: {
          employeeId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          startTime: { gte: this.startOfDay(date), lt: this.endOfDay(date) },
        },
        select: { startTime: true, endTime: true },
      }),
    ]);

    if (dayOff || workingHours.length === 0) return [];

    const busy: Interval[] = [
      ...breaks.map((b) => ({
        start: this.timeOn(date, b.startTime),
        end: this.timeOn(date, b.endTime),
      })),
      ...bookings.map((b) => ({ start: b.startTime, end: b.endTime })),
    ];

    const slots: string[] = [];

    for (const wh of workingHours) {
      let cursor = this.timeOn(date, wh.startTime);
      const shiftEnd = this.timeOn(date, wh.endTime);

      while (cursor.getTime() + totalDurationMin * 60000 <= shiftEnd.getTime()) {
        const candidateEnd = new Date(cursor.getTime() + totalDurationMin * 60000);
        const overlaps = busy.some((b) => this.overlaps(cursor, candidateEnd, b.start, b.end));
        if (!overlaps) slots.push(cursor.toISOString());
        cursor = new Date(cursor.getTime() + SLOT_STEP_MIN * 60000);
      }
    }

    return slots;
  }

  /** Throws if [start, start+duration) conflicts with an existing booking. Call inside a transaction. */
  async assertNoConflict(employeeId: string, start: Date, durationMin: number, prismaTx = this.prisma) {
    const end = new Date(start.getTime() + durationMin * 60000);
    const conflict = await prismaTx.booking.findFirst({
      where: {
        employeeId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });
    if (conflict) {
      throw new BadRequestException('This slot was just booked. Please choose another time.');
    }
  }

  private overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
    return aStart < bEnd && aEnd > bStart;
  }

  private timeOn(date: Date, hhmm: string): Date {
    const [h, m] = hhmm.split(':').map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d;
  }

  private startOfDay(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private endOfDay(date: Date) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  private dayBounds(date: Date) {
    return { gte: this.startOfDay(date), lte: this.endOfDay(date) };
  }
}
