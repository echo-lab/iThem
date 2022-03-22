export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case "POST": {
      if (
        req.headers["ifttt-service-key"] ==
        "iuLesxDNlW33TMnaeS3BWg3ipN2suKMSEj5bhTkl1n3ZdcfuDx3eHdQsG4JPBspb"
      )
        res.status(200).json({
          data: {
            accessToken:
              "ya29.A0ARrdaM_Q21GMXJPlGceh8tnIGno4EF0aNbYnSwyqBYQN_P42-ctxGsftsk0WONYZ8Fm4QBcJVE7cCk8LFhhrGCo5AmHOYsRi7OTYNQkNpw-3E4_ykruWBhPGty2_L-bnulIgf-_kwRE4ZjRmpiJaLZEjrzODVLIg7ZiiWw",
            samples: {
              triggers: {
                outlet_handler: {
                  name: "outlet4",
                },
              },
              actions: {
                trigger_a_inlet: {
                  inlet: "testOutlet",
                  data: {
                    name: "testOutlet",
                    email: "boyuan@vt.edu",
                  },
                },
              },
            },
          },
        });
      else res.status(401).json({});
    }
  }
}
