const  { Schema, model }=require("mongoose") ;
const mongoose=require("mongoose");
const { hash }=require("bcrypt") ;

const schema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    forgotpasswordlink:{
      type:String,
    },
    forgotpasswordlinkexpires:{
        type:Date,
    },
    avatar: {
      public_id: {
        type: String,
        
      },
      url: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// schema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await hash(this.password, 10);
// });

module.exports= User = mongoose.models.User || model("User", schema);
