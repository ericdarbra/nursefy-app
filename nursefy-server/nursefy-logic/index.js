'use strict'

const { models: { User, Events } } = require('nursefy-data')

const logic = {
    /**
     * @param {String} name
     * @param {String} surname
     * @param {String} email
     * @param {String} address
     * @param {String} transport
     * @param {String} nursecard
     * @param {String} password
     * 
     * @returns {Promise<boolean>}
     * 
     */
    registerNurse(name, surname, email, nursecard, password) {
        return Promise.resolve()
            .then(() => {

                if (typeof name !== 'string') throw Error('user name is not a string')

                if (!(name = name.trim()).length) throw Error('user name is empty or blank')

                if (typeof surname !== 'string') throw Error('user surname is not a string')

                if ((surname = surname.trim()).length === 0) throw Error('user surname is empty or blank')

                if (typeof email !== 'string') throw Error('user email is not a string')

                if (!(email = email.trim()).length) throw Error('user email is empty or blank')

                if (typeof nursecard !== 'string') throw Error('Nurse card is not a string')

                if ((nursecard = nursecard.trim()).length === 0) throw Error('Nurse card is empty or blank')

                if (typeof password !== 'string') throw Error('user password is not a string')

                if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

                return User.findOne({ nursecard })
                    .then(user => {
                        if (user) throw Error(`user with nursecard ${nursecard} already exists`)

                        return User.create({ name, surname, email, nursecard, password })
                            .then(() => true)

                    })
            })
    },
    /**
     * @param {String} nursecard
     * @param {String} password
     * 
     * @returns {Promise<string>}
     * 
     */
    authenticateNurse(nursecard, password) {
        return Promise.resolve()
            .then(() => {

                if (typeof nursecard !== 'string') throw Error('Nursecard is not a string')

                if ((nursecard = nursecard.trim()).length === 0) throw Error('Nursecard is empty or blank')

                if (typeof password !== 'string') throw Error('password is not a string')

                if ((password = password.trim()).length === 0) throw Error('password is empty or blank')

                return User.findOne({ nursecard, password })
            })
            .then(nurse => {
                if (!(nurse)) throw Error('Wrong credentials')
                return nurse.id
            })
    },
    listUsers() {

        return Promise.resolve()

            .then(() => {

                return User.find({ disp: true })

            })
            .then(user => {

                if (!(user)) throw Error('No nurses available')

                return user
            })

    },
    retrieveNurse(id) {
        return Promise.resolve()
            .then(() => {

                if (typeof id !== 'string') throw Error('id is not a string')

                if ((id = id.trim()).length === 0) throw Error('id is empty or blank')

                return User.findById(id).select({ _id: 1, name: 1, surname: 1, events: 1, email: 1, disp: 1, admin: 1 })
            })
            .then(nurse => {
                if (!nurse) throw Error(`no nurse found with id ${id}`)

                return nurse
            })
    },
    addEvent(nurseId, event) {
        return Promise.resolve()
            .then(() => {
                if (typeof nurseId !== 'string') throw Error('user id is not a string')

                if (!(nurseId = nurseId.trim()).length) throw Error('user id is empty or blank')

                if (typeof event !== 'object') throw Error('event is not an object')

                return User.findByIdAndUpdate(nurseId, { $push: { events: event } }, { new: true })
                    .then(res => {
                        if (!res) throw Error(`no user found with nurseId ${nurseId}`)

                        return res.events[res.events.length - 1].id
                    })
            })
    },
    listEvents(nurseId) {
        return Promise.resolve()
            .then(() => {

                if (typeof nurseId !== 'string') throw Error('user id is not a string')

                if (!(nurseId = nurseId.trim()).length) throw Error('user id is empty or blank')


                return User.findById(nurseId).select({ events: 1 })
                    .then(nurse => {
                        if (!nurse) throw Error(`no user found with nurseId ${nurseId}`)
                        return nurse.events
                    })

            })
    },
    changeDisp(nurseId, disp) {

        return Promise.resolve()
            .then(() => {

                if (typeof nurseId !== 'string') throw Error('user id is not a string')

                if (!(nurseId = nurseId.trim()).length) throw Error('user id is empty or blank')

                if (typeof disp !== 'boolean') throw Error('disp is not a boolean')


                return User.findById(nurseId)
                    .then(nurse => {

                        return nurse
                    })
                    .then(nurse => {
                        nurse.disp = disp
                        return nurse.save()
                    })
                    .then(() => true)
            })

    }

}

module.exports = logic