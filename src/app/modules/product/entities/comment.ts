import { BaseEntity } from "@src/app/base/base.entity";
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from "@src/shared";
import {  Column, Entity, ManyToOne } from "typeorm";
import { Product } from "./product.entity";

@Entity(ENUM_TABLE_NAMES.COMMENTS)
export class Comment extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = [
    'email',
    'address',
    'phoneNumber',
  ];

  @Column({ nullable: true })
  address?: string;


  @Column({  nullable: true })
  phoneNumber?: string;

  @Column({  nullable: true })
  username?: string;

  @Column({  nullable: true, })
  email?: string;

  @Column({  nullable: true ,type: ENUM_COLUMN_TYPES.VARCHAR})
  description?: string;

  @ManyToOne((t) => Product, product => product.comments)
  product: Product;



  constructor() {
    super();
  }
}
