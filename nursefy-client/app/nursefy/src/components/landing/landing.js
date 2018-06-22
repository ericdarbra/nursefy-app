import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './landing.css'

class Landing extends Component {


    render() {
        return (
            <div className="main">
                <div className="cover">
                    <header className="header">
  
                        <h1 className="title">Nursefy</h1>
       
                        <p className="subtitle">Your healthcare Schedule</p>
                    </header>

                    <main className="main-content text-center">

                        <Link to="/register" className="main-register-button">Register a new member</Link>
                        <Link to="/login" className="main-login-button">Login your account</Link>
                       {/*  <span><a><Link to="/retrieve-password">Forgot your password?</Link></a></span> */}

                    </main>
                </div>
            </div>
        )
    }
}
export default Landing