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
        const _id = new ObjectId();
        let events = await db.collection("events").insertOne({
          _id: _id,
          email: req.query.email,
          name: req.query.name,
          note: req.query.note,
          type: req.query.type,
          status:req.query.status,
          created_at: new Date(),
          meta: {
            id: _id,
            timestamp: Math.round(new Date().getTime() / 1000),
          },
        });
        console.log(req.query.name);

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
