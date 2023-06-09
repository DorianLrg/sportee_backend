var express = require('express');
var router = express.Router();
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const User = require('../models/users');

//Verify if username is already present in DB
router.get('/checkUsername/:username', (req, res) => {
  User.findOne({ username: req.params.username })
    .then(data => {
      data === null ? res.json({ result: true }) : res.json({ result: false })
    })
});

// Verify if email is already present in DB
router.get('/checkEmail/:email', (req, res) => {
  User.findOne({ email: req.params.email })
    .then(data => {
      data === null ? res.json({ result: true }) : res.json({ result: false })
    })
});

//Signup - register new user in DB
router.post('/signup', (req, res) => {
  try {

    const { avatar, dateOfBirth, email, firstname, lastname, password, phone, preferences, username } = req.body
    const newUser = new User({
      lastname,
      firstname,
      email,
      password: bcrypt.hashSync(password, 10),
      phone,
      username,
      avatar,
      token: uid2(32),
      preferences,
      badges: []
    });

    newUser.save().then(data => {
        const { _id, lastname, firstname, email, phone, username, dateOfBirth, avatar, token, preferences } = data
        res.json({ result: true, user: {_id, lastname, firstname, email, phone, username, dateOfBirth, avatar, token, preferences } });
      });
    

  } catch(e) {
    res.json({result: false, error: e})
  }
});

//Sigin with mail
router.post('/signin', (req, res) => {

  User.findOne({ email: req.body.email })
  .populate('preferences.sports')
  .then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      const { _id, lastname, firstname, email, phone, username, dateOfBirth, avatar, token, preferences } = data
      res.json({ result: true, user: {_id, lastname, firstname, email, phone, username, dateOfBirth, avatar, token, preferences } });
    } else {
      res.json({ result: false});
    }
  });
});

//Sign in ou up with google/facebook 
router.post('/social', async (req, res) => {
  try {
    const { family_name, given_name, email } = req.body.userInfo

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.json({ message: 'L\'utilisateur existe déjà !' })
    }

    const user = new User({
      lastname: family_name,
      firstname: given_name,
      email: email,
      username: given_name
    })

    await user.save()

    res.json({ message: 'Les informations utilisateur ont été enregistrées avec succès !' })
  } catch (error) {
    res.json({ error: 'error' })
  }
})


module.exports = router;
