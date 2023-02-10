const { connectToDatabase } = require("../../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;

export default async function handler(req, res) {
  if (req.method !== "DELETE") return;

  try {
    let { db } = await connectToDatabase();
    await db.collection("sched").deleteOne({
      _id: new ObjectId(req.query.id),
    });
    return res.json({ success: true });
  } catch (error) {
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}
