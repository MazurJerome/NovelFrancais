const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  readChapters: [
    {
      novelId: mongoose.Schema.Types.ObjectId,
      chapterId: mongoose.Schema.Types.ObjectId,
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
