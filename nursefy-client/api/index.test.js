'use strict'

require('dotenv').config()

const { mongoose, models: { User, Calendar, Events, Hospital } } = require('nursefy-data')
const { expect } = require('chai')
const apiNurse = require('.')
/* const _ = require('lodash') */
const axios = require('axios')
const jwt = require('jsonwebtoken')

const { env: { DB_URL, API_URL, TOKEN_SECRET } } = process

apiNurse.url = API_URL

describe('apiNurse (notes api)', () => {
    const userData = { name: 'John', surname: 'Doe', email: 'jd@mail.com', nursecard: "38878609F", password: '123' }
    const otherUserData = { name: 'Jack', surname: 'Wayne', email: 'jw@mail.com', nursecard: "38878600F", password: '456' }
    const fakeUserId = '123456781234567812345678'
    const fakeNoteId = '123456781234567812345678'
    const noteText = 'my note'
    const indexes = []

    before(() => mongoose.connect(DB_URL))

    beforeEach(() => {
        let count = 10 + Math.floor(Math.random() * 10)
        indexes.length = 0
        while (count--) indexes.push(count)

        return Promise.all([User.remove()]) // or User.deleteMany()
    })

    describe('register user', () => {
        it('should succeed on correct data', () =>
            apiNurse.registerNurse('John', 'Doe', 'jd@mail.com', '383838', '123')
                .then(res => expect(res).to.be.true)
        )

        it('should fail on already registered user', () =>
            User.create(userData)
                .then(() => {
                    const { name, surname, email, nursecard, password } = userData

                    return apiNurse.registerNurse(name, surname, email, nursecard, password)
                })
                .catch(({ message }) => {
                    expect(message).to.equal(`user with email ${userData.email} already exists`)
                })
        )

        it('should fail on no user name', () =>
            apiNurse.registerNurse()
                .catch(({ message }) => expect(message).to.equal('user name is not a string'))
        )

        it('should fail on empty user name', () =>
            apiNurse.registerNurse('')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on blank user name', () =>
            apiNurse.registerNurse('     ')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on no user surname', () =>
            apiNurse.registerNurse(userData.name)
                .catch(({ message }) => expect(message).to.equal('user surname is not a string'))
        )

        it('should fail on empty user surname', () =>
            apiNurse.registerNurse(userData.name, '')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on blank user surname', () =>
            apiNurse.registerNurse(userData.name, '     ')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on no user email', () =>
            apiNurse.registerNurse(userData.name, userData.surname)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            apiNurse.registerNurse(userData.name, userData.surname, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            apiNurse.registerNurse(userData.name, userData.surname, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )
        it('should fail on no nurse card', () =>
            apiNurse.registerNurse(userData.name, userData.surname, userData.email)
                .catch(({ message }) => expect(message).to.equal('nurse card is not a string'))
        )

        it('should fail on empty nursecard', () =>
            apiNurse.registerNurse(userData.name, userData.surname, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('nurse card is empty or blank'))
        )

        it('should fail on blank nursecard', () =>
            apiNurse.registerNurse(userData.name, userData.surname, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('nurse card is empty or blank'))
        )
        it('should fail on no user password', () =>
            apiNurse.registerNurse(userData.name, userData.surname, userData.email, userData.nursecard)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            apiNurse.registerNurse(userData.name, userData.surname, userData.email, userData.nursecard, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            apiNurse.registerNurse(userData.name, userData.surname, userData.email, userData.nursecard, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })
    describe('login user', () => {

        it('should succeed on login', () => {
            return User.create(userData)
                .then(() => {
                    returnapiNurse.authenticateNurse('38878609F', '123')
                        .then(id => {
                            expect(id).to.exist
                        })
                })
        })

        it('should fail on no nursecard', () =>
            apiNurse.authenticateNurse()
                .catch(({ message }) => expect(message).to.equal('nursecard is not a string'))
        )
        it('should fail on blank nursecard', () =>
            apiNurse.authenticateNurse('')
                .catch(({ message }) => expect(message).to.equal('nursecard is empty or blank'))
        )
        it('should fail on blank nursecard', () =>
            apiNurse.authenticateNurse('    ')
                .catch(({ message }) => expect(message).to.equal('nursecard is empty or blank'))
        )
        it('should fail on no password', () =>
            apiNurse.authenticateNurse(userData.nursecard)
                .catch(({ message }) => expect(message).to.equal('password is not a string'))
        )
        it('should fail on blank password', () =>
            apiNurse.authenticateNurse(userData.nursecard, '')
                .catch(({ message }) => expect(message).to.equal('password is empty or blank'))
        )
        it('should fail on blank password', () =>
            apiNurse.authenticateNurse(userData.nursecard, '    ')
                .catch(({ message }) => expect(message).to.equal('password is empty or blank'))
        )

    })
    describe('retrieve', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(() => {
                    apiNurse.authenticateNurse('38878609F', '123')
                        .then(id => {
                            const token = jwt.sign({ id }, TOKEN_SECRET)

                            apiNurse.token = token

                            return apiNurse.retrieveNurse(id)
                        })
                        .then(user => {
                            console.log(user)
                        })
                })

                .then(() => {
                    const token = jwt.sign({ id }, TOKEN_SECRET)

                    apiNurse.token = token

                    apiNurse.retrieveNurse(id)
                })
        )
    })
})
    /*    after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done)))
})*/