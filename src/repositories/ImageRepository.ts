import { ImageModel, ImageMetadata } from '../models/ImageModel';
import SearchResult from '../utils/rest/searchResult';
import { TagModel } from '../models/TagModel';
import { Types } from 'mongoose';
export class ImageRepository {
  public async saveImageMetadata(
    metadata: ImageMetadata,
  ): Promise<ImageMetadata> {
    const image = new ImageModel(metadata);
    return image.save();
  }

  public async findImageById(id: string): Promise<ImageMetadata | null> {
    return ImageModel.findById(id).exec();
  }

  public async findImageByHash(hash: string): Promise<ImageMetadata | null> {
    return ImageModel.findOne({ hash }).exec();
  }

  public async updateImageMetadata(
    id: string,
    data: Partial<ImageMetadata>,
  ): Promise<ImageMetadata | null> {
    if (data.tags && data.tags.length > 0) {
      const tagIds: Types.ObjectId[] = [];

      for (const tag of data.tags as any[]) {
        let existingTag = await TagModel.findOne({
          label: tag.label,
          color: tag.color,
        });
        if (!existingTag) {
          existingTag = new TagModel({ label: tag.label, color: tag.color });
          await existingTag.save();
        }
        tagIds.push(existingTag._id as Types.ObjectId);
      }

      data.tags = tagIds;
    }

    return ImageModel.findByIdAndUpdate(id, data, { new: true })
      .populate('tags', 'label color')
      .exec();
  }

  public async deleteImageById(id: string): Promise<void> {
    await ImageModel.findByIdAndDelete(id).exec();
  }

  public async listImages(query: any): Promise<SearchResult> {
    const filters: any = {};

    // Add filters based on tags if provided
    if (query.tags && query.tags.length > 0) {
      const tagIds = query.tags.map((tag: string) => new Types.ObjectId(tag));
      if (query.tagMatch === 'all') {
        filters.tags = { $all: tagIds };
      } else if (query.tagMatch === 'any') {
        filters.tags = { $in: tagIds };
      }
    }

    // Sorting logic
    const sort: any = {};
    if (query.sortOrder && query.orderBy) {
      switch (query.orderBy) {
        case 'modificationDateFile':
          sort.fileUpdatedAt = query.sortOrder === 'ASC' ? 1 : -1;
          break;
        case 'modificationDateMeta':
          sort.updatedAt = query.sortOrder === 'ASC' ? 1 : -1;
          break;
        case 'title':
          sort.title = query.sortOrder === 'ASC' ? 1 : -1;
          break;
        case 'fileSize':
          sort.fileSize = query.sortOrder === 'ASC' ? 1 : -1;
          break;
        default:
          sort.createdAt = query.sortOrder === 'ASC' ? 1 : -1; // Fallback sorting by creation date
      }
    } else {
      sort.createdAt = -1; // Default sorting by creation date in descending order
    }

    let total: number;
    let data: ImageMetadata[];

    if (query.includeDuplicates === false) {
      // Aggregation pipeline to filter out duplicates, apply tag filters, and calculate total
      const aggregationPipeline = [
        { $match: filters }, // Apply tag filters here
        {
          $group: {
            _id: '$hash',
            doc: { $first: '$$ROOT' }, // Group by unique hash
          },
        },
        { $replaceRoot: { newRoot: '$doc' } }, // Replace the root with the first document of each group
        { $sort: sort },
        {
          $lookup: {
            from: 'tags',
            localField: 'tags',
            foreignField: '_id',
            as: 'tags',
          },
        },
      ];

      // Calculate the total number of unique records
      const uniqueRecords =
        await ImageModel.aggregate(aggregationPipeline).exec();
      total = uniqueRecords.length;

      // Apply pagination to the unique records
      data = uniqueRecords.slice(
        query.offset || 0,
        (query.offset || 0) + (query.size || 25),
      );
    } else {
      // Calculate total without excluding duplicates
      total = await ImageModel.countDocuments(filters).exec();

      // Get the data with pagination and sorting
      data = await ImageModel.find(filters)
        .populate('tags', 'label color') // Populate the tags with label and color
        .skip(query.offset || 0)
        .limit(query.size || 25)
        .sort(sort)
        .exec();
    }

    return { total, data, length: data.length };
  }
  public async listNonDuplicateImages(query: any): Promise<ImageMetadata[]> {
    return ImageModel.find({ ...query, hash: { $exists: true } }).exec();
  }

  public async countReferencesByFileUrl(fileUrl: string): Promise<number> {
    return ImageModel.countDocuments({ fileUrl }).exec();
  }
}
