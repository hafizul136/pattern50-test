import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CreateUserRoleDto, IEnvironment } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { IUserRole } from './interfaces/user-role.interface';
import { UserRoleService } from './user-role.service';


@Controller('user-role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) { }

  @Get('envs')
  async getEnvs(): Promise<IEnvironment> {
    return await this.userRoleService.getEnvs();
  }

  @Post()
  async create(@Body() createUserRoleDto: CreateUserRoleDto): Promise<IUserRole> {
    return await this.userRoleService.create(createUserRoleDto);
  }

  @Get()
  async findAll(): Promise<IUserRole[]> {
    return await this.userRoleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IUserRole> {
    return await this.userRoleService.findOne(id);
  }

  @Post("update-object-id")
  async updateALLUserRoleWithObjectId(): Promise<IUserRole[]>{
    return await this.userRoleService.makeAllObjectId();
  }

}
