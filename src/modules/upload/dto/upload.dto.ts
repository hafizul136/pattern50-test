

import { IsArray, IsNotEmpty } from 'class-validator';

export class UploadDto {
    // @IsNotEmpty()
    // @IsArray()
    // files: any[]; // Change any[] to the appropriate file type if you have a specific file structure

    // Add any additional properties you want to send in the request body
    // For example:
    // @IsNotEmpty()
    additionalData: string;
}
