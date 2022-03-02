import { MongoClient } from "mongodb";
const MONGODB_URI = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.1.9";
const MONGODB_DB = "ithem";
const fs = require("fs");
const path = require("path");

// check the MongoDB URI
if (!MONGODB_URI) {
  throw new Error("Define the MONGODB_URI environmental variable");
}

// check the MongoDB DB
if (!MONGODB_DB) {
  throw new Error("Define the MONGODB_DB environmental variable");
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // check the cached.
  if (cachedClient && cachedDb) {
    // load from cache
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // set the connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Connect to cluster
  let client = new MongoClient(MONGODB_URI, opts);
  await client.connect();
  let db = client.db(MONGODB_DB);

  // set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}

//db.events.find()

// db.events.insertOne({
//   "name":"outlet4",
//   "email":"boyuan@vt.edu",
//   "note":"test ifttt 1 event",
//   "created_at": new Date(),
// "meta":{
//   id: new ObjectId(),
//   "timestamp":Math.round((new Date()).getTime() / 1000),
// }
// })