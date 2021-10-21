const express = require("express")
const User = require("../models/user")
const auth = require("../middleware/auth")

const router = new express.Router()

// sign up new user using email and password
router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

// login user
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

// logout user
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.authTokens = req.user.authTokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// log user out from all devices
router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.authTokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send({ e })
    }
})

router.get("/users/profile", auth, async (req, res) => res.send(req.user))

// get all users - temporary
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users) 
    } catch (e) {
        res.status(500).send(e)
    }
})

// update user info
router.patch("/users/me", auth, async (req, res) => {
    const validUpdates = ["name", "email", "age", "password"]
    const requestedUpdates = Object.keys(req.body)
    const isUpdateValid = requestedUpdates.every((update) => {
        return validUpdates.includes(update)
    })

    if (!isUpdateValid) {
        res.status(404).send({ error: "One or more fields are invalid!"})
    }

    try {
        requestedUpdates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user) 
    } catch (e) {
        res.status(400).send({ e })
    }
})

// delete existing user
router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send({ e })
    }
})

module.exports = router