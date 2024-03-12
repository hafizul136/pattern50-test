import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { NestHelper } from '@common/helpers/NestHelper';
import { AggregationHelper } from '@common/helpers/aggregation.helper';
import { AwsServices } from '@common/helpers/aws.service';
import { ConstructObjectFromDtoHelper } from '@common/helpers/constructObjectFromDTO';
import { FileTypeMatcher, FileTypes } from '@common/helpers/file.type.matcher';
import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { Utils } from '@common/helpers/utils';
import { IListQuery } from '@common/interfaces/list-query.interface';
import { TechnologyCategoryService } from '@modules/technology-category/technology-category.service';
import { IUser } from '@modules/users/interfaces/user.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTechnologyToolDto, CreateTechnologyToolsDto } from './dto/create-technology-tool.dto';
import { UpdateTechnologyToolDto } from './dto/update-technology-tool.dto';
import { TechnologyTool, TechnologyToolDocument } from './entities/technology-tool.entity';
import { ITechnologyToolDetails, ITechnologyTools } from './interfaces/technology-tool.interface';

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

    // validate if the logo is png file
    if (!FileTypeMatcher.isPng(logo?.mimetype)) {
      ExceptionHelper.getInstance().defaultError(
        "File type must be PNG",
        "file_type_not_supported",
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


  // validate technology tool data and referred ids
  async validateToolObject(tool: CreateTechnologyToolDto): Promise<void> {
    // validate mongo ids
    MongooseHelper.getInstance().isValidMongooseId(tool?.categoryId, "category");
    MongooseHelper.getInstance().isValidMongooseId(tool?.typeId, "type");
    await this.technologyCategoryService.findOne(tool?.categoryId);
    await this.technologyCategoryService.findOneToolType(tool?.typeId);
  }

  // create tools under technology
  async create(createTechnologyToolsDto: CreateTechnologyToolsDto, user: IUser): Promise<{ count: number, tools: ITechnologyTools[] }> {
    // construct objects for multiple creation
    const toolsObjs = await Promise.all(createTechnologyToolsDto?.tools?.map(async tool => {
      // validate mongo ids
      await this.validateToolObject(tool);

      // construct objects
      return ConstructObjectFromDtoHelper.constructToolsObj(tool, user);
    }));


    const tools: ITechnologyTools[] = await this.technologyToolModel.create(toolsObjs);

    return {
      count: tools?.length ?? 0,
      tools: tools
    }
  }

  async findAll(categoryId: string, query: IListQuery, user: IUser): Promise<{ data?: ITechnologyTools[], count?: number }> {
    // validate category id
    await this.technologyCategoryService.findOne(categoryId);

    let aggregate = [];
    let page: number = parseInt(query?.page), size: number = parseInt(query?.size);
    if (!query?.page || parseInt(query?.page) < 1) page = 1;
    if (!query?.size || parseInt(query?.size) < 1) size = 10;

    // filter by client id
    AggregationHelper.filterByMatchAndQueriesAll(aggregate, [{ clientId: new Types.ObjectId(user?.clientId) }]);

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

    const tools: ITechnologyTools[] = await this.technologyToolModel
      .aggregate(aggregate)
      .exec();

    return Utils.returnListResponse(tools);
  }

  async findOne(id: string): Promise<ITechnologyToolDetails> {
    // validate id
    MongooseHelper.getInstance().isValidMongooseId(id)

    let aggregate = [];

    AggregationHelper.filterByMatchAndQueriesAll(aggregate, [{ _id: new Types.ObjectId(id) }]);

    AggregationHelper.lookupForCustomFields(aggregate, "tooltypes", "typeId", "_id", "type");
    AggregationHelper.unwindAField(aggregate, "type", true);

    AggregationHelper.lookupForCustomFields(aggregate, "technologycategories", "categoryId", "_id", "category");
    AggregationHelper.unwindAField(aggregate, "category", true);

    // project fields
    AggregationHelper.projectFields(aggregate, ["typeId", "categoryId"]);

    //find the data
    const tool = await this.technologyToolModel
      .aggregate(aggregate)
      .exec();

    if (NestHelper.getInstance().isEmpty(tool)) {
      ExceptionHelper.getInstance().defaultError(
        "Tool not found",
        "tool_not_found",
        HttpStatus.NOT_FOUND
      )
    }

    return NestHelper.getInstance().arrayFirstOrNull(tool);
  }

  async update(id: string, updateTechnologyToolDto: UpdateTechnologyToolDto, user: IUser): Promise<ITechnologyTools> {
    // validate toolId
    const tool: ITechnologyToolDetails = await this.findOne(id);

    // validate client id
    if (!tool.clientId.equals(user.clientId)) {
      ExceptionHelper.getInstance().defaultError(
        "You are not allowed to update this tool",
        "forbidden",
        HttpStatus.BAD_REQUEST
      )
    }

    // validate mongo reference ids
    await this.validateToolObject(updateTechnologyToolDto);

    // validate if update category & previous category is same
    if (!Utils.isEqualIds(tool?.category?._id, updateTechnologyToolDto?.categoryId)) {
      ExceptionHelper.getInstance().defaultError(
        "Category id did not match",
        "forbidden",
        HttpStatus.BAD_REQUEST
      )
    }

    // construct object
    const updateToolObject = ConstructObjectFromDtoHelper.constructToolsObj(updateTechnologyToolDto, user);

    // remove previous logo
    await AwsServices.S3.deleteFile(tool?.logoKey);

    // update tool
    const updatedTool: ITechnologyTools = await this.technologyToolModel
      .findByIdAndUpdate(id, updateToolObject, { new: true });

    if (NestHelper.getInstance().isEmpty(updatedTool)) {
      ExceptionHelper.getInstance().defaultError(
        "Failed to update",
        "failed_update",
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    return updatedTool;
  }

  remove(id: number) {
    return `This action removes a #${id} technologyTool`;
  }
}
