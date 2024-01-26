import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NestHelper } from 'common/helpers/NestHelper';
import mongoose, { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client, ClientDocument } from './entities/client.entity';
import { IClient } from './interface/client.interface';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name)
    private clientModel: Model<ClientDocument>
  ) { }

  async validateClientCredentials(clientId: string, clientSecret: string): Promise<Client | null> {
    try {
      const clients = await this.clientModel.find({ _id: clientId, secret: clientSecret }).lean();
      const client = NestHelper.getInstance().arrayFirstOrNull(clients);
      if (client && client?.secret === clientSecret) {
        return client;
      }
    } catch {
      return null;
    }
  }

  async create(createClientDto: CreateClientDto) {
    const secret = await this.getSecret();
    const clientObj = {
      ...createClientDto,
      secret: secret
    }
    try {
      return await this.clientModel.create(clientObj);
    } catch (e) {
      ExceptionHelper.getInstance().defaultError(
        e?.message,
        "something_went_wrong",
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async getSecret() {
    const id = uuidv4();
    return id;
  }

  async findAll() {
    return await this.clientModel.find().exec();
  }

  async findOne(id: mongoose.Types.ObjectId | string) {
    await MongooseHelper.getInstance().isValidMongooseId(id);
    const client = await this.clientModel.findById(id).lean()

    if (NestHelper.getInstance().isEmpty(client)) {
      ExceptionHelper.getInstance().defaultError(
        "Invalid Id",
        "invalid_id",
        HttpStatus.BAD_REQUEST
      )
    }

    return client
  }
  async getClientById(id: any): Promise<IClient> {
    id = await MongooseHelper.getInstance().makeMongooseId(id);
    let client: IClient = null;
    if (!NestHelper.getInstance().isEmpty(id)) {
      client = await this.clientModel.findById(id).lean();
    }
    return client
  }

  async update(id: any, updateClientDto: UpdateClientDto) {
    await MongooseHelper.getInstance().isValidMongooseId(id);

    const client = await this.findOne(id);
    if (client?.marketPlacePayment === updateClientDto?.marketPlacePayment) {
      ExceptionHelper.getInstance().defaultError(
        "Already updated",
        "restricted",
        HttpStatus.BAD_REQUEST
      )
    }

    return await this.clientModel.findByIdAndUpdate(id, { marketPlacePayment: updateClientDto?.marketPlacePayment }, { new: true }).lean();
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
