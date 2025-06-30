import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT ?? '5432'),
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_DATABASE,
    //   entities: [__dirname + '/../**/*.entity.{js,ts}'],
    //   synchronize: String(process.env.DB_SYNC) === 'true',
    // }),
    MongooseModule.forRoot(
      process.env.DB_MONGO_URI ?? 'mongodb://localhost/langfarm-ticket',
    ),
  ],
})
export class DatabaseModule {}
