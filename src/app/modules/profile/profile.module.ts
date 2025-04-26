import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { HelpersModule } from "@src/app/helpers/helpers.module";
import { UserModule } from "../user/user.module";
import { AclModule } from "../acl/acl.module";
import { profile } from "console";
import { ProfileController } from "./controllers/profile.controller";
import { ProfileService } from "./services/profile.service";
import { User } from "../user/entities/user.entity";

const entities = [User];
const services = [ProfileService];
const controllers = [ProfileController];
const webControllers = [];
const modules = [HelpersModule, UserModule, AclModule ];

@Module({
  imports: [TypeOrmModule.forFeature(entities), ...modules],
  providers: [...services,],
  exports: [...services,],
  controllers: [...controllers, ...webControllers],
})
export class ProfileModule { }
