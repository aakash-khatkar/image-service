import { IsDefined, IsString, IsOptional, IsArray, IsBoolean, ValidateNested } from 'class-validator';
export class TagDto {
    @IsString()
    @IsDefined()
    public label: string;
  
    @IsString()
    @IsDefined()
    public color: string;
  }