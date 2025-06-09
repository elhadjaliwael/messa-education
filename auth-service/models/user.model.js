import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  avatar :{
    type: String,
    default: "https://github.com/shadcn.png"
  },
  level: {
    type: String,
    trim: true,
    minlength: 3
  },
  emailNofification: {
    type: Boolean,
    default: true 
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin','parent'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  phoneNumber : {
    type: String,
    trim: true,
    minlength: 8
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subject : {
    type: String,
    trim: true,
    minlength: 3
  },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Inactive'],
    default: 'Active'
  },
  classes: [{
    type: String,
    trim: true
  }],
  cin : {
    type: String,
    trim: true,
    minlength: 8
  },
  etablissement : {
    type: String,
    trim: true,
    minlength: 3
  },
  address : {
    type: String,
    trim: true,
    minlength: 3
  },
  // Add this field to your schema
  tempPassword: {
    type: String,
    select: false // This ensures it's not returned in normal queries
  },
  // Add OTP verification fields
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationOTP: {
    type: String,
    select: false // Don't return in normal queries
  },
  otpExpiresAt: {
    type: Date,
    select: false
  },
  isGoogleUser: {
    type: Boolean,
    select: false
  }
});

const User = mongoose.model('User', userSchema);

export default User;