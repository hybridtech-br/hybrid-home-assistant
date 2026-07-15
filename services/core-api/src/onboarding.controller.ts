import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OnboardingDto } from './onboarding.dto';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: OnboardingDto) {
    const data = await this.onboardingService.create(dto);
    return { data };
  }
}
