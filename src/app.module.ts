import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { Module } from '@nestjs/common';
import * as schema from './lib/infrastructure/db/schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DrizzlePGModule.registerAsync({
      tag: 'DB',
      inject: [ConfigService],
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
