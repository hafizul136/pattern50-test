import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { NestHelper } from '@common/helpers/NestHelper';
import { AggregationHelper } from '@common/helpers/aggregation.helper';
import { AwsServices } from '@common/helpers/aws.service';
import { ConstructObjectFromDtoHelper } from '@common/helpers/constructObjectFromDTO';
import { FileTypes } from '@common/helpers/file.type.matcher';
import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { Utils } from '@common/helpers/utils';
import { IListQuery } from '@common/interfaces/list-query.interface';
import { TechnologyCategoryService } from '@modules/technology-category/technology-category.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTechnologyToolsDto } from './dto/create-technology-tool.dto';
import { UpdateTechnologyToolDto } from './dto/update-technology-tool.dto';
import { TechnologyTool, TechnologyToolDocument } from './entities/technology-tool.entity';
import { ITechnologyTools } from './interfaces/technology-tool.interface';

@Injectable()
export class TechnologyToolService {

  constructor(
    @InjectModel(TechnologyTool.name)
    private readonly technologyToolModel: Model<TechnologyToolDocument>,
    private readonly technologyCategoryService: TechnologyCategoryService
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
  async create(createTechnologyToolsDto: CreateTechnologyToolsDto): Promise<{ count: number, tools: ITechnologyTools[] }> {
    // construct objects for multiple creation
    const toolsObjs = await Promise.all(createTechnologyToolsDto?.tools?.map(async tool => {
      // validate mongo ids
      MongooseHelper.getInstance().isValidMongooseId(tool?.categoryId, "category");
      MongooseHelper.getInstance().isValidMongooseId(tool?.typeId, "type");
      await this.technologyCategoryService.findOne(tool?.categoryId);
      await this.technologyCategoryService.findOneToolType(tool?.typeId);

      return ConstructObjectFromDtoHelper.constructToolsObj(tool);
    }));


    const tools: ITechnologyTools[] = await this.technologyToolModel.create(toolsObjs);

    return {
      count: tools?.length ?? 0,
      tools: tools
    }
  }

  async findAll(categoryId: string, query: IListQuery): Promise<{ data?: ITechnologyTools[], count?: number }> {
    // validate category id
    await this.technologyCategoryService.findOne(categoryId);

    let aggregate = [];
    let page: number = parseInt(query?.page), size: number = parseInt(query?.size);
    if (!query?.page || parseInt(query?.page) < 1) page = 1;
    if (!query?.size || parseInt(query?.size) < 1) size = 10;

    // filter by category
    AggregationHelper.filterByMatchAndQueriesAll(aggregate, [{ categoryId: new Types.ObjectId(categoryId) }]);

    // get the tool type
    AggregationHelper.lookupForIdForeignKey(aggregate, "tooltypes", "typeId", "type");
    AggregationHelper.unwindAField(aggregate, "type", true);

    // add new field and assign name there
    aggregate.push({
      $addFields: {
        type: "$type.name"
      }
    })

    // searching by 
    let trimmedQuery = null;
    if (query.query) {
      trimmedQuery = query.query.trim();
    }

    if (trimmedQuery) {
      const escapedQuery = trimmedQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      aggregate.push({
        $match: {
          $or: [
            { name: { $regex: escapedQuery, $options: "i" } },
            { "type": { $regex: escapedQuery, $options: "i" } }
          ]
        }
      });
    }

    // pagination and sorting
    AggregationHelper.getCountAndDataByFacet(aggregate, +page, +size);

    const tools: ITechnologyTools[] = await this.technologyToolModel.aggregate(aggregate).exec();

    return Utils.returnListResponse(tools);
  }

  async findOne(id: string) {
    // validate id
    MongooseHelper.getInstance().isValidMongooseId(id)

    //find the data
    const tool = await this.technologyToolModel.findById(id);

    if (NestHelper.getInstance().isEmpty(tool)) {
      ExceptionHelper.getInstance().defaultError(
        "Tool not found",
        "tool_not_found",
        HttpStatus.NOT_FOUND
      )
    }

    return tool;
  }

  update(id: number, updateTechnologyToolDto: UpdateTechnologyToolDto) {
    return `This action updates a #${id} technologyTool`;
  }

  remove(id: number) {
    return `This action removes a #${id} technologyTool`;
  }
}
