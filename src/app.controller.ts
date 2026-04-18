import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // This handles the root URL: http://<loadbalancer-url>/
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // This handles the health check: http://<loadbalancer-url>/health
  // This is what the Load Balancer will "ping" every 30 seconds
  @Get('health')
  checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'nest-boilerplate-api',
      environment: process.env.NODE_ENV || 'production'
    };
  }
}
