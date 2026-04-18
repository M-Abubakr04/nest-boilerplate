import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { getSwaggerConfiguration } from './swagger';
import { ValidationPipe } from '@nestjs/common';
import { exceptionFilters } from './common/web/filters/index.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const configService: ConfigService = app.get(ConfigService);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(...exceptionFilters);
  
  await getSwaggerConfiguration(app);

  // FIXED: Added '0.0.0.0' to allow the container to accept external traffic 
  // and a fallback port of 3000 if the config variable is missing.
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`Application is running on: http://0.0.0.0:${port}`);
}
bootstrap();
