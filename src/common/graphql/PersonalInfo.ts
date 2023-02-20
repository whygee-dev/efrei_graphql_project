import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Address, PartialAddressInput } from './Address';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@ObjectType()
@InputType('PersonalInfoInput')
export class PersonalInfo {
  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Field()
  @IsDate()
  birthDate: Date;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => Address)
  address: Address;
}

@InputType()
export class PartialPersonalInfoInput {
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  birthDate?: Date;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field(() => PartialAddressInput, { nullable: true })
  address?: PartialAddressInput;
}
