"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
var path = require('path');
var PORT = 3000;
var db = require('./db');
var collection = 'todo';
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/getTodos', function (req, res) {
    db.getDb()
        .collection(collection)
        .find({})
        .toArray(function (err, documents) {
        if (err) {
            console.error(err);
            return err;
        }
        else {
            res.json(documents);
        }
    });
});
app.put('/:id', function (req, res) {
    var todoID = req.params.id;
    var userInput = req.body;
    db.getDb()
        .collection(collection)
        .findOneAndUpdate({ _id: db.getPrimaryKey(todoID) }, { $set: { todo: userInput } }, { returnOriginal: false }, function (err, result) {
        if (err) {
            console.error(err);
        }
        else {
            res.json(result);
            return result;
        }
    });
});
app.post('/', function (req, res) {
    var userInput = req.body;
    db.getDb()
        .collection(collection)
        .insertOne(userInput, function (err, result) {
        if (err) {
            console.error(err);
        }
        else {
            res.json({ result: result, document: result.ops[0] });
        }
    });
});
app.delete('/:id', function (req, res) {
    var toDoID = req.params.id;
    db.getDb()
        .collection(collection)
        .findOneAndDelete({ _id: db.getPrimaryKey(toDoID) }, function (err, result) {
        if (err) {
            console.error(err);
        }
        else {
            res.json(result);
        }
    });
});
db.connect(function (err) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    else {
        app.listen(PORT, function () {
            console.log("connected to the database on Port " + PORT);
        });
    }
});
