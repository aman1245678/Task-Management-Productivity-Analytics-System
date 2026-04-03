import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    description: {
      type: String,
      trim: true,
      default: ""
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      index: true
    },

    timeSpent: {
      type: Number,
      default: 0,
      min: 0 // minutes
    },

    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);


taskSchema.virtual("isCompleted").get(function () {
  return this.status === "completed";
});


taskSchema.index({ userId: 1, createdAt: -1 });


taskSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Task", taskSchema);