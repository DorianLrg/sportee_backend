var express = require('express')
var router = express.Router()

const Activity = require('../models/Activities');
const User = require('../models/users')
const Pusher = require("pusher");


const pusher = new Pusher({
    appId: "1605724",
    key: "11d41dded094302fda2e",
    secret: "81666e768eb7907f1a19",
    cluster: "eu",
    useTLS: true
})

//RETRIEVE USER ID USING THEIR AUTHENTICATION TOKEN
router.get('/userId/:userToken', async (req, res) => {
    const user = await User.findOne({ token: req.params.userToken })
    res.json({ userId: user._id })
})

//ADD NEW MSG IN CONVERSATION
router.put("/:activityId", (req, res) => {

    const { message, user, timestamp } = req.body
    pusher.trigger('sportee_channel', 'new-message', { status: 'new message' })
    Activity.findOneAndUpdate(
        { "_id": req.params.activityId },
        { $push: { "conversation.messages": { message, user, timestamp } } }
    )
        .then((data) => {
            res.json({ result: true })
        })
        .catch((error) => {
            res.json({ result: false, error: error.message })
        })
})

//GET THE CONVERSATION
router.get('/getConversation/:id', (req, res) => {
    Activity.findById(req.params.id)
        .populate('conversation.messages')
        .then(data => {
            if (data) {
                res.json({ result: true, messages: data.conversation.messages, name: data.name })
            } else {
                res.json({ result: false })
            }
        })
})

//GET THE LAST MSG
router.get('/getLastMessage/:id', (req, res) => {
    Activity.findById(req.params.id)
        .populate({
            path: 'conversation.messages',
            options: {
                sort: {
                    createdAt: -1
                },
                limit: 1
            }
        })
        .then(data => {
            if (data) {
                res.json({ result: true, message: data.conversation.messages[data.conversation.messages.length - 1] })
            } else {
                res.json({ result: false })
            }
        })
})

module.exports = router
