import mongoose, { Document, Schema } from 'mongoose';
const TagSchema: Schema = new Schema({
  label: { type: String, required: true },
  color: { type: String, required: true },
});

export const TagModel = mongoose.model('Tag', TagSchema);
