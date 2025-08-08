// Require the mongoose module
import mongoose from "mongoose";

const imageStorageSchemaObject = new mongoose.Schema(
  {
    imageType: {
      type: String,
      required: true,
    },
    // path within firebase to locate the folder / image
    imagePath: {
      type: String,
      required: true,
    },
    // exposed url that provides secure read from our proxy to firebase storage
    exposedUrl: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

const ImageStorage = mongoose.model("ImageStorage", imageStorageSchemaObject);

export { ImageStorage };
