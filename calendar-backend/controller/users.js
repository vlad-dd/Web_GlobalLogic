
const User = require('../models/User');
const JWT = require('jsonwebtoken');
const config = require('../config');
const secret_key = config.JWT_SECRET_KEY;

const register =  (req, res) => {
                    const newUser = new User({
                        email: req.body.email,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        password: req.body.password,
                    })

                    if(req.body && req.body.email && req.body.firstname && req.body.lastname && req.body.password) {
                        User.findOne({email: req.body.email})
                        .then(user => {
                            console.log(user + "this is the found user");
                            if(user){
                                res.status(403).json({message: "Email already registered"})
                            } else {
                                newUser.save()
                                .then(data => {
                                    res.json(data);
                                    // res.status(200).json({message: "New user saved"});
                                })
                                .catch(err => {
                                    console.log('Error at saving user');
                                    res.status(500).json({message: err});
                                })
                            }
                        })
                        .catch(err => {
                            res.status(500).json({message: err});
                        })
                    } else {
                        res.send({message: "Please fill in info"})
                    }  
                }

const login = (req, res) => {
    if(req.body && req.body.email && req.body.password) {
        console.log(secret_key, config.JWT_EXPIRE_TIME)
        User.findOne({email: req.body.email})
        .then(data => {
            if(data) {
                if(data.password === req.body.password) {
                    const TOKEN = JWT.sign({
                        email: req.body.email,
                        exp: Math.floor(Date.now() / 1000) + config.JWT_EXPIRE_TIME
                    }, secret_key)

                    res.status(200).json({message: 'Logged in', token: TOKEN})
                } else {
                    res.status(401).json({message: 'Incorrect password'})
                    // 401 unauthorised
                }
            } else {
                res.status(401).json({message: 'Data is null'})
            }
        })
        .catch(err => {
            res.status(500).json({message: err})
        })
    } else {
        res.send({message: "Please fill in info"})
    }
}

const login_with_token = (req, res) => {
    res.status(200).json(req.user)
}

const extractDataMiddleware = (req, res, next) => {
    if(req.token_payload.email) {
        User.findOne({email: req.token_payload.email})
        .exec((err, currentUser) => {
            if(err) {
                res.status(404).json({message: 'Error at retrieving user info'})
            } else if(currentUser === null) {
                res.status(404).json({message: 'Missing user. Bad token?'})
            } else {
                req.user = currentUser;
                next()
            }
        })
    } 
}

const authMiddleware = (req, res, next) => {
    if(req.headers['token']) {
        JWT.verify(req.headers['token'], secret_key, (err, payload) => {
            if(err) {
                res.status(403).json({message: 'Invalid token'})
            } else {
                req.token_payload = payload;
                next();
            }
        })
    } else {
        res.status(403).json({message: 'Missing login token'})
    }
}

module.exports = {
    register,
    login,
    authMiddleware,
    extractDataMiddleware,
    login_with_token
}