import { PartialType } from '@nestjs/mapped-types';
import { CreateTechnologyCategoryDto } from './create-technology-category.dto';

export class UpdateTechnologyCategoryDto extends PartialType(CreateTechnologyCategoryDto) {}
