import { PartialType } from '@nestjs/mapped-types';
import { CreateRateSheetDto } from './create-rate-sheet.dto';

export class UpdateRateSheetDto extends PartialType(CreateRateSheetDto) {}
