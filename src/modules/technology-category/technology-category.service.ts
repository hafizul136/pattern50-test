import { StatusEnum } from '@common/enums/status.enum';
import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { NestHelper } from '@common/helpers/NestHelper';
import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTechnologyCategoriesDto } from './dto/create-technology-category.dto';
import { CreateToolTypesDto } from './dto/create-tool-types.dto';
import { UpdateTechnologyCategoryDto } from './dto/update-technology-category.dto';
import { TechnologyCategory, TechnologyCategoryDocument } from './entities/technology-category.entity';
import { ToolType, ToolTypeDocument } from './entities/tool-type.entity';
import { ITechnologyCategory } from './interfaces/technology-category.interface';
import { IToolType } from './interfaces/tool-type.interface';

@Injectable()
export class TechnologyCategoryService {
  constructor(
    @InjectModel(TechnologyCategory.name)
    private readonly technologyCategoryModel: Model<TechnologyCategoryDocument>,
    @InjectModel(ToolType.name)
    private readonly toolTypeModel: Model<ToolTypeDocument>
  ) { }

  async createToolType(createToolTypesDto: CreateToolTypesDto) {
    try {
      // construct objects
      const typesObj = createToolTypesDto?.types.map(type => {
        return {
          name: type?.name?.trim(),
          status: StatusEnum.ACTIVE
        }
      })
      const toolTypes = await this.toolTypeModel.create(typesObj);

      return toolTypes;

    } catch (err) {
      if (err.code === 11000) {
        ExceptionHelper.getInstance().defaultError(
          "Duplicate category",
          "duplicate_category",
          HttpStatus.CONFLICT
        )
      }
    }
  }

  // create technology categories
  async create(createTechnologyCategoriesDto: CreateTechnologyCategoriesDto): Promise<ITechnologyCategory[]> {
    try {
      // construct objects
      const categoriesObj = createTechnologyCategoriesDto?.categories.map(category => {
        return {
          name: category?.name?.trim(),
          status: StatusEnum.ACTIVE
        }
      })

      const categories = await this.technologyCategoryModel.create(categoriesObj);

      return categories;
    } catch (err) {
      if (err.code === 11000) {
        ExceptionHelper.getInstance().defaultError(
          "Duplicate category",
          "duplicate_category",
          HttpStatus.CONFLICT
        )
      }
    }
  }

  async findAll(): Promise<{ data?: ITechnologyCategory[], count?: number }> {
    const categories: ITechnologyCategory[] = await this.technologyCategoryModel.find();

    return {
      data: categories,
      count: categories?.length
    }
  }

  async findAllToolTypes(): Promise<{ data?: IToolType[], count?: number }> {
    const toolTypes: IToolType[] = await this.toolTypeModel.find();

    return {
      data: toolTypes,
      count: toolTypes?.length
    }
  }

  // find one category
  async findOne(id: string): Promise<ITechnologyCategory> {
    // validate id
    MongooseHelper.getInstance().isValidMongooseId(id, "category");

    const category = await this.technologyCategoryModel.findById(id);
    if (NestHelper.getInstance().isEmpty(category)) {
      ExceptionHelper.getInstance().defaultError(
        'Category Not Found',
        'category_not_found',
        HttpStatus.NOT_FOUND
      );
    }

    return category;
  }

  // find one category
  async findOneToolType(id: string): Promise<IToolType> {
    const toolType = await this.toolTypeModel.findById(id);
    if (NestHelper.getInstance().isEmpty(toolType)) {
      ExceptionHelper.getInstance().defaultError(
        'Tool Type Not Found',
        'tool_type_not_found',
        HttpStatus.NOT_FOUND
      );
    }

    return toolType;
  }

  update(id: number, updateTechnologyCategoryDto: UpdateTechnologyCategoryDto) {
    return `This action updates a #${id} technologyCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} technologyCategory`;
  }
}
