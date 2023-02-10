const { connectToDatabase } = require("../../../lib/mongodb");

export default async function handler(req, res) {
  if (req.method !== "GET") return;

  try {
    let { db } = await connectToDatabase();
    let scheduled = await db
        .collection("sched")
        .find({ email: req.query.email, executed: false })
        .sort({ schedTime: 1 })
        .toArray();
    // return the list of scheduled actions
    return res.json({
        message: JSON.parse(JSON.stringify(scheduled)),
        success: true,
    });
  } catch (error) {
    // return the error
    return res.json({
        message: new Error(error).message,
        success: false,
    });
  };
}
