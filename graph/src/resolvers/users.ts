import {CommentType, NewUser} from "../types/types";

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const { UserInputError } = require('apollo-server-express');

const {validateMail} = require('../util/validateMail')
const {generateToken} = require('../util/generateToken')

/*const {
    validateRegisterInput,
    validateLoginInput
} = require('../util/validators');*/

const User = require('../models/User');

module.exports = {
    Mutation: {
        login: async (_: any, {username, password}: { username: string, password: string }) => {

            const {errors, valid} = validateMail(username, password);
            const user = await User.findOne({username: username})

            if (!user) {
                errors.general = 'User not found'
                throw new UserInputError('Wrong credentials', {errors});
            }

            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                errors.general = 'User not found'
                throw new UserInputError('Wrong credentials', {errors});
            }

            const token = generateToken(user)

            return {
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
                id: user._id,
                token
            }
        },
        // registration resolve
        registerNewUser: async (_: any, {input}: { input: NewUser }) => {

            const {valid, errors} = validateMail(input.email);
            if (!valid) {
                throw new UserInputError('Email is not valid!', {errors})
            }

            const user = await User.findOne({username: input.username})

            if (!user) {
                input.password = await bcrypt.hash(input.password, 12)

                const newUser = new User({
                    email: input.email,
                    username: input.username,
                    password: input.password,
                    createdAt: new Date().toISOString()
                })

                const res = await newUser.save();

                const token = generateToken(res)

                return {
                    email: res.email,
                    username: res.username,
                    createdAt: res.createdAt,
                    id: res._id,
                    token
                }
            } else {
                throw new UserInputError('This user already exist!')
            }
        }
    }
};