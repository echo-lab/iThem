const { connectToDatabase } = require("../../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;
// const db = require('../../../lib/mongodb');
export default async function handler(req, res) {
  // switch the methods
  const { db } = await connectToDatabase();
  switch (req.method) {
    //   http://localhost:3000/api/inlets/update?name=new name&id=61e983a630328ac2f0cca0a4
    case "POST": {
      try {
        let events = await db.collection("events").insertOne({
          email: req.query.email,
          name: req.query.name,
          note: req.query.name,
          created_at: new Date(),
          meta: {
            id: new ObjectId(),
            timestamp: Math.round(new Date().getTime() / 1000),
          },
        });

        return res.json({
          message: JSON.parse(JSON.stringify(events)),
          success: true,
        });
      } catch (error) {
        return res.json({
          message: new Error(error).message,
          success: false,
        });
      }
    }
  }
}
