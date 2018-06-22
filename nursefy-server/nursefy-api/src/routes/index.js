const express = require('express')
const bodyParser = require('body-parser')
const logic = require('nursefy-logic')
const jwt = require('jsonwebtoken')
const jwtValidation = require('./utils/jwt-validation')

const router = express.Router()

const { env: { TOKEN_SECRET, TOKEN_EXP } } = process

const jwtValidator = jwtValidation(TOKEN_SECRET)

const jsonBodyParser = bodyParser.json()

/* Register */

router.post('/users', jsonBodyParser, (req, res) => {
    const { body: { name, surname, email, nursecard, password } } = req

    logic.registerNurse(name, surname, email, nursecard, password)
        .then(() => {
            res.status(201)
            res.json({ status: 'OK' })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
}),

    /* Auth */
    router.post('/users/auth', jsonBodyParser, (req, res) => {
        const { body: { nursecard, password } } = req

        logic.authenticateNurse(nursecard, password)
            .then(id => {
                const token = jwt.sign({ id }, TOKEN_SECRET, { expiresIn: TOKEN_EXP })
                res.status(200)
                res.json({ status: 'OK', data: { id, token } })
            })
            .catch(({ message }) => {
                res.status(400)
                res.json({ status: 'KO', error: message })
            })
    }),
    /* List nurses*/
    router.get('/users/list', (req, res) => {

        logic.listUsers()
            .then(list => {
                res.status(200)
                res.json({ status: 'OK', data: list })
            })
            .catch(({ message }) => {
                res.status(400)
                res.json({ status: 'KO', error: message })
            })
    })

/* Retrieve nurse */
router.get('/users/:nurseId', jwtValidator, (req, res) => {
    const { params: { nurseId } } = req

    logic.retrieveNurse(nurseId)
        .then(nurse => {
            res.status(200)
            res.json({ status: 'OK', data: nurse })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})
/** Retrieve user from admin */
router.get('/users/admin/:nurseId', (req, res) => {
    const { params: { nurseId } } = req

    logic.retrieveNurse(nurseId)
        .then(nurse => {
            res.status(200)
            res.json({ status: 'OK', data: nurse })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
}),
/* Add an event */
router.post('/users/admin/event', jsonBodyParser, (req, res) => {
    const { body: { id, event } } = req

    logic.addEvent(id, event)
        .then(id => {
            res.status(200)
            res.json({ status: 'OK' })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
}),
// Availability
router.post('/users/:nurseId/disp', [jwtValidator, jsonBodyParser], (req, res) => {
    const { params: { nurseId }, body: { disp } } = req

    logic.changeDisp(nurseId, disp)
        .then(() => {
            res.status(200)
            res.json({ status: 'OK' })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

module.exports = router