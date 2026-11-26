import mongoose from 'mongoose';

export const SWIPE_ACTIONS = Object.freeze([
  'PASS',
  'LIKE',
  'SUPER_LIKE',
]);

const swipeSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    profileId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    action: {
      type: String,
      required: true,
      enum: SWIPE_ACTIONS,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

swipeSchema.index(
  {
    sessionId: 1,
    profileId: 1,
  },
  {
    unique: true,
  },
);

const Swipe = mongoose.model('Swipe', swipeSchema);

export default Swipe;