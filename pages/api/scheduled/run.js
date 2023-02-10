const { connectToDatabase } = require("../../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.json({success: false});

  try {
    let { db } = await connectToDatabase();
    let { email, outletName, outletArg } = await db.collection("sched").findOne({_id: new ObjectId(req.query.id)});
    let outlet = await db.collection("outlets").findOne({
        $and: [{email, name: outletName}],
    });

    if (!outlet) {
      throw `ithemCall() error: outlet "${outletName}" does not exist`;
    }

    const msg =
      outlet.status === "true"
        ? "Outlet Ran via scheduled call [Passing on to IFTTT]"
        : "Disabled Outlet Ran via scheduled call";

    await fetch(
        `https://ithem.cs.vt.edu/api/events/create?email=${email}&name=${outletName}&note=${msg}&type=outlet&data=${outletArg}&status=${outlet.status}`,
        { method: "POST" }
    );

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
