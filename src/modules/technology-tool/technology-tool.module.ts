import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnologyTool, TechnologyToolSchema } from './entities/technology-tool.entity';
import { TechnologyToolController } from './technology-tool.controller';
import { TechnologyToolService } from './technology-tool.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TechnologyTool.name, schema: TechnologyToolSchema }
    ])
  ],
  controllers: [TechnologyToolController],
  providers: [TechnologyToolService],
})
export class TechnologyToolModule { }
