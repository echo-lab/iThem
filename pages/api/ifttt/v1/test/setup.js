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
              "ya29.A0AVA9y1sJ1gRkyPBTD25Vl4qQqcIrs-0AmikeJDUxaezTlAy9XK_Vm4maHVg9Tw0w6nDdZ9dcOtMkT06hKH-aIngqKUAolWxu8ieIaZ0vPPlvqv1ifCyn5CV136PwmPT6kx8hbI0vypnxGd2wCAMB7F5_PZWfaCgYKATASATASFQE65dr8fcedj3WXXkSzLQLp4-XGNw0163",
            samples: {
              triggers: {
                outlet_handler: {
                  name: "outlet6",
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
