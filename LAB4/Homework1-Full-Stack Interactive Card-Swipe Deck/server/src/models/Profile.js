import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
      validate: Number.isInteger,
    },

    bio: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    avatar: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;