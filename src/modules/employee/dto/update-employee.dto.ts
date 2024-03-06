import { StatusEnum } from '@common/enums/status.enum';
import { TrimAndValidateString } from '@common/validators/trim-string.validator';
import { IsNotEmpty, IsEnum, IsIn } from 'class-validator';
import { CreateEmployeeDTO } from './create-employee.dto';

export class UpdateEmployeeDto extends CreateEmployeeDTO { }

export class UpdateEmployeeStatus{
    @IsNotEmpty()
    @IsNotEmpty()
    @TrimAndValidateString()
    @IsEnum(StatusEnum, {
        message: 'Status must be either active or inactive',
    })
    @IsIn([StatusEnum.ACTIVE, StatusEnum.INACTIVE], { message: 'Status must be either active or inactive' })
    status: StatusEnum;
}
