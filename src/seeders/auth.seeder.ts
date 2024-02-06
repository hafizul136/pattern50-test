import { ClientIDGetHelper } from "@common/helpers/getClientId.helper";
import { mainServiceRolePermissions } from "@common/rolePermissions";
import { PermissionsService } from "@modules/permissions/permissions.service";
import { RolesService } from "@modules/roles/roles.service";
import { Req } from "@nestjs/common";
import { Request } from "express";
import mongoose from "mongoose";
import { Seeder } from "nestjs-seeder";

export class AuthSeeder implements Seeder {
    constructor(
        // @InjectModel(Role.name)
        // private readonly roleModel: Model<RoleDocument>,

        // @InjectModel(Permission.name)
        // private readonly permissionModel: Model<PermissionDocument>,

        // @InjectModel(RolePermission.name)
        // private readonly rolePermissionModel: Model<RolePermissionDocument>,
        private readonly roleService: RolesService,
        private readonly permissionService: PermissionsService,
    ) { }

    async seed(): Promise<any> {
        // const rolePermissions = mainServiceRolePermissions();
        // for (const role of rolePermissions) {
        //     const roleExists = await this.roleService.findOneByName(role.roleName);
        //     for (const permission of role?.permissions) {
        //         const permissionExists = await this.permissionService.findOneByName(permission.name);

        //     }
        // }
        // console.log({ rolePermissions })
        return "Seeder run"
    }

    async drop(): Promise<any> {
        return 'Seeder drop'
    }
}