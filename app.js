require('dotenv').config()
require('./models/connection');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/users');
const activitiesRouter = require('./routes/activities')
const sportsRouter = require('./routes/sports')
const conversationRouter = require('./routes/conversations')

var app = express();

const cors = require('cors');
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/sports', sportsRouter);
app.use('/activities', activitiesRouter)
app.use('/conversation', conversationRouter)
module.exports = app;
