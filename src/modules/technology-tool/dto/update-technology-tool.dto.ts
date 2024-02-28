import { PartialType } from '@nestjs/mapped-types';
import { CreateTechnologyToolDto } from './create-technology-tool.dto';

export class UpdateTechnologyToolDto extends PartialType(CreateTechnologyToolDto) {}
