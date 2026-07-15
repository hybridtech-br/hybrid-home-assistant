import { Injectable } from '@nestjs/common';
import { HomeHealthStatus, UserProfile } from '@prisma/client';
import { OnboardingDto } from './onboarding.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: OnboardingDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          profile: dto.profile === 'integrator' ? UserProfile.INTEGRATOR : UserProfile.RESIDENT,
        },
      });

      const home = await tx.home.create({
        data: {
          name: dto.homeName.trim(),
          healthStatus: HomeHealthStatus.PREPARING,
          ownerId: user.id,
          dna: {
            create: {
              priorities: dto.priorities ?? [],
            },
          },
        },
        include: { dna: true },
      });

      const session = await tx.session.create({
        data: {
          userId: user.id,
          homeId: home.id,
          nextStep: 'device-discovery',
        },
      });

      return { user, home, session };
    });

    return {
      id: result.session.id,
      profile: dto.profile,
      home: {
        id: result.home.id,
        name: result.home.name,
        priorities: result.home.dna?.priorities ?? [],
        healthStatus: result.home.healthStatus.toLowerCase(),
      },
      nextStep: result.session.nextStep,
      createdAt: result.session.createdAt.toISOString(),
    };
  }
}
