// const { connectToDatabase } = require("../../../lib/mongodb");
// const ObjectId = require("mongodb").ObjectId;
export default async function handler(req, res) {
  // switch the methods
//   const { db } = await connectToDatabase();
  switch (req.method) {
    //   http://localhost:3000/api/inlets/update?name=new name&id=61e983a630328ac2f0cca0a4
    case "POST": {
      try {
        //   console.log(req.data)
        // let inlets = await db.collection("inlets").insertOne({
        //   label:req.query.name,
        //   email: req.query.email,
        //   name: req.query.name,
        //   value: req.query.name,
        //   description: req.query.description,
        //   createdAt: new Date(),
        // });
        return res.status(200).json({

        //   message: JSON.parse(JSON.stringify(inlets)),
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
