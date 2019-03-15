'use strict';

const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;

function getCredentials() {
    const {clientId} = require('./credentials');
    const {find} = require('./auth-repository');
    return find(clientId);
}

async function updateTokens(tokens) {
    const credentials = await getCredentials();
    credentials.tokens = tokens;
    const {save} = require('./auth-repository');
    await save(credentials)
}

async function updateSecret(clientSecret) {
    const credentials = await getCredentials();
    credentials.clientSecret = clientSecret;
    const {save} = require('./auth-repository');
    await save(credentials)
}

async function getOAuth2Client() {
    const {clientId, clientSecret, redirectUris, tokens} = await getCredentials();
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUris[0]);
    oauth2Client.setCredentials(tokens);
    return oauth2Client;
}


module.exports = {getCredentials, updateTokens, updateSecret, getOAuth2Client};
