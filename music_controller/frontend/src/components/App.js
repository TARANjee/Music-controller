import React, { useState, useEffect } from 'react'
import CreateRoomPage from './CreateRoomPage';
import HomePage from './HomePage';
import RoomJoinPage from './RoomJoinPage';
import Room from './Room';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";


const App = () => {
    const [roomCode, setRoomCode] = useState(null)

    useEffect(() => {
        const useInRoom = async () => {
            await fetch('api/user-in-room')
                .then((response) => response.json())
                .then((data) => {
                    setRoomCode(data.code)
                })
        }
        useInRoom();
    }, [])


    const clearRoomCode = () => {
        setRoomCode(null)
    }
    return (
        <Router>
            <Switch>
                <Route exact path="/" render={() => {
                    return roomCode ? (<Redirect to={`room/${roomCode}`} />) : (<HomePage />)
                }}>
                </Route>
                <Route exact path="/join" ><RoomJoinPage /></Route>
                <Route exact path="/create"><CreateRoomPage /></Route>
                <Route exact path="/room/:roomCode" render={(props) => <Room {...props} leaveRoomCallback={clearRoomCode} />} ></Route>
            </Switch>
        </Router>
    )
}

export default App
