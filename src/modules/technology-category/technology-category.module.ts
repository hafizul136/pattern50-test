import { AuthService } from '@modules/auth/auth.service';
import { Permission, PermissionSchema } from '@modules/permissions/entities/permission.entity';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';
import { Role, RoleSchema } from '@modules/role/entities/role.entity';
import { RoleService } from '@modules/role/role.service';
import { UserRole, UserRoleSchema } from '@modules/user-role/entities/user-role.entity';
import { UserRoleService } from '@modules/user-role/user-role.service';
import { User, UserSchema } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/user.service';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnologyCategory, TechnologyCategorySchema } from './entities/technology-category.entity';
import { TechnologyCategoryController } from './technology-category.controller';
import { TechnologyCategoryService } from './technology-category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TechnologyCategory.name, schema: TechnologyCategorySchema },
      { name: User.name, schema: UserSchema },
      { name: UserRole.name, schema: UserRoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
    ])
  ],
  controllers: [TechnologyCategoryController],
  providers: [TechnologyCategoryService, JwtService, UsersService, AuthService, UserRoleService, RoleService, PermissionsService],
})
export class TechnologyCategoryModule { }
