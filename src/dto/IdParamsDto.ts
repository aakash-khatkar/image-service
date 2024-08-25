import { IsDefined } from 'class-validator';
import { IsObjectId } from '../utils/validationUtil';

/**
 * Data transfer object (DTO) with expected fields for id.
 */
export class IdParamsDto {
  @IsObjectId({ message: 'Invalid ObjectId format' })
  @IsDefined()
  public id: string;
}