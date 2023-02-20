const routerUsers = require('express').Router()

const { User, Blog} = require('../models')
const {tokenExtractor} = require("../util/middleware");

routerUsers.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] }
        }
    })
    res.json(users)
})

routerUsers.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.json(user)
    } catch(error) {
        return res.status(400).json({ error })
    }
})

routerUsers.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id)
    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})

routerUsers.put('/:username', tokenExtractor, async (req, res) => {
        const user = await User.findByPk(req.decodedToken.id);
        try {
            user.username = req.params.username;
            await user.save();
            res.json(user);
        } catch (err) {
            return res.status(400).json({ error });
        }
    }
);

module.exports = routerUsers