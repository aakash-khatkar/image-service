import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsArray, ArrayMinSize, Min } from "class-validator";
import { SortOrder } from "../constants/SortOrder";
import { OrderBy } from "../constants/OrderBy";


export class SearchParamsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public size: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public offset: number;

  @IsOptional()
  @IsBoolean()
  public includeDuplicates: boolean = false;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  public tags: string[];

  @IsOptional()
  @IsEnum(['all', 'any'])
  public tagMatch: 'all' | 'any' = 'any';

  @IsOptional()
  @IsEnum(OrderBy)
  public orderBy: OrderBy;

  @IsOptional()
  @IsEnum(SortOrder)
  public sortOrder: SortOrder = SortOrder.DESC;
}