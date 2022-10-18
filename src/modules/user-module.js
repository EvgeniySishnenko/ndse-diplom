const User = require("../models/user");
const bcrypt = require("bcryptjs");

class UserModule {
  async findByEmail({ email }) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      return;
    }
  }
  async create({ name, email, password, phone }) {
    try {
      const candidate = await User.findOne({ email });
      if (candidate) {
        return {
          error: "email занят",
        };
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ name, email, passwordHash, contactPhone: phone });
      await user.save();
      return user;
    } catch (error) {
      return {
        error,
      };
    }
  }
}
module.exports = new UserModule();
