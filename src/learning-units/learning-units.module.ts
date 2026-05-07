import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningUnit } from './entities/learning-unit.entity';
import { LearningUnitsService } from './learning-units.service';
import { LearningUnitsController } from './learning-units.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LearningUnit])],
  providers: [LearningUnitsService],
  controllers: [LearningUnitsController],
  exports: [LearningUnitsService],
})
export class LearningUnitsModule {}
