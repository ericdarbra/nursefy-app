'use strict'

require('dotenv').config()

const { mongoose, models: { User, Calendar, Events, Hospital } } = require('nursefy-data')
const { expect } = require('chai')
const logic = require('.')


const { env: { DB_URL } } = process

describe('logic (nursefy)', () => {
    const userData = { name: 'John', surname: 'Doe', email: 'jd@mail.com', nursecard: "38878609F", password: '123', disp:true }
    const otherUserData = { name: 'Jack', surname: 'Wayne', email: 'jw@mail.com', nursecard: "38878600F", password: '456', disp:false }
    const dummyUserId = '123456781234567812345678'
    const eventTest = { start: "2018, 6, 6", end: "2018, 6, 7", title: "Test title" }
    const indexes = []

    before(() => mongoose.connect(DB_URL))

    beforeEach(() => {
        let count = 10 + Math.floor(Math.random() * 10)
        indexes.length = 0
        while (count--) indexes.push(count)

        return Promise.all([User.remove()])
    })

    describe('register user', () => {
        it('should succeed on correct data', () =>
            logic.registerNurse('John', 'Doe', 'jd@mail.com', '383838', '123')
                .then(res => expect(res).to.be.true)
        )

        it('should fail on already registered user', () =>
            User.create(userData)
                .then(() => {
                    const { name, surname, email, nursecard, password } = userData

                    return logic.registerNurse(name, surname, email, nursecard, password)
                })
                .catch(({ message }) => {
                    expect(message).to.equal(`user with nursecard ${userData.nursecard} already exists`)
                })
        )

        it('should fail on no user name', () =>
            logic.registerNurse()
                .catch(({ message }) => expect(message).to.equal('user name is not a string'))
        )

        it('should fail on empty user name', () =>
            logic.registerNurse('')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on blank user name', () =>
            logic.registerNurse('     ')
                .catch(({ message }) => expect(message).to.equal('user name is empty or blank'))
        )

        it('should fail on no user surname', () =>
            logic.registerNurse(userData.name)
                .catch(({ message }) => expect(message).to.equal('user surname is not a string'))
        )

        it('should fail on empty user surname', () =>
            logic.registerNurse(userData.name, '')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on blank user surname', () =>
            logic.registerNurse(userData.name, '     ')
                .catch(({ message }) => expect(message).to.equal('user surname is empty or blank'))
        )

        it('should fail on no user email', () =>
            logic.registerNurse(userData.name, userData.surname)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.registerNurse(userData.name, userData.surname, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.registerNurse(userData.name, userData.surname, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )
        it('should fail on no nurse card', () =>
            logic.registerNurse(userData.name, userData.surname, userData.email)
                .catch(({ message }) => expect(message).to.equal('Nurse card is not a string'))
        )

        it('should fail on empty nursecard', () =>
            logic.registerNurse(userData.name, userData.surname, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('Nurse card is empty or blank'))
        )

        it('should fail on blank nursecard', () =>
            logic.registerNurse(userData.name, userData.surname, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('Nurse card is empty or blank'))
        )
        it('should fail on no user password', () =>
            logic.registerNurse(userData.name, userData.surname, userData.email, userData.nursecard)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.registerNurse(userData.name, userData.surname, userData.email, userData.nursecard, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.registerNurse(userData.name, userData.surname, userData.email, userData.nursecard, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })
    describe('login user', () => {

        it('should succeed on login', () => {
            User.create(userData)
                .then(() => {
                    logic.authenticateNurse('38878609F', '123')
                        .then(id => expect(id).to.exist)
                })
        })

        it('should fail on no nursecard', () =>
            logic.authenticateNurse()
                .catch(({ message }) => expect(message).to.equal('Nursecard is not a string'))
        )
        it('should fail on blank nursecard', () =>
            logic.authenticateNurse('')
                .catch(({ message }) => expect(message).to.equal('Nursecard is empty or blank'))
        )
        it('should fail on blank nursecard', () =>
            logic.authenticateNurse('    ')
                .catch(({ message }) => expect(message).to.equal('Nursecard is empty or blank'))
        )
        it('should fail on no password', () =>
            logic.authenticateNurse(userData.nursecard)
                .catch(({ message }) => expect(message).to.equal('password is not a string'))
        )
        it('should fail on blank password', () =>
            logic.authenticateNurse(userData.nursecard, '')
                .catch(({ message }) => expect(message).to.equal('password is empty or blank'))
        )
        it('should fail on blank password', () =>
            logic.authenticateNurse(userData.nursecard, '    ')
                .catch(({ message }) => expect(message).to.equal('password is empty or blank'))
        )

    })
    describe('add event', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {

                    return logic.addEvent(id, eventTest)
                        .then(eventId => {

                            expect(eventId).to.exist
                            expect(eventId).to.be.a('string')

                            return User.findById(id)
                                .then(user => {

                                    expect(user).to.exist
                                    expect(user.events).to.exist
                                    expect(user.events.length).to.equal(1)

                                    const [{ start, end, title }] = user.events

                                    expect(start).to.equal('2018, 6, 6')
                                    expect(end).to.equal('2018, 6, 7')
                                    expect(title).to.equal('Test title')

                                })
                        })
                })
        )

        it('should fail on wrong user id', () => {
            return logic.addEvent(dummyUserId, eventTest)
                .catch(({ message }) => expect(message).to.equal(`no user found with nurseId ${dummyUserId}`))
        })

        it('should fail on no user id', () =>
            logic.addEvent()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.addEvent('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.addEvent('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on no event', () => {
            logic.addEvent(dummyUserId)
                .catch(({ message }) => expect(message).to.equal('event is not an object'))
        })


    })
    describe('list users', () => {

        it('should succeed on correct data', () => {
           User.create(userData)
                    return User.find({ disp: true })
                        .then(list => {
                         
                            expect(list).to.exist
                            expect(list).to.be.an('array')
                       
                        })
                     
                })
        })

    describe('list events', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.addEvent(id, eventTest)
                        .then(events => {

                            expect(events).to.be.a('string')
                            expect(events).to.exist

                            return User.findById(id)
                                .then(user => {
                                    expect(user).to.exist

                                    return logic.listEvents(id)
                                        .then(event => {
                                            expect(user.events).to.exist
                                            expect(user.events.length).to.equal(1)
                                        })
                                })
                        })
                })
        )
        it('should fail on wrong user id', () => {
            return logic.listEvents(dummyUserId)
                .catch(({ message }) => expect(message).to.equal(`no user found with nurseId ${dummyUserId}`))
        })

        it('should fail on no user id', () =>
            logic.listEvents()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.listEvents('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.listEvents('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

    })
    describe('update availability', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id, disp }) => {
                    return User.findById(id)
                        .then(user => {
                            expect(user.disp).to.exist

                            return logic.changeDisp(id, disp)
                                .then(user => {
                                    expect(user).to.be.true
                                    expect(user).to.equal(disp)
                                })
                        })
                })
        )


        it('should fail on no user id', () =>
            logic.changeDisp()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.changeDisp('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.changeDisp('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on wrong disp', () =>
            logic.changeDisp(userData.nursecard, 1)
                .catch(({ message }) => expect(message).to.equal('disp is not a boolean'))
        )


    })

    /* after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done))) */
})