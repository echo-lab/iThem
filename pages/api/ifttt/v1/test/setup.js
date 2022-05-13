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
              "ya29.A0ARrdaM_s-3SwK2vTPza1pD1erMHrqWiZSPzCvngTyScaR3jdMLVnYvK2MKE0B7X48Pzs-bfrtHlaVA1r6wwIxe_oLF7L0XTpPlm2n-V1POCHKsDGi3O4VAYQ0zWTCvcIJqqDm27xUJS-9PCeFMVcRPcprvcf",
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
