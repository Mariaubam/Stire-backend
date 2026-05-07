import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { TopicsModule } from './topics/topics.module';
import { LearningUnitsModule } from './learning-units/learning-units.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ProgressModule } from './progress/progress.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_NAME', 'stire_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: config.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ClassesModule,
    TopicsModule,
    LearningUnitsModule,
    EvaluationsModule,
    SubmissionsModule,
    ProgressModule,
    MessagesModule,
  ],
})
export class AppModule {}
