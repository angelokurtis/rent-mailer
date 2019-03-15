'use strict';

const AWS = require('aws-sdk');

const credentials = new AWS.SharedIniFileCredentials({profile: 'serverless-admin'});
AWS.config.credentials = credentials;
AWS.config.region = 'us-east-1';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function find(clientId) {
    if (!clientId) throw new Error('client id should not be null');

    const params = {
        TableName: 'GmailApiTokens',
        Key: {ClientId: clientId}
    };
    const {Item} = await dynamoDb.get(params).promise();
    if (!Item) return null;
    const {
        ProjectId: projectId,
        AuthUri: authUri,
        TokenUri: tokenUri,
        AuthProviderX509CertUrl: authProviderX509CertUrl,
        ClientSecret: clientSecret,
        RedirectUris: redirectUris,
        Tokens: tokens,
        UpdatedAt: updatedAt
    } = Item;
    return {
        clientId, projectId, authUri, tokenUri,
        authProviderX509CertUrl, clientSecret,
        redirectUris, tokens, updatedAt
    };
}

async function save(token) {
    if (!token) throw new Error('token should not be null');

    const {
        clientId, projectId, authUri, tokenUri,
        authProviderX509CertUrl, clientSecret, redirectUris, tokens
    } = token;
    let params = {
        TableName: 'GmailApiTokens',
        Item: {
            ClientId: clientId,
            ProjectId: projectId,
            AuthUri: authUri,
            TokenUri: tokenUri,
            AuthProviderX509CertUrl: authProviderX509CertUrl,
            ClientSecret: clientSecret,
            RedirectUris: redirectUris,
            Tokens: tokens,
            UpdatedAt: Date.now()
        }
    };
    await dynamoDb.put(params).promise();
}

module.exports = {find, save};