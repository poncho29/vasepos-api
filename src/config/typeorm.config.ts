import { join } from 'path';

import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: +configService.get('DATABASE_PORT'),
  database: configService.get('DATABASE_NAME'),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASS'),
  ssl: configService.get('DATABASE_SSL') === 'true',
  entities: [join(__dirname + '../../**/*.entity{.js,.ts}')],
  synchronize: true,
});
