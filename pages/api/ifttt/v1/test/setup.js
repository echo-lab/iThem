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
              "ya29.A0ARrdaM9GL3HVp22gKKaiJ3T66EKKzdmaagtlPpVS2YEklE1OdWf1wJ4xk_njQCO1k0-1rgLe8ouiy6MbsnrjNfk6B4ZGwX1OUInudmUfGGFHsnoIB0AAEiXr1osgGwky5aO0Y3yu4w50dvJvVc1jjwrEQKSWYS8qrCi7Yg",
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
