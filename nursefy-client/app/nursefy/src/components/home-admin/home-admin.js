import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logic from '../../logic'
import './home-admin.css'
import Calendar from "react-big-calendar";
import moment from "moment";
import swal from 'sweetalert2'
import "react-big-calendar/lib/css/react-big-calendar.css";


moment.locale('ko', {
    week: {
        dow: 1,
        doy: 1,
    }
})
Calendar.setLocalizer(Calendar.momentLocalizer(moment));

class HomeAdmin extends Component {

    state = {
        nurses: '',
        name: '',
        id: '',
        admin: false,
        events: [],
        list: []
    }
    componentWillMount() {
        logic.listUsers()
            .then(res => {
                this.setState({
                    list: res.data
                })
            })
    }
    startDate = (e) => {
        this.setState({
            start: e.target.value
        })
    }
    endDate = (e) => {

        this.setState({
            end: e.target.value
        })
    }
    titleHandler = e => {
        this.setState({
            title: e.target.value
        })
    }
    nurseHandler = e => {
        this.setState({
            id: e.target.value
        }, () => {

            logic.retrieveNurseAdmin(this.state.id)
                .then(info => {
                    this.setState({
                        events: info.data.events,
                        id: info.data._id
                    })
                })
        })

    }
    addEvent = e => {
        e.preventDefault()
        const id = this.state.id
        const evenT = { start: this.state.start, end: this.state.end, title: this.state.title }
        logic.addEvent(id, evenT)
            .then(() => {
                logic.retrieveNurseAdmin(this.state.id)
                    .then(info => {
                        this.setState({
                            events: info.data.events,
                            id: info.data._id
                        })
                    })
            })
    }

    render() {

        return (
            <div className="main-ha">

                <nav>
                    <div className="header-logo"><Link className="header-logo-link" to="/home-admin">Nursefy</Link></div>
                    <div className="logout">
                    <Link className="header-logo-link" to="/" onClick={this.props.logOut}>Logout</Link>
                    </div>
                </nav>

                <main className="calendar">
                    <h2 className="home-title">Admin panel</h2>
                    <section className="form-general">
                        <form className="form-shift" >
                            <p>Select an available nurse</p>
                            <select placeholder="Nurse name" onChange={this.nurseHandler}>
                                <option value="" disabled selected>Select your option</option>
                                {this.state.list.map(index => {
                                    return <option value={index._id}>{index.name}</option>

                                })}
                            </select>
                        </form>
                        <div className="shift-box">
                            <p>Select the shift</p>
                            <select onChange={this.titleHandler}>
                                <option value="" disabled selected>Select your option</option>
                                <option value="DH">Day Hospital</option>
                                <option value="ES">Early Shift</option>
                                <option value="AS">Afternoon Shift</option>
                                <option value="NS">Night Shift</option>
                            </select>
                        </div>

                        <form className="form-event" onSubmit={this.addEvent}>
                            <p>Select the dates</p>
                            <input type="date" value={this.start} onChange={this.startDate} />
                            <input type="date" value={this.end} onChange={this.endDate} />
                            <button type="submit" className="form-submit-button">Submit</button>

                        </form>
                    </section>
                    <Calendar
                        defaultDate={new Date()}
                        defaultView="month"
                        views={["month"]}
                        events={this.state.events}
                        style={{ height: "45vh", margin: "2vh" }}
                    />

                </main>
                <footer>
                    Nursefy ver. 1.0.0
                </footer>

            </div>
        )
    }

}


export default HomeAdmin