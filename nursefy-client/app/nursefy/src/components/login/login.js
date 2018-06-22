import React, {Component} from 'react'
import logic from '../../logic'
import './login.css'
import { Link } from 'react-router-dom'
import swal from 'sweetalert2'

class Login extends Component{
    state = {
        username:'',
        password:'',
        admin:false
        }
    
    userLogin = e => {
        this.setState({ username: e.target.value })
    }

    userPassword = e => {
        this.setState({ password: e.target.value })
    }

    login = e => {
        e.preventDefault()
        logic.authenticateNurse(this.state.username, this.state.password)
            .then(() => {
                swal('Successful login')
                .then(() =>{
                    this.props.history.push('/home')
                })
            })
            .catch(err => swal(err.message))
    }

    render(){

        return(
            <div className="main-s">
                
                <nav>
                    <div className="header-logo"><Link className="header-logo-link" to="/">Nursefy</Link></div>               
                </nav>
                <main className="main-content-login animated fadeInUp">
                <form className="form-login" onSubmit={this.login}>
                    <h2>User authentication</h2>
                    <span>Insert your nurse card and your password</span>
                    <p>Nurse ID</p>
                    <input type="text" name="" id="" value={this.username} onChange={this.userLogin}/>
                    <p>Password</p>
                    <input type="password" name="" id="" value={this.password} onChange={this.userPassword}/>
                    <button className="login-button">LOGIN</button>
                </form>
                </main>
                
            </div>
        )
    }
       
}


export default Login