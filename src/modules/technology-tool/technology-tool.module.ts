import { AuthService } from '@modules/auth/auth.service';
import { Permission, PermissionSchema } from '@modules/permissions/entities/permission.entity';
import { PermissionsService } from '@modules/permissions/permissions.service';
import { RolePermission, RolePermissionSchema } from '@modules/role-permission/entities/role-permission.entity';
import { Role, RoleSchema } from '@modules/role/entities/role.entity';
import { RoleService } from '@modules/role/role.service';
import { TechnologyCategory, TechnologyCategorySchema } from '@modules/technology-category/entities/technology-category.entity';
import { ToolType, ToolTypeSchema } from '@modules/technology-category/entities/tool-type.entity';
import { TechnologyCategoryService } from '@modules/technology-category/technology-category.service';
import { UserRole, UserRoleSchema } from '@modules/user-role/entities/user-role.entity';
import { UserRoleService } from '@modules/user-role/user-role.service';
import { User, UserSchema } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/user.service';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnologyTool, TechnologyToolSchema } from './entities/technology-tool.entity';
import { TechnologyToolController } from './technology-tool.controller';
import { TechnologyToolService } from './technology-tool.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TechnologyTool.name, schema: TechnologyToolSchema },
      { name: User.name, schema: UserSchema },
      { name: UserRole.name, schema: UserRoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: RolePermission.name, schema: RolePermissionSchema },
      { name: TechnologyCategory.name, schema: TechnologyCategorySchema },
      { name: ToolType.name, schema: ToolTypeSchema },
    ])
  ],
  controllers: [TechnologyToolController],
  providers: [TechnologyToolService, JwtService, UsersService, AuthService, UserRoleService, RoleService, PermissionsService, TechnologyCategoryService],
})
export class TechnologyToolModule { }
