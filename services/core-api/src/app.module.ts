import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [HealthController, OnboardingController],
  providers: [PrismaService, OnboardingService],
})
export class AppModule {}
