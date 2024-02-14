import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { mainServiceRolePermissions } from '@common/rolePermissions';
import { RolesService } from '@modules/roles/roles.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { NestHelper } from '../../common/helpers/NestHelper';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client, ClientDocument } from './entities/client.entity';
import { IClient } from './interface/client.interface';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name)
    private clientModel: Model<ClientDocument>,
    private readonly roleService: RolesService,
  ) { }

  async validateClientCredentials(clientId: string, clientSecret: string): Promise<Client | null> {
    console.log('okkkkkk')
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

  async create(createClientDto: CreateClientDto): Promise<IClient> {
    const secret: string = await this.getSecret();
    const clientObj = {
      ...createClientDto,
      secret: secret
    }
    try {
      const client = await this.clientModel.create(clientObj);

      const rolePermissions = mainServiceRolePermissions();
      for (const role of rolePermissions) {
        await this.roleService.createRolesAndAddPermission(role.roleName, client?._id, role?.permissions);
      }
      return client
    } catch (e) {
      ExceptionHelper.getInstance().defaultError(
        e?.message,
        "something_went_wrong",
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async getSecret(): Promise<string> {
    const id = uuidv4();
    return id;
  }

  async findAll(): Promise<IClient[]> {
    return await this.clientModel.find().exec();
  }

  async findOne(id: mongoose.Types.ObjectId): Promise<IClient> {
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
  async getClientById(id: string): Promise<IClient> {
    let oid: mongoose.Types.ObjectId = await MongooseHelper.getInstance().makeMongooseId(id);
    let client: IClient = null;
    if (!NestHelper.getInstance().isEmpty(oid)) {
      client = await this.clientModel.findById(oid).lean();
    }
    return client
  }

  async update(id: mongoose.Types.ObjectId, updateClientDto: UpdateClientDto): Promise<IClient> {
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
}
