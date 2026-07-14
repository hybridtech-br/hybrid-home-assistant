import { Controller, Get } from '@nestjs/common';

@Controller('v1/health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: 'hha-core-api',
      version: '0.1.0-alpha.1',
      timestamp: new Date().toISOString(),
    };
  }
}
