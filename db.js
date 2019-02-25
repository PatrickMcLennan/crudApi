"use strict";
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
var dbName = 'crud_mongodb';
var url = 'mongodb://localhost:27017';
var mongoOptions = { useNewUrlParser: true };
var state = {
    db: null
};
var connect = function (cb) {
    if (state.db) {
        cb();
    }
    else {
        MongoClient.connect(url, mongoOptions, function (err, client) {
            if (err) {
                cb(err);
            }
            else {
                state.db = client.db(dbName);
                cb();
            }
        });
    }
};
var getPrimaryKey = function (_id) { return ObjectId(_id); };
var getDb = function () { return state.db; };
module.exports = { getDb: getDb, connect: connect, getPrimaryKey: getPrimaryKey };
