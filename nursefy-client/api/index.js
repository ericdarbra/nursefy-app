'use strict'

const axios = require('axios')

const apiNurse = {

    url: 'NO-URL',

    token(token) {
        if (token) {
            this._token = token

            return
        }

        return this._token
    },

    /**
     * Register a new nurse
     * 
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

                if (typeof nursecard !== 'string') throw Error('nurse card is not a string')
                if ((nursecard = nursecard.trim()).length === 0) throw Error('nurse card is empty or blank')

                if (typeof password !== 'string') throw Error('user password is not a string')
                if ((password = password.trim()).length === 0) throw Error('user password is empty or blank')

                return axios.post(`${this.url}/users`, { name, surname, email, nursecard, password })
                    .then(({ status, data }) => {
                        return true
                    })
                    .catch(err => {

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        } else throw err
                    })
            })
    },
    /**
     * Authenticates a nurse with the nursecard and password
     * 
     * @param {String} nursecard
     * @param {String} password
     * 
     * @returns {Promise<string>}
     * 
     */
    authenticateNurse(nursecard, password) {
        return Promise.resolve()
            .then(() => {
                console.log('hola')
                if (typeof nursecard !== 'string') throw Error('nursecard is not a string')
                if ((nursecard = nursecard.trim()).length === 0) throw Error('nursecard is empty or blank')

                if (typeof password !== 'string') throw Error('password is not a string')
                if ((password = password.trim()).length === 0) throw Error('password is empty or blank')

                return axios.post(`${this.url}/users/auth`, { nursecard, password })
                    .then(({ status, data }) => {
                        const { data: { id, token, admin } } = data
                        this.token(token)

                        return id

                    })
                    .catch(err => {

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        } else throw err
                    })
            })
    },
    /**
     * List all available nurses
     * 
     */
    listUsers() {
        return Promise.resolve()
            .then(() => {
                return axios.get(`${this.url}/users/list`)
                    .then(list => {
                        return list
                    })
                    .catch(err => {

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        }
                    })
            })
    },

    /**
   * Retrieves data from a single nurse
   * 
   * @param {string} id
   * 
   * @returns {Promise<Object>} 
   */
    retrieveNurse(id) {
        return Promise.resolve()
            .then(() => {

                if (typeof id !== 'string') throw Error('id is not a string')
                if ((id = id.trim()).length === 0) throw Error('id is empty or blank')

                return axios.get(`${this.url}/users/${id}`, { headers: { Authorization: `Bearer ${this.token()}` } })
                    .then((data) => {

                        return data.data
                    })
                    .catch(err => {

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        }
                    })
            })
    },
    
    /**
   * Retrieves data from a single nurse from the admin panel
   * 
   * @param {string} id
   * 
   * @returns {Promise<Object>} 
   */
    retrieveNurseAdmin(id) {
        return Promise.resolve()
            .then(() => {

                if (typeof id !== 'string') throw Error('id is not a string')
                if ((id = id.trim()).length === 0) throw Error('id is empty or blank')

                return axios.get(`${this.url}/users/admin/${id}`)
                    .then((data) => {

                        return data.data
                    })
                    .catch(err => {

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        }
                    })
            })

    },
    
    /**
   * Creates a new event
   * 
   * @param {string} id
   * @param {Object} event
   * 
   * @returns {Promise<Boolean>} 
   */
    addEvent(id, event) {
        return Promise.resolve()
            .then(() => {
                return axios.post(`${this.url}/users/admin/event`, { id, event })
                    .then(({ status, data }) => {
                        return true
                    }).catch(err => {
                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        }
                    })
            })
    },
     /**
   * Creates a new event
   * 
   * @param {string} id
   * @param {Object} event
   * 
   * @returns {Promise<Boolean>} 
   */
    changeDisp(id, disp) {
        return Promise.resolve()
            .then(() => {

                return axios.post(`${this.url}/users/${id}/disp`, { disp }, { headers: { Authorization: `Bearer ${this.token()}` } })
                    .then(({ status, data }) => {
                        return true
                    })
                    .catch(err => {

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        }
                    })
            })
    }
}

module.exports = apiNurse

