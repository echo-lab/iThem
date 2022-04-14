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
              "ya29.A0ARrdaM9fFNfh1U_emHb18zZHkiOgg4mJjKqYrTF5bqsEmpcHijll10K-9fK9kTn48GpSzxKhK9d6knIz8KkgbgPxvaBbsFWt0aSZx_0koepObCtVI7qpnPUGZ2vpwZOpec1T8k60EdBQpb-9rL2NmcfRyE6tmV75DDUd4g",
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
