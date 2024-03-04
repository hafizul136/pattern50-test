import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { NestHelper } from '@common/helpers/NestHelper';
import { AwsServices } from '@common/helpers/aws.service';
import { ConstructObjectFromDtoHelper } from '@common/helpers/constructObjectFromDTO';
import { FileTypes } from '@common/helpers/file.type.matcher';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTechnologyToolsDto } from './dto/create-technology-tool.dto';
import { UpdateTechnologyToolDto } from './dto/update-technology-tool.dto';
import { TechnologyTool, TechnologyToolDocument } from './entities/technology-tool.entity';

@Injectable()
export class TechnologyToolService {

  constructor(
    @InjectModel(TechnologyTool.name)
    private readonly technologyToolModel: Model<TechnologyToolDocument>
  ) { }

  // upload logo to aws s3
  async uploadLogo(logo: Express.Multer.File) {
    if (NestHelper.getInstance().isEmpty(logo)) {
      ExceptionHelper.getInstance().defaultError(
        "Logo File Is Empty",
        "logo_file_is_empty",
        HttpStatus.BAD_REQUEST
      )
    }

    const s3Response = await AwsServices.S3.uploadFile(logo, FileTypes.IMAGE);
    if (s3Response == -1) {
      return {
        error: 'FILE TYPE NOT ALLOWED',
      };
    }

    return s3Response;
  }

  // create tools under technology
  async create(createTechnologyToolsDto: CreateTechnologyToolsDto) {
    // construct objects for multiple creation
    const toolsObjs = createTechnologyToolsDto?.tools?.map(tool =>
      ConstructObjectFromDtoHelper.constructToolsObj(tool));

    const tools = await this.technologyToolModel.create(toolsObjs);

    return {
      count: tools?.length ?? 0,
      tools: tools
    }
  }

  findAll() {
    // get the category type id
  }

  findOne(id: number) {
    return `This action returns a #${id} technologyTool`;
  }

  update(id: number, updateTechnologyToolDto: UpdateTechnologyToolDto) {
    return `This action updates a #${id} technologyTool`;
  }

  remove(id: number) {
    return `This action removes a #${id} technologyTool`;
  }
}
