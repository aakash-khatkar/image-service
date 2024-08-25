import { SortOrder } from '../../constants'
import { OrderBy } from '../../constants/OrderBy';

/**
 * Used for filtering and paging results for getAll requests
 */
export default interface URLParams {
  q?: string;
  size?: number;
  offset?: number;
  from?: string;
  to?: string;
  sortOrder?: SortOrder;
  orderBy?: OrderBy;
  [key: string]: any;
}
