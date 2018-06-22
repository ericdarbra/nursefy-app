import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logic from '../../logic'
import './register.css'
import swal from 'sweetalert2'


class Register extends Component {
    state = {
        name: '',
        surname: '',
        email: '',
        username: '',
        password: ''
    }

    nurseName = e => {
        this.setState({ name: e.target.value })
    }

    nurseSurname = e => {
        this.setState({ surname: e.target.value })
    }

    nurseEmail = e => {
        this.setState({ email: e.target.value })
    }

    nurseLogin = e => {
        this.setState({ username: e.target.value })
    }

    nursePassword = e => {
        this.setState({ password: e.target.value })
    }

    registerNurse = e => {
        e.preventDefault()

        logic.registerNurse(this.state.name, this.state.surname, this.state.email, this.state.username, this.state.password)
            .then(() => {
                this.props.history.push('/login')
            })
            .catch(err => swal(err.message))
    }

    render() {

        return (

            <div className="main-ss">

                <nav>
                    <div className="header-logo"><Link className="header-logo-link" to="/">Nursefy</Link></div>
                </nav>
                <main className="animated fadeInUp">                   
                    <form onSubmit={this.registerNurse} className="main-content-register">
                        <h2>Register a new user</h2>
                        <span>Create an account by filling the data fields</span>
                        <input type="text" name="" placeholder="Name" id="" value={this.state.name} onChange={this.nurseName} />
                        <input type="text" name="" placeholder="Surname" id="" value={this.state.surname} onChange={this.nurseSurname} />
                        <input type="email" name="" placeholder="Email" id="" value={this.state.email} onChange={this.nurseEmail} />
                        <input type="text" name="username" placeholder="Nurse ID" id="" value={this.state.username} onChange={this.nurseLogin} />
                        <input type="password" name="password" placeholder="Password" id="" value={this.state.password} onChange={this.nursePassword} />
                        <button className="main-button">REGISTER</button>
                    </form>
                </main>

            </div>
        )
    }
}


export default Register