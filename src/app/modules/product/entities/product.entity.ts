import { BaseEntity } from "@src/app/base";
import { ENUM_TABLE_NAMES } from "@src/shared";
import { Column, Entity, ManyToOne, OneToMany, RelationId } from "typeorm";

export enum ProductStatus {
  AVAILABLE = "Available", 
  ADOPTED = "Adopted",
  PENDING = "Pending",
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
  public static readonly SEARCH_TERMS: string[] = ["name", ];

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

  constructor() {
    super();
  }
}
