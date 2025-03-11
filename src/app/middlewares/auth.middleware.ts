import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTHelper } from '../helpers';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtHelper: JWTHelper) {}
  async use(req: any, res: Response, next: Function) {
      // Allow access to static files without authentication
      if (req.path.startsWith('/api/v1/uploads/')) {
        return next(); // Skip authentication for images
      }
    const token = this.jwtHelper.extractToken(req.headers);
    const verifiedUser: any = await this.jwtHelper.verify(token);


    if (!verifiedUser) {
      throw new UnauthorizedException('Unauthorized Access Detected');
    }

    req.verifiedUser = verifiedUser.user;

    next();
  }
}
