const { connectToDatabase } = require("../../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case "GET": {
      try {
        // connect to the database
        let { db } = await connectToDatabase();
        // fetch the posts
        let inlets = await db
          .collection("inlets")
          .find({ useremail: req.user.email })
          .sort({ published: -1 })
          .toArray();
        // return the posts
        return res.json({
          message: JSON.parse(JSON.stringify(inlets)),
          success: true,
        });
      } catch (error) {
        // return the error
        return res.json({
          message: new Error(error).message,
          success: false,
        });
      }
    }
    case "POST": {
      try {
        let { db } = await connectToDatabase();
        let inlets = await db.collection("inlets").insertOne({
          email: req.query.email,
          name: req.query.name,
          description: req.query.description,
          createdAt: new Date(),
        });
        return res.json({
          message: JSON.parse(JSON.stringify(inlets)),
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
