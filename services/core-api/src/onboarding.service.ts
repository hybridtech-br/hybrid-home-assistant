import { Injectable } from '@nestjs/common';
import { UserProfile } from '@prisma/client';
import { OnboardingDto } from './onboarding.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: OnboardingDto) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          profile: dto.profile === '