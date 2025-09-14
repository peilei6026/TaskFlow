import { Module } from '@nestjs/common';
import { QuadrantController } from './quadrant.controller';
import { QuadrantService } from './quadrant.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QuadrantController],
  providers: [QuadrantService],
})
export class QuadrantModule {}