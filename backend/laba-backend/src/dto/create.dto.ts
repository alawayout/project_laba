import { IsNumber } from 'class-validator';

export class CreateDtoClass {
  @IsNumber()
  num!: number;
}
