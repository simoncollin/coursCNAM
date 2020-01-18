// Remember to start Mongo
// "C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe" --dbpath="c:\data\db"

// NB CLI Mongo : "C:\Program Files\MongoDB\Server\4.2\bin\mongo.exe"
const MongoClient = require("mongodb").MongoClient;
const mongo = require("mongodb");
const assert = require("assert");

function getArrayOfAllUsers(callback) {
    MongoClient.connect("mongodb://localhost:27017", function(err, client) {
        if (err) throw err;
        var db = client.db("CNAM");
        db.collection("user")
            .find()
            .toArray(function(err, result) {
                if (err) throw err;
                result.forEach(user => {
                    user._id = user._id.toHexString();
                });
                callback(result);
            });
    });
}

function addUser(user) {
    MongoClient.connect("mongodb://localhost:27017", function(err, client) {
        if (err) throw err;

        var db = client.db("CNAM");

        db.collection("user").insertOne(
            {
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age
            },
            function(err, r) {
                assert.equal(null, err);
                assert.equal(1, r.insertedCount);
            }
        );
        client.close();
    });
}

function deleteUserWithId(id, callback) {
    MongoClient.connect("mongodb://localhost:27017", function(err, client) {
        if (err) throw err;
        var db = client.db("CNAM");
        db.collection("user").deleteOne({ _id: new mongo.ObjectId(id) }, function(
            err,
            r
        ) {
            if (assert.equal(1, r.deletedCount)) {
                callback(true);
            } else {
                callback(false);
            }
        });
    });
}

function editUser(id, firstName, lastName, age) {
    MongoClient.connect("mongodb://localhost:27017", function(err, client) {
        if (err) throw err;
        var db = client.db("CNAM");
        db.collection("user").update(
            { _id: new mongo.ObjectId(id) },
            { firstName: firstName, lastName: lastName, age: age },
            function(err, r) {
                assert.equal(null, err);
            }
        );
        client.close();
    });
}

function getUserWithId(id, callback) {
    MongoClient.connect("mongodb://localhost:27017", function(err, client) {
        if (err) throw err;
        var db = client.db("CNAM");
        db.collection("user").findOne({ _id: new mongo.ObjectId(id) }, function(
            err,
            result
        ) {
            if (err) throw err;
            callback(result);
        });
    });
}

exports.getArrayOfAllUsers = getArrayOfAllUsers;
exports.addUser = addUser;
exports.deleteUserWithId = deleteUserWithId;
exports.editUser = editUser;
exports.getUserWithId = getUserWithId;
