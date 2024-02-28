import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTechnologyToolDto } from './dto/create-technology-tool.dto';
import { UpdateTechnologyToolDto } from './dto/update-technology-tool.dto';
import { TechnologyTool, TechnologyToolDocument } from './entities/technology-tool.entity';

@Injectable()
export class TechnologyToolService {

  constructor(
    @InjectModel(TechnologyTool.name)
    private readonly technologyToolModel: Model<TechnologyToolDocument>
  ) { }

  create(createTechnologyToolDto: CreateTechnologyToolDto) {
    return 'This action adds a new technologyTool';
  }

  findAll() {
    return `This action returns all technologyTool`;
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
