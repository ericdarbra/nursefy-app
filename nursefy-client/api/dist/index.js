'use strict';

var axios = require('axios');

var apiNurse = {

    url: 'NO-URL',

    token: function token(_token) {
        if (_token) {
            this._token = _token;

            return;
        }

        return this._token;
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
    registerNurse: function registerNurse(name, surname, email, nursecard, password) {
        var _this = this;

        return Promise.resolve().then(function () {
            if (typeof name !== 'string') throw Error('user name is not a string');
            if (!(name = name.trim()).length) throw Error('user name is empty or blank');

            if (typeof surname !== 'string') throw Error('user surname is not a string');
            if ((surname = surname.trim()).length === 0) throw Error('user surname is empty or blank');

            if (typeof email !== 'string') throw Error('user email is not a string');
            if (!(email = email.trim()).length) throw Error('user email is empty or blank');

            if (typeof nursecard !== 'string') throw Error('nurse card is not a string');
            if ((nursecard = nursecard.trim()).length === 0) throw Error('nurse card is empty or blank');

            if (typeof password !== 'string') throw Error('user password is not a string');
            if ((password = password.trim()).length === 0) throw Error('user password is empty or blank');

            return axios.post(_this.url + '/users', { name: name, surname: surname, email: email, nursecard: nursecard, password: password }).then(function (_ref) {
                var status = _ref.status,
                    data = _ref.data;

                return true;
            }).catch(function (err) {

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                } else throw err;
            });
        });
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
    authenticateNurse: function authenticateNurse(nursecard, password) {
        var _this2 = this;

        return Promise.resolve().then(function () {
            console.log('hola');
            if (typeof nursecard !== 'string') throw Error('nursecard is not a string');
            if ((nursecard = nursecard.trim()).length === 0) throw Error('nursecard is empty or blank');

            if (typeof password !== 'string') throw Error('password is not a string');
            if ((password = password.trim()).length === 0) throw Error('password is empty or blank');

            return axios.post(_this2.url + '/users/auth', { nursecard: nursecard, password: password }).then(function (_ref2) {
                var status = _ref2.status,
                    data = _ref2.data;
                var _data$data = data.data,
                    id = _data$data.id,
                    token = _data$data.token,
                    admin = _data$data.admin;

                _this2.token(token);

                return id;
            }).catch(function (err) {

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                } else throw err;
            });
        });
    },

    /**
     * List all available nurses
     * 
     */
    listUsers: function listUsers() {
        var _this3 = this;

        return Promise.resolve().then(function () {
            return axios.get(_this3.url + '/users/list').then(function (list) {
                return list;
            }).catch(function (err) {

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                }
            });
        });
    },


    /**
    * Retrieves data from a single nurse
    * 
    * @param {string} id
    * 
    * @returns {Promise<Object>} 
    */
    retrieveNurse: function retrieveNurse(id) {
        var _this4 = this;

        return Promise.resolve().then(function () {

            if (typeof id !== 'string') throw Error('id is not a string');
            if ((id = id.trim()).length === 0) throw Error('id is empty or blank');

            return axios.get(_this4.url + '/users/' + id, { headers: { Authorization: 'Bearer ' + _this4.token() } }).then(function (data) {

                return data.data;
            }).catch(function (err) {

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                }
            });
        });
    },


    /**
    * Retrieves data from a single nurse from the admin panel
    * 
    * @param {string} id
    * 
    * @returns {Promise<Object>} 
    */
    retrieveNurseAdmin: function retrieveNurseAdmin(id) {
        var _this5 = this;

        return Promise.resolve().then(function () {

            if (typeof id !== 'string') throw Error('id is not a string');
            if ((id = id.trim()).length === 0) throw Error('id is empty or blank');

            return axios.get(_this5.url + '/users/admin/' + id).then(function (data) {

                return data.data;
            }).catch(function (err) {

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                }
            });
        });
    },


    /**
    * Creates a new event
    * 
    * @param {string} id
    * @param {Object} event
    * 
    * @returns {Promise<Boolean>} 
    */
    addEvent: function addEvent(id, event) {
        var _this6 = this;

        return Promise.resolve().then(function () {
            return axios.post(_this6.url + '/users/admin/event', { id: id, event: event }).then(function (_ref3) {
                var status = _ref3.status,
                    data = _ref3.data;

                return true;
            }).catch(function (err) {
                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                }
            });
        });
    },

    /**
    * Creates a new event
    * 
    * @param {string} id
    * @param {Object} event
    * 
    * @returns {Promise<Boolean>} 
    */
    changeDisp: function changeDisp(id, disp) {
        var _this7 = this;

        return Promise.resolve().then(function () {

            return axios.post(_this7.url + '/users/' + id + '/disp', { disp: disp }, { headers: { Authorization: 'Bearer ' + _this7.token() } }).then(function (_ref4) {
                var status = _ref4.status,
                    data = _ref4.data;

                return true;
            }).catch(function (err) {

                if (err.response) {
                    var message = err.response.data.error;


                    throw Error(message);
                }
            });
        });
    }
};

module.exports = apiNurse;
