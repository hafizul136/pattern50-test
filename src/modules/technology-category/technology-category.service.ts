import { StatusEnum } from '@common/enums/status.enum';
import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTechnologyCategoriesDto } from './dto/create-technology-category.dto';
import { UpdateTechnologyCategoryDto } from './dto/update-technology-category.dto';
import { TechnologyCategory, technologyCategoryDocument } from './entities/technology-category.entity';
import { ITechnologyCategory } from './interfaces/technology-category.interface';

@Injectable()
export class TechnologyCategoryService {
  constructor(
    @InjectModel(TechnologyCategory.name)
    private readonly technologyCategoryModel: Model<technologyCategoryDocument>
  ) { }

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

  findOne(id: number) {
    return `This action returns a #${id} technologyCategory`;
  }

  update(id: number, updateTechnologyCategoryDto: UpdateTechnologyCategoryDto) {
    return `This action updates a #${id} technologyCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} technologyCategory`;
  }
}
