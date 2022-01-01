import React from 'react'
import CreateRoomPage from './CreateRoomPage';
import HomePage from './HomePage';
import RoomJoinPage from './RoomJoinPage';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/"><HomePage/></Route>
                <Route exact path="/join" ><RoomJoinPage /></Route>
                <Route exact path="/create"><CreateRoomPage /></Route>
            </Switch>
        </Router>
    )
}

export default App