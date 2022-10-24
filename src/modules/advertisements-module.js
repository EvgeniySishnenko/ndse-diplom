const Advertisements = require("../models/advertisements");

class AdvertisementsModule {
  async create(data) {
    try {
      const {
        data: { shortText, description, tags },
        path,
        userId,
      } = data;

      const advertisements = new Advertisements({ shortText, userId, description, images: path, tags });
      await advertisements.save();
      return advertisements;
    } catch (error) {
      return error;
    }
  }
  async remove({ id, userId }) {
    try {
      const result = await Advertisements.update({ _id: id, userId }, { $set: { isDeleted: true } });
      return Boolean(result.modifiedCount);
    } catch (error) {
      return error;
    }
  }
  async find({ description, shortText, userId, tags }) {
    try {
      const advertisement = await Advertisements.find({
        description: { $regex: description },
        shortText: { $regex: shortText },
        userId: userId,
        tags: tags,
      });
      return advertisement;
    } catch (error) {
      return error;
    }
  }
}

module.exports = new AdvertisementsModule();
