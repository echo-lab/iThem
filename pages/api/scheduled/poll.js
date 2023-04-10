const { connectToDatabase } = require("../../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;

export default async function handler(req, res) {
  if (req.method !== "GET") return res.json({success: false});

  try {
    let { db } = await connectToDatabase();
    let now = new Date().getTime();
    let toRun = await db.collection("sched").find({schedTime: {$lt: now}}).toArray();

    toRun.forEach(async (item) => {

    // toRun.forEach(async ({_id, email, outletName, outletArg}) => {
        // Delete the thing. In theory we should wait in case something goes wrong :)
        await db.collection("sched").deleteOne({_id: item._id});

        if (item.outletName) {
          let {email, outletName, outletArg} = item;
          let outlet = await db.collection("outlets").findOne({
              $and: [{email, name: outletName}],
          });
          // TODO: Should log some type of message if the outlet is missing (to the user-visible logs).
          if (!outlet) return;

          const msg = outlet.status === "true"
              ? "Outlet Ran via scheduled call [Passing on to IFTTT]"
              : "Disabled Outlet Ran via scheduled call";

          await fetch(
              `https://ithem.cs.vt.edu/api/events/create?email=${email}&name=${outletName}&note=${msg}&type=outlet&data=${outletArg}&status=${outlet.status}`,
              { method: "POST" }
          );
        } else if (item.inletName) {
          let {email, inletName, inletArg} = item;
          let inlet = await db.collection("inlets").findOne({
            $and: [{email, name: inletName}],
          });
          if (!inlet) return;

          const msg = "Inlet Ran via scheduled call";
          await fetch(
              `https://ithem.cs.vt.edu/api/events/create?email=${email}&name=${inletName}&note=${msg}&type=inlet`,
              { method: "POST" }
          );
        }
    });
    return res.json({ success: true });
  } catch (error) {
    console.warning("Error polling scheduled events:", error);
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}
