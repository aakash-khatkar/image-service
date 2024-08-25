import { IsString, IsOptional, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TagDto } from './TagDto';



/**
 * Data transfer object (DTO) with expected fields for image upload
 */
export class ImageDto {
  @IsString()
  @IsOptional()
  public title: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsBoolean()
  @IsOptional()
  public lockFile: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  @IsOptional()
  public tags?: TagDto[];
}