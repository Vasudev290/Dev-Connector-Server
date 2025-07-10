const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["interested", "ignored", "accepeted", "rejected"],
    required: true,
  },
}, { timestamps: true });

// 🛠 Pre-save validation
ConnectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    return next(new Error("Cannot send connection request to yourself!"));
  }

  next();
});

module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);
