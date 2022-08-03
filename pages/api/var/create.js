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
        let variables = await db.collection("variables").insertOne({
          email: req.query.email,
          name: req.query.name,
          type: req.query.type,
          value:req.query.value,
          createdAt: new Date(),
        });
        return res.json({
          message: JSON.parse(JSON.stringify(variables)),
          success: true,
        });
      } catch (error) {
        return res.status(400).json({
          message: new Error(error).message,
          success: false,
        });
      }
    }
  }
}
