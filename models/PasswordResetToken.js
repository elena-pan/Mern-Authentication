const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordResetTokenSchema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 3600 } // 1 hour
});

const PasswordResetToken = mongoose.model("PasswordResetToken", passwordResetTokenSchema);

module.exports = PasswordResetToken;