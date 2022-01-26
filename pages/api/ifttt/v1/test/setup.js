
export default async function handler(req, res) {
    // switch the methods    
    switch (req.method) {
      case "POST": {
          if(req.headers['ifttt-service-key']=="iuLesxDNlW33TMnaeS3BWg3ipN2suKMSEj5bhTkl1n3ZdcfuDx3eHdQsG4JPBspb")
          res.status(200).json({
            "data": {
              "accessToken": "ya29.A0ARrdaM9-p4u8uvjuhro3AC7bbHPyDfuFkBtNeQtdJpSgN2jv0JV0WUMyAYUYyZQP2EUKAvyPdM7iCz3FEVBzoLKjPihukefutnti1y4QFt2gtWpSvxU_z5WfCSy-jS2Siytk9yZks7p_jByTdFStu-q752oZCvoSQb1r",
              "samples": {
                "triggers": {
                  "any_new_photo_in_category": {
                    "category": "Nature"
                  },
                  "any_new_photo_in_album": {
                    "album": "Italy"
                  }
                },
                "triggerFieldValidations": {
                  "any_new_photo_in_album": {
                    "album": {
                      "valid": "Italy",
                      "invalid": "AlbumDoesNotExist"
                    }
                  }
                },
                "actions": {
                  "post_a_photo": {
                    "album": "Sports",
                    "url": "http://example.com/foo/jpg",
                    "description": "AT&T Park"
                  },
                  "trigger_a_inlet":{
                    "inlet":"1"
                  }
                },
                "actionRecordSkipping": {
                  "post_a_photo": {
                    "album": "Sports",
                    "url": "http://example.com/foo/jpg",
                    "description": ""
                  }
                }
              }
            }
          })
          else 
          res.status(401).json({})
  
      }
    }
  }