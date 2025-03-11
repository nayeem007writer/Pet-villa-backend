import {
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base/base.service';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource
  ) {
    super(productRepository);
  }

  async createOne(data: any, files: any): Promise<Product> {
    // if (data.brand == '')
    //   data.brand = null
    return this.createOneBase(data);
  }

  async updateOne(id: string, data: any, files: any): Promise<Product> {
    return this.updateOneBase(id, data);
  }
}
