import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logic from '../../logic'
import './home.css'
import Calendar from "react-big-calendar";
import moment from "moment";
import swal from 'sweetalert2'
import "react-big-calendar/lib/css/react-big-calendar.css";
import Toggle from 'react-toggle'


moment.locale('ko', {
    week: {
        dow: 1,
        doy: 1,
    }
})
Calendar.setLocalizer(Calendar.momentLocalizer(moment));

class Home extends Component {

    state = {
        nurse: '',
        id: '',
        disp: false,
        dispUpdated: false,
        admin: false,
        events: []
    }

    componentWillMount() {

        logic.retrieveNurse()
            .then(info => {
                this.setState({
                    nurse: info.data.name,
                    id: info.data.id,
                    disp: info.data.disp,
                    admin: info.data.admin,
                    events: info.data.events
                })
                if (info.data.admin) this.props.history.push('/home-admin')
            })
            .catch(error => swal(
                error.message
            )
            )
    }


    showDisp = (e) => {
        this.setState({
            disp: e.target.checked,
            dispUpdated: true
        })
    }
    handleDisp = () => {
        const disp = this.state.disp
        logic.changeDisp(disp)
            .then(() => {
                if (disp) {
                    swal(
                        "You're available !!"
                    )
                }
                else {
                    swal(
                        "You're not available :("
                    )
                }
            })
    }

    render() {

        return (
            <div className="main-ho fadeIn">

                <nav>
                    <div className="header-logo">
                    <Link className="header-logo-link" to="/home">Nursefy</Link>
                    </div>
                    <div className="logout">
                    <Link className="header-logo-link" to="/" onClick={this.props.logOut}>Logout</Link>
                    </div>
                </nav>
            
                <main className="calendar">
                    <h2 className="login-title">{this.state.nurse}'s calendar</h2>

                    <Calendar

                        defaultDate={new Date()}
                        defaultView="month"
                        events={this.state.events}
                        views={["month"]}
                        style={{ height: "45vh", margin: "2vh" }}
                    />
                    <div>
                        <div className="legend">
                            <span>DH: Day Hospital</span>
                            <span>MP: Early Shift</span>
                            <span>AP: Afternoon Shift</span>
                            <span>NS: Night shift</span>
                        </div>
                        <div className="aval-container">
                            <span className="set-aval-text">You're available</span>

                            <Toggle
                                className="toggle"
                                checked={this.state.disp}
                                onChange={this.showDisp} />

                            {this.state.dispUpdated && <button className="aval-submit-button" onClick={this.handleDisp}>OK</button>}
                        </div>

                    </div>



                </main>
                <footer>
                    Nursefy ver. 1.0.0
                </footer>
            </div>
        )
    }

}


export default Home