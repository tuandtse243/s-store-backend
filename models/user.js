import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "Please enter your name!"],
  },
  username:{
    type: String,
    required: [true, "Please enter your username!"],
  },
  password:{
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  phone:{
    type: String,
    required: [true, "Please enter your phone"],
  },
  email:{
    type: String,
    required: [true, "Please enter your email"],
  },
  addresses:[
    {
      province: {
        type: String,
      },
      district:{
        type: String,
      },
      town:{
        type: String,
      },
      street:{
        type: String,
      },
      houseNumber:{
        type: String,
      },
      addressType:{
        type: String,
      },
    }
  ],
  role:{
    type: String,
    default: "user",
  },
  avatar:{
    type: String,
 },
 createdAt:{
  type: Date,
  default: Date.now(),
 },
 resetPasswordToken: String,
 resetPasswordTime: Date,
});


//  Hash password
userSchema.pre("save", async function (next) {
  if(!this.isModified("password")){
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id}, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);