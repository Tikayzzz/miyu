import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  // GET /availability?employeeId=...&date=2026-09-10&durationMin=45
  @Get()
  getSlots(
    @Query('employeeId') employeeId: string,
    @Query('date') date: string,
    @Query('durationMin') durationMin: string,
  ) {
    if (!employeeId || !date || !durationMin) {
      throw new BadRequestException('employeeId, date, and durationMin are required');
    }
    return this.availabilityService.getAvailableSlots(employeeId, date, Number(durationMin));
  }
}
