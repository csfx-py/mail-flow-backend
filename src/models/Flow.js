const mongoose = require("mongoose");

const flowSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  flowName: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  nodes: {
    type: Array,
    required: true,
  },
  edges: {
    type: Array,
    required: true,
  },
});

flowSchema.pre("save", async function (next) {
  const flow = await this.model("Flow").findOne({ flowName: this.flowName });
  if (flow) {
    throw new Error("Flow already exists");
  }
  next();
});

module.exports = mongoose.model("Flow", flowSchema);
