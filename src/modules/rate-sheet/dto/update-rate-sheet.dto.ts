import { StatusEnum } from '@common/enums/status.enum';
import { TrimAndValidateString } from '@common/validators/trim-string.validator';
import { IsEnum, IsIn, IsNotEmpty } from 'class-validator';

export class UpdateRateSheetDto {
    @IsNotEmpty()
    @IsNotEmpty()
    @TrimAndValidateString()
    @IsEnum(StatusEnum, {
        message: 'Status must be either active or inactive',
    })
    @IsIn([StatusEnum.ACTIVE, StatusEnum.INACTIVE], { message: 'Status must be either active or inactive' })
    status: StatusEnum;
}
