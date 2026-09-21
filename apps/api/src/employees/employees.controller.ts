import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // Public — used by the customer booking flow.
  @Get()
  findAll(@Query('serviceId') serviceId?: string) {
    return serviceId
      ? this.employeesService.findByService(serviceId)
      : this.employeesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Post()
  create(@Body() body: any) {
    return this.employeesService.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Post(':id/working-hours')
  setWorkingHours(@Param('id') id: string, @Body() body: { hours: any[] }) {
    return this.employeesService.setWorkingHours(id, body.hours);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Post(':id/days-off')
  addDayOff(@Param('id') id: string, @Body() body: { date: string; reason?: string }) {
    return this.employeesService.addDayOff(id, body.date, body.reason);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Post(':id/breaks')
  addBreak(@Param('id') id: string, @Body() body: any) {
    return this.employeesService.addBreak(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @Post(':id/services/:serviceId')
  assignService(@Param('id') id: string, @Param('serviceId') serviceId: string) {
    return this.employeesService.assignService(id, serviceId);
  }
}
