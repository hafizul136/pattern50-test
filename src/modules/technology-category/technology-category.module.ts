import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnologyCategory, TechnologyCategorySchema } from './entities/technology-category.entity';
import { TechnologyCategoryController } from './technology-category.controller';
import { TechnologyCategoryService } from './technology-category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TechnologyCategory.name, schema: TechnologyCategorySchema }
    ])
  ],
  controllers: [TechnologyCategoryController],
  providers: [TechnologyCategoryService],
})
export class TechnologyCategoryModule { }
