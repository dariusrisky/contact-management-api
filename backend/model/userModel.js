const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id : false
  },
  {
    id: {
      type: mongoose.Schema.Types.UUID,
      auto: true,
    },
    Username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    Email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} i s not a valid email!`,
      },
    },
    Password: {
      required: [true, "Username is required"],
      type: String,
      required: [true, "Password is required"],
    },
    Usertype: {
      type: String,
      enum: ["admin-inventory", "user"],
      default: "user",
    },
    SESION_TOKEN:  {
      type: String,
      default: null,
    },
  },
  { timestamps: { createdAt : "createdAt", updatedAt : "updateAt"} }

);

const cmsSchema = new mongoose.Schema(
  {
    id : userSchema.id,
    name_contact: {
      type: String,
      required: [true, "Name is required"],
    },
    note_contact: {
      type: String,
    },
    phone_number_contact : {
      type : Number,
      required: [true, "Phone number is required"],
    },
    email_contact: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} i s not a valid email!`,
      },
    },

  }
)



module.exports = mongoose.model("userAdmin", userSchema,);
