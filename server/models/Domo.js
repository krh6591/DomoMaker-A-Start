const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  // Only need 2 teams, so bool; false = blue | true = red; optional - defaults to blue
  team: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  team: doc.team,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select('name age team').lean().exec(callback);
};

// Find all domos
DomoSchema.statics.findByTeam = (team, callback) => {
  const search = {
    team,
  };

  return DomoModel.find(search).select('name age team').lean().exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports = {
  DomoModel,
  DomoSchema,
};
