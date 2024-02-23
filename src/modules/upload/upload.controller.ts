
import { Body, Controller, Delete, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UploadDto } from './dto/upload.dto';
import { UploadService } from './upload.service';
import { Utils } from '@common/helpers/utils';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('file')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Specify the destination folder for storing uploaded files
      filename: (req, file, cb) => {
        // Generate a unique file name
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${path.extname(file.originalname)}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Logic to handle the uploaded file
    return { filename: file.filename }; // Return the uploaded file name
  }

  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 20, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        // Generate a unique file name
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${path.extname(file.originalname)}`);
      },
    }),
  }))
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() uploadDto: UploadDto) {
    // Logic to handle the uploaded files
    Utils.inspect('files', files)
    Utils.inspect('uploadDto', uploadDto)
    const filenames = files.map(file => file.filename);
    return { filenames }; // Return the uploaded file names
  }

  @Delete('clear')
  clearUploadsFolder() {
    const uploadsFolder = './uploads';

    // Check if the uploads folder exists
    if (!fs.existsSync(uploadsFolder)) {
      return { message: 'Uploads folder is already empty.' };
    }

    // Delete all files in the uploads folder
    fs.readdirSync(uploadsFolder).forEach((file) => {
      const filePath = path.join(uploadsFolder, file);
      fs.unlinkSync(filePath);
    });

    return { message: 'Uploads folder has been cleared.' };
  }
}
