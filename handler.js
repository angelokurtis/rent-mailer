'use strict';

const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const auth = require('./middlewares/auth');

async function login({body}, context) {
    try {
        const {clientId, clientSecret} = JSON.parse(body);
        const {redirectUris} = await auth.getCredentials();
        console.log(JSON.stringify({clientId, clientSecret, redirectUris}));
        const oauth2Client = new OAuth2(clientId, clientSecret, redirectUris[0]);
        const scope = ['https://mail.google.com/'];
        const url = oauth2Client.generateAuthUrl({access_type: 'offline', scope});
        console.log(JSON.stringify({url}));
        await auth.updateSecret(clientSecret);
        return {
            statusCode: 200,
            body: JSON.stringify({url})
        }
    } catch (e) {
        console.log(e.message);
        throw e;
    }
}

async function tokens(event, context) {
    try {
        const code = event['queryStringParameters'] ? event['queryStringParameters']['code'] : null;
        console.log(JSON.stringify({code}));
        if (code) {
            const credentials = await auth.getCredentials();
            const {clientId, clientSecret, redirectUris} = credentials;
            console.log(JSON.stringify({clientId, clientSecret, redirectUris}));
            const oauth2Client = new OAuth2(clientId, clientSecret, redirectUris[0]);
            const {tokens} = await oauth2Client.getToken(code);
            console.log(JSON.stringify(tokens));
            await auth.updateTokens(tokens);
            oauth2Client.setCredentials(tokens);
            return {
                statusCode: 200,
                body: JSON.stringify(tokens)
            };
        } else {
            return {statusCode: 400};
        }
    } catch (e) {
        console.log(e.message);
        throw e;
    }
}

module.exports = {login, tokens};