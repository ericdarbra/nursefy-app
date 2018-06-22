'use strict'

const jwt = require('jsonwebtoken')

let _secret = 'NO-SECRET'

function jwtValidator(req, res, next) {
    let message

    const { params: { nurseId } } = req

    try {
        const auth = req.get('authorization') // Bearer CHURRO-TOKEN

        const token = auth.split(' ')[1]

        const { id } = jwt.verify(token, _secret)

        if (id !== nurseId) message = `user id ${nurseId} does not match token user id ${id}`

        if (!message) return next()
    } catch (err) {
        message = 'invalid token'
    }

    res.status(401)
    res.json({ status: 'KO', error: message })
}

module.exports = function(secret) {
    _secret = secret

    return jwtValidator
}