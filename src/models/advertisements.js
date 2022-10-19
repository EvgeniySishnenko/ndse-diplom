const { Schema, model } = require("mongoose");

const advertisementsSchema = new Schema({
  shortText: { type: String, require: true },
  description: { type: String },
  images: { type: String },
  userId: {
    type: Schema.ObjectId,
    ref: "User",
    require: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  isDeleted: { type: Boolean, require: true },
});

module.exports = model("Advertisements ", advertisementsSchema);
