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
import { Comment } from "../entities/comment";
import { Product } from "../entities/product.entity";
import { ProductService } from "./product.service";
import { CreateCommentDTO } from "../dtos/comment/create.dto";

@Injectable()
export class CommentService extends BaseService<Comment> {

  constructor(
    @InjectRepository(Comment)
    private readonly productRepository: Repository<Comment>,
    private readonly dataSource: DataSource,
    private readonly userRoleService: UserRoleService,
    private readonly userService: UserService,
    private readonly productRepo: ProductService
  ) {
    super(productRepository);
  }


    async createComment(id:string, body: CreateCommentDTO,authuser: any): Promise<SuccessResponse | Comment> {
      const product = await this.productRepo.findByIdBase(id, { relations: ["user"] });
      if (!product) {
        throw new BadRequestException("Product not found");
      }
      const user = await this.userService.findByIdBase(authuser, { relations: ["userRoles"] });
      if (!user) {
        throw new BadRequestException("User not found");
      }
      const comment = await this.productRepository.create({
        ...body,
        username: user.username,
        address: body.address
        ,description: body.description,
        email: user.email,
        phoneNumber: user.phoneNumber,
        product: product
      });
      const result = await this.productRepository.save(comment);

      return new SuccessResponse(" comment added", result)
    }


    
}
