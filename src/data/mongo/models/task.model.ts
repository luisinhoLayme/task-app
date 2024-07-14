import mongoose, { Schema } from "mongoose";

const chieldSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  description: { type: String, required: [true, 'Description is required'] },
  completed: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } })

const taskSchema = new mongoose.Schema({
  tasks: {
    type: [ chieldSchema ],
    default: []
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

chieldSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id
  }
})

taskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id
  }
})

export const TaskModel = mongoose.model('Task', taskSchema)
