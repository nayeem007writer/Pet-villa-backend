import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "@src/app/base/base.service";
import { asyncForEach, ENUM_ACL_DEFAULT_ROLES } from "@src/shared";
import { Code, DataSource, Repository } from "typeorm";

import { IAuthUser } from "@src/app/interfaces";
import { UserRole } from "../../user/entities/userRole.entity";
import {  imgBBServerFileUploader, r2ServerFileUploader } from "@src/util/serverFileHandler";
import { SuccessResponse } from "@src/app/types";
import { UserRoleService } from "../../user/services/userRole.service";
import { UserService } from "../../user/services/user.service";
import { User } from "../../user/entities/user.entity";
import { first } from "rxjs";

@Injectable()
export class ProfileService extends BaseService<User> {

  constructor(
    @InjectRepository(User)
    private readonly productRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly userRoleService: UserRoleService,
    private readonly userService: UserService,
  ) {
    super(productRepository);
  }
    async findUser(authUser: IAuthUser): Promise<User | SuccessResponse> {
      const user = await this.productRepository.findOne({
        where: { id: authUser.id },
        relations: ["userRoles", "userRoles.role"],
      });
        const obj = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
            username: user.firstName +" " +user.lastName,
            isActive : user.isActive,
        }
        return new SuccessResponse  ( "Profile fetched successfully", obj);
    }



    // by razu
    async updateProfile(id: any, payload: any): Promise<User | SuccessResponse> { 
      const user = await this.userService.findByIdBase(id as string);
      if (!user) {
        throw new BadRequestException("User not found");
      }
      const updatedUser = await this.userService.updateOneBase(id, payload);
      return new SuccessResponse("Profile updated successfully", updatedUser);
    }
    
}
