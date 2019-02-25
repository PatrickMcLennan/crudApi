interface Mongo {
  useNewUrlParser: boolean;
}

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const dbName: string = 'crud_mongodb';
const url: string = 'mongodb://localhost:27017';
const mongoOptions: Mongo = { useNewUrlParser: true };

const state: State = {
  db: null
};

const connect = cb => {
  if (state.db) {
    cb();
  } else {
    MongoClient.connect(url, mongoOptions, (err: Error, client) => {
      if (err) {
        cb(err);
      } else {
        state.db = client.db(dbName);
        cb();
      }
    });
  }
};

const getPrimaryKey = _id => ObjectId(_id);

const getDb = () => state.db;

module.exports = { getDb, connect, getPrimaryKey };
