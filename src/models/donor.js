const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donorSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  bloodType: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  }
});

const Donor = mongoose.model("Donor", donorSchema);

module.exports = Donor;