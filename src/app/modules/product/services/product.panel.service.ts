import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "@src/app/base/base.service";
import { asyncForEach, ENUM_ACL_DEFAULT_ROLES } from "@src/shared";
import { Code, DataSource, Repository } from "typeorm";
import { CreateProductDTO } from "../dtos";
import { PetSpecies, Product } from "../entities/product.entity";
import { IAuthUser } from "@src/app/interfaces";
import { UserRole } from "../../user/entities/userRole.entity";
import {  imgBBServerFileUploader, r2ServerFileUploader } from "@src/util/serverFileHandler";
import { SuccessResponse } from "@src/app/types";
import { UserRoleService } from "../../user/services/userRole.service";
import { UserService } from "../../user/services/user.service";
import { User } from "../../user/entities/user.entity";

@Injectable()
export class PanelProductService extends BaseService<Product> {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
    private readonly userRoleService: UserRoleService,
    private readonly userService: UserService,
  ) {
    super(productRepository);
  }

  async checkUserRole(
    authUser: IAuthUser,
    requiredRole: string
  ): Promise<void> {
    const userRoles = (await this.userRoleService.findAllBase(
      { user: authUser.id as any },
      { relations: ["role"], withoutPaginate: true }
    )) as UserRole[];

    const roles = userRoles.map((uR) => uR.role.title);
    if (!roles.includes(requiredRole)) {
      throw new UnauthorizedException("You are not authorized");
    }
  }

async findUser(
    id: any ) : Promise<User> {
      const user = await this.userService.findByIdBase(id as string);
   return user;  
  }

  async createProductsWithImageWithSpecialProduct(
    data: CreateProductDTO,
    files: any,
    authUser: IAuthUser
  ) {
    console.log(authUser)
    // await this.checkUserRole(authUser, ENUM_ACL_DEFAULT_ROLES.SUPER_ADMIN);
    const docPayload: any[] = [];
    // console.log(data)

//  console.log(files.productImages[0].path)
  let nameImage = files.productImages[0].filename;
  console.log(nameImage)
  console.log(nameImage)
  console.log(nameImage)
    if (files?.productImages) {
      const jobImageObj = {
        title: 'image',
        type: files.productImages[0].mimetype,
        url: `http://[::1]:3000/api/v1/uploads/${nameImage}`,
      };
      docPayload.push(jobImageObj);
    }


    const user = await this.userService.findByIdBase(authUser.id as string);
    console.log
    

    const newProductObj = {
      name: data.name,
      description: data.description,  
      PetSpecies: data.species,
      breed: data.breed,
      user,
      age: 
      data.age,
      productImages: docPayload.find(doc => doc.title === 'image')?.url || null,
    }
    

    const  product = await this.createOneBase(newProductObj);
    return new SuccessResponse('Product created successfully', product);
  }

  async updateOne(id: string, data: any, files: any): Promise<Product> {
    return this.updateOneBase(id, data);
  }
}
