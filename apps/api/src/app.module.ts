import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './services/services.module';
import { EmployeesModule } from './employees/employees.module';
import { CustomersModule } from './customers/customers.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ServicesModule,
    EmployeesModule,
    CustomersModule,
    AvailabilityModule,
    BookingsModule,
  ],
})
export class AppModule {}
