const { connect, get } = require("mongoose");
const { cms } = require("../model/Model");
const { search } = require("../routes/webRoutes");

const cmsModel = cms;

const addcontact = async (req, res) => {
  const authData = req.data;

  if (!authData) return res.status(404);

  const authorId = authData.data.id;

  const { name, note, address, phone_number, email } = req.body;

  if (!name) {
    return res.status(402).json({ msg: "Name is required" });
  } else if (!phone_number) {
    return res.status(402).json({ msg: "Phone number is required" });
  } else if (!email) {
    return res.status(402).json({ msg: "Email is required" });
  }

  try {
    await cmsModel.create({
      authorid: authorId,
      name_contact: name,
      note_contact: note,
      address_contact: address,
      phone_number_contact: phone_number,
      email_contact: email,
    });

    return res.status(200).json({
      contact_data: {
        authorid: authorId,
        name: name,
        note: note,
        address: address,
        number: phone_number,
        email: email,
      },
      authData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const showContact = async (req, res) => {
  try {
    const authData = req.data;

    if (!authData) return res.status(404);

    const authorId = authData.data.id;

    const contact = await cmsModel.find({ authorid: authorId });

    if (!contact) return res.status(401).json({ msg: "Cannot find contact" });

    const data = [];
    const length = contact.length + 1;

    for (let i = 0; i < contact.length; i++) {
      data.push({
        id: contact[i]._id,
        autohor: contact[i].authorid,
        name: contact[i].name_contact,
        note: contact[i].note_contact,
        address: contact[i].address_contact,
        phone: contact[i].phone_number_contact,
        email: contact[i].email_contact,
      });
    }

    return res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(404);
  }
};

const getContact = async (req, res) => {
  try {
    const authData = req.data.data.id;
    const get = await cmsModel.find({ authorid: authData , $or : [
      {name_contact : {$regex : req.params.key}}
    ]});
    if (!get) return res.status(401).json({ msg: "No data" });

    console.log(get);
    return res.status(200).json({
      data: get
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json("Internal Server Error");
  }
};

module.exports = {
  addcontact,
  showContact,
  getContact,
};
