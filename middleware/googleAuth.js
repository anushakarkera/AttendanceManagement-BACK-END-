const { google } = require('googleapis');
const express = require('express')
const OAuth2Data = require('./google_key.json')

const CLIENT_ID = OAuth2Data.web.client.id;
const CLIENT_SECRET = OAuth2Data.web.client.secret;
const REDIRECT_URL = OAuth2Data.web.client.redirect

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;


