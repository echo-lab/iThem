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
              "ya29.A0AVA9y1vygdlQqMb3mzPy6_htl7fBjfl6xuTHn04zMBpmZZMCxyFMcM-dfjrI1r_5fuZAbXTGqDJVi9PUdWXDusyQpbFvQowEVw2BDQiVR9Fa8tbTWnMGTRJo8ZXUvvUEsJPGIeT4qSv073AD63gyv4uoWTQwaCgYKATASATASFQE65dr8DbuTBLs6_so8w_5WbaCVzA0163",
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
