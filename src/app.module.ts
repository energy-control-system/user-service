import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { Module } from '@nestjs/common';
import * as schema from './lib/infrastructure/db/schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzlePGModule.registerAsync({
      tag: 'DB',
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory(config: ConfigService) {
        return {
          pg: {
            connection: 'pool',
            config: {
              connectionString: config.getOrThrow<string>('DATABASE_URL'),
            },
          },
          config: { schema: { ...schema } },
        };
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
