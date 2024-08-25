import mongoose, { Document, Schema } from 'mongoose';

export interface ImageMetadata extends Document {
  title: string;
  description: string;
  lockFile: boolean;
  createdAt: Date;
  updatedAt: Date;
  fileUpdatedAt: Date;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  tags: mongoose.Types.ObjectId[]; // References to Tag documents
  hash?: string;
}

const ImageSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  lockFile: { type: Boolean, default: false },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  fileUpdatedAt: { type: Date, required: true },
  fileSize: { type: Number, required: true },
  fileType: { type: String, required: true },
  fileUrl: { type: String, required: true },
  hash: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }], // Reference to Tag collection
});

export const ImageModel = mongoose.model<ImageMetadata>('Image', ImageSchema);
