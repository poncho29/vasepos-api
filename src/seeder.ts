import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { SeederModule } from './seeder/seeder.module';

import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  const seeder = app.get(SeederService);

  await seeder.seed();

  await app.close();

  Logger.log('Seed complete');
}

bootstrap();
