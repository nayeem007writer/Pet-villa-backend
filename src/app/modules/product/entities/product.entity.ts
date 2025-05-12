import { BaseEntity } from "@src/app/base";
import { ENUM_TABLE_NAMES } from "@src/shared";
import { Column, Entity, ManyToOne, OneToMany, RelationId } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Comment } from "./comment";

export enum ProductStatus {
  AVAILABLE = "Available", 
  ADOPTED = "Adopted",
  PENDING = "Pending",
  APPROVED = "APPROVED",
}

export enum PetSpecies {
  DOG = "Dog",
  CAT = "Cat",
  BIRD = "Bird",
  OTHER = "Other"
}

export enum PetGender { 
  MALE = 'male',
  FEMALE = 'female'
}

@Entity(ENUM_TABLE_NAMES.PETS)
export class Product extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ["name","age","species", "user" ];

  @Column({ nullable: false })
  name?: string;

  @Column({ nullable: false, default: PetSpecies.DOG })
  species?: string;


  @Column({ nullable: true })
  breed?: string;

  @Column({nullable: true, default: "0"})
  age?: string;

  @Column({ type: "enum", enum: PetGender, nullable: true })
  gender?: PetGender;

  @Column({ nullable: true })
  productImages?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({type: "enum", enum: ProductStatus, default: ProductStatus.PENDING})
  status?: ProductStatus;

  @ManyToOne((t) => User, (e) => e.products, { onDelete: "CASCADE" })
  user?: User ;

  @OneToMany((t) => Comment, (e) => e.product, { cascade: true, onDelete: 'CASCADE' })
  comments?: Comment [];
  
  constructor() {
    super();
  }
}
