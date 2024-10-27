const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const model = require('../database/models');
const User = model.User;
require('dotenv').config()


function generateAuthToken(user) {
    return jwt.sign({id: user.id}, process.env.JWT_SECRET);
}

const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body;
    try {
        const user = await User.findOne({where: {email: email}});
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateAuthToken(user);
            return res.status(200).json({token});
        }
        return res.status(401).json({error: 'Invalid login credentials'});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }   
    const {email, password} = req.body;
    const user = await User.create({email, password: bcrypt.hashSync(password, 10)});
    return res.status(201).json({message: 'User created'});


}

module.exports = {
    loginUser,
    createUser
}