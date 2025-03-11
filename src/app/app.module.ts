import { CacheModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseModule } from '@src/database/database.module';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionFilter } from './filters';
import { HelpersModule } from './helpers/helpers.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { AuthMiddleware } from './middlewares';
import { ENV } from '@src/env';

const MODULES = [
  CacheModule.register({
    isGlobal: true,
  }),
  DatabaseModule,
  HelpersModule,
  ServeStaticModule.forRoot({
    rootPath: join(process.cwd(), 'uploads'),
  }),
  AuthModule,
  UserModule,
  ProductModule
];
@Module({
  imports: [...MODULES],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: `/${ENV.api.API_PREFIX}/auth/login`, method: RequestMethod.POST },
        { path: `/${ENV.api.API_PREFIX}/uploads`, method: RequestMethod.GET },
        { path: "/auth/forgot-password/otp/send", method: RequestMethod.POST },
        { path: `/${ENV.api.API_PREFIX}/web/auth/send-otp`, method: RequestMethod.POST },
        { path: `/${ENV.api.API_PREFIX}/auth/reset-password-verify`, method: RequestMethod.POST },
        { path: `/${ENV.api.API_PREFIX}/auth/register`, method: RequestMethod.POST },
        { path: `/${ENV.api.API_PREFIX}/web/auth/verify-otp`, method: RequestMethod.POST },
        { path: "/users/send-sms-test", method: RequestMethod.POST },
        { path: `/${ENV.api.API_PREFIX}/users/referred-by-me`, method: RequestMethod.GET },
      ).forRoutes("*");
    // .forRoutes(
    //   { path: `/${ENV.api.API_PREFIX}/web/wishlists`, method: RequestMethod.POST },
    //   { path: `/${ENV.api.API_PREFIX}/web/cart-itmes`, method: RequestMethod.POST },
    //   { path: `/${ENV.api.API_PREFIX}/web/cart-itmes/{id}`, method: RequestMethod.PUT },
    //   { path: `/${ENV.api.API_PREFIX}/web/cart-itmes/{id}`, method: RequestMethod.DELETE },
    //   { path: `/${ENV.api.API_PREFIX}/web/carts/my`, method: RequestMethod.GET },
    // );
    // consumer.apply(AuthMiddleware).exclude("/api/v1/auth").forRoutes("*");
    // consumer.apply(ErrorHandlerMiddleware).forRoutes("*");
    // consumer.apply(RequestModifierMiddleware).forRoutes("*");
  }
}
