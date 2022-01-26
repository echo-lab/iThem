
export default async function handler(req, res) {
    // switch the methods    
    switch (req.method) {
      case "GET": {

        const response = await fetch(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${req.headers['authorization'].substring(7)}`,
          )
        const responseJson = await response.json();
        console.log(responseJson)
        res.status(200).json({data: {...responseJson, name:"Empty"}})
  
      }
    }
  }