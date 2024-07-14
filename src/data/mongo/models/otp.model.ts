import mongoose, { Schema } from "mongoose"

const otpSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  otp: {
    type: String,
    default: undefined
  },
  otpExpiration: {
    type: Date,
    default: undefined,
  },
})

otpSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id
  }
})

export const OtpModel = mongoose.model('Otp', otpSchema)
