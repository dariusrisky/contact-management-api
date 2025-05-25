const mongoose = require("mongoose");
const crypto = require("crypto");
const { ref } = require("process");
const { types } = require("util");
const { type } = require("os");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: () => crypto.randomUUID(),
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
    phone_number: {
      type: String,
    },
    SESION_TOKEN: {
      type: String,
      default: null,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updateAt" } }
);

const user = mongoose.model("user", userSchema);

const cmsSchema = new mongoose.Schema(
  {
    authorid: {
      type: mongoose.Schema.Types.UUID,
      ref: "user",
    },
    name_contact: {
      type: String,
      required: [true, "Name is required"],
    },
    note_contact: {
      type: String,
    },
    address_contact: {
      type: String,
    },
    phone_number_contact: {
      type: Number,
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
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updateAt" } }
);

const cms = mongoose.model("cms", cmsSchema);

module.exports = {
  user,
  cms,
};
