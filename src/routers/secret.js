const express = require("express")
const Secret = require("../models/secret")
const auth = require("../middleware/auth")

const router = new express.Router()

// add new secret
router.post("/secret", auth, async (req, res) => {
    try {
        const secret = new Secret({
            ...req.body,
            owner: req.user._id
        })
        await secret.save()
        res.status(201).send(secret)
    } catch (e) {
        res.status(500).send({ e })
    }
})

// get all the secrets belonging to the logged in user
router.get("/userSecrets", auth, async (req, res) => {
    try {
        await req.user.populate("secrets")
        res.status(201).send(req.user.secrets)
    } catch (e) {
        res.status(500).send({ e })
    }
})

// get secret by its id
router.get("/secret/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id
        const secret = await Secret.findOne({ _id, owner: req.user._id })

        if (!secret) {
            return res.status(404).send()
        }
        res.status(200).send(secret)
    } catch (e) {
        res.status(500).send({ e })
    }
})

// update secret by id
router.patch("/secret/:id", auth, async (req, res) => {
    const requestedUpdates = Object.keys(req.body)
    const validUpdates = ["belongsTo", "username", "password", "description"]
    const isUpdateValid = requestedUpdates.every((update) => validUpdates.includes(update))
   
    if (!isUpdateValid) {
        return res.status(400).send({ e: "One or more fields are invalid!" })
    }

    try {
        const _id = req.params.id
        const secret = await Secret.findOne({ _id, owner: req.user._id })

        if (!secret) {
            return res.status(404).send({ e: "Invalid id!" })
        }

        requestedUpdates.forEach((update) => {
            secret[update] = req.body[update]
        })
        await secret.save()
        res.status(201).send(secret)
    } catch (e) {
        res.status(500).send({ e })
    }
})

// delete secret by id
router.delete("/secret/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id
        const secret = await Secret.findOne({ _id, owner: req.user._id })

        if (!secret) {
            return res.status(404).send({ e: "Invalid id!"})
        }

        await secret.remove()
        res.send(secret)
    } catch (e) {
        res.status(500).send({ e })
    }
})

// get all tasks - temporary
router.get("/secret", async (req, res) => {
    try {
        const secrets = await Secret.find({})
        res.status(200).send(secrets)
    } catch (e) {
        res.status(500).send({ e })
    }
})

module.exports = router