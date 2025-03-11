import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { HelpersModule } from "@src/app/helpers/helpers.module";
import { PanelProductController } from "./controllers/pet.panel.controller";
import { ProductController } from "./controllers/product.controller";
import { PanelProductService } from "./services/product.panel.service";
import { ProductService } from "./services/product.service";
import { UserModule } from "../user/user.module";
import { AclModule } from "../acl/acl.module";

const entities = [Product];
const services = [ProductService, PanelProductService,];
const controllers = [ProductController, PanelProductController,];
const webControllers = [];
const modules = [HelpersModule, UserModule, AclModule];

@Module({
  imports: [TypeOrmModule.forFeature(entities), ...modules],
  providers: [...services,],
  exports: [...services,],
  controllers: [...controllers, ...webControllers],
})
export class ProductModule { }
