const { google } = require('googleapis');
const User = require('./models/user.model')
const Response = require('./response')
const environmentSettings=require('dotenv')
// Settings to access the environment variables
environmentSettings.config()

const clientID = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const redirectURI = process.env.REDIRECT_URL

//Creating an oAuth2Client for further authentication
const oAuth2Client = new google.auth.OAuth2(clientID, clientSecret, redirectURI)

//Flag to check whether the authentication has completed
var isAuthenticated = false;
//Authentication module
module.exports.authenticate = async (req, res, next) => {
    if (!isAuthenticated) {
//Generating URL to the google sign in page 
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            //scopes are the permissions to be requested from the user
            scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
            client_id: process.env.CLIENT_ID,// Generated as a new project using the mail id (a for test only email:juego1544@gmail.com) whose password is mentioned in .env the module
            redirect_uri: process.env.REDIRECT_URL// the redirect_uri is the url tpo which the site is redirected after the user grants permission
        });
        res.redirect(url); // redirects the page to the generated url
    } else {
        var oauth2 = google.oauth2({
            auth: oAuth2Client,
            version: 'v2'
        });
//Getting the user details
        oauth2.userinfo.v2.me.get(
            async function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    //Accessing the user token
                    const userToken = await oAuth2Client.getAccessToken();
                    //Checking if the user is already existing
                    const existingUser = await User.findOne({ email: result.data.email })
                    if (existingUser) {
                    //If the user is existing ,the token is returned
                        new Response(200).setData(existingUser).send(res)
                    } else {
                    //else we create the user and store it in the database
                        const user = new User();
                        //The fields currently accessible are the username,email and token hence other fields are temporarily filled with default messages
                        Object.assign(user, { email: result.data.email, fullName: result.data.name, token: userToken.token, city: "not accessible", password: 'not needed', phone: 'not accessible', gender: 'not accessible' });
                        user.save().then(result2 => {
                           // Once the user is saved ,the token is returned
                            new Response(200).setData(result2.token).send(res)
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                }
            });
    }
}

//A callback method to which the user is redirected once the users signs in for authetication
module.exports.callback = async (req, res, next) => {
    const code = req.query.code
    if (code) {
        // Retrieving the access token once the user is authenticated
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log(err);
            } else {
            //if the token is validated the user is redirected to the starting page
                console.log('Successfully authenticated');
                oAuth2Client.setCredentials(tokens);
                isAuthenticated = true;
                res.redirect('/user')
            }
        });
    }
}
