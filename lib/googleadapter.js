export const fetchUser = async (req)=>{
    const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${req.headers['authorization'].substring(7)}`,
      )
    const responseJson = await response.json();
    console.log(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${req.headers['authorization'].substring(7)}`)
    // console.log('responseJson:')
    console.log(responseJson)

    return responseJson
}