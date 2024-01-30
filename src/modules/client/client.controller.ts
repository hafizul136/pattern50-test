import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import mongoose from 'mongoose';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { IClient } from './interface/client.interface';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Post()
  async create(@Body() createClientDto: CreateClientDto): Promise<IClient>{
    return await this.clientService.create(createClientDto);
  }

  @Get()
  async findAll(): Promise<IClient[]>{
    return await this.clientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string | mongoose.Types.ObjectId): Promise<IClient> {
    return await this.clientService.findOne(id);
  }

  @Post('toggle-marketplace-payment/:id')
  async update(@Param('id') id: any, @Body() updateClientDto: UpdateClientDto): Promise<IClient>{
    return await this.clientService.update(id, updateClientDto);
  }
}
