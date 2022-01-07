import React, { useState, useEffect } from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import { useParams, useHistory } from 'react-router-dom'
import CreateRoomPage from './CreateRoomPage';

const Room = ({ leaveRoomCallback }) => {
    const { roomCode } = useParams();
    const history = useHistory();
    const [showSettings, setShowSettings] = useState(false)
    const [votesToSkip, setVotesToSkip] = useState(2)
    const [guestCanPause, setGuestCanPause] = useState(false)
    const [isHost, setIsHost] = useState(false)

    const getRoomDetails = async () => {
        await fetch(`/api/get-room?code=${roomCode}`)
            .then((response) => {
                if (!response.ok) {
                    leaveRoomCallback()
                    history.push('/');
                }
                return response.json()
            })
            .then((data) => {
                setGuestCanPause(data.guest_can_pause),
                    setVotesToSkip(data.votes_to_skip),
                    setIsHost(data.is_host)
            })
    }
    useEffect(() => {
        getRoomDetails()
    }, [])

    const leaveButtonPressed = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
        await fetch('/api/leave-room', requestOptions)
            .then((response) => {
                leaveRoomCallback()
                history.push('/')
            })
    }

    const renderSettingButton = () => {
        return (
            <Grid item xs={12} align='center'>
                <Button variant='contained' color='primary' onClick={() => setShowSettings(true)} >Settings</Button>
            </Grid>
        );
    }
    const renderSetting = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center'>
                    <CreateRoomPage
                        update={true}
                        votesToSkip={votesToSkip}
                        guestCanPause={guestCanPause}
                        roomCode={roomCode}
                        updateCallback={()=>{}}
                    />
                </Grid>
                <Grid item xs={12} align='center'>
                    <Button
                        color='secondary'
                        variant='contained'
                        onClick={() => setShowSettings(false)}
                    >
                        Close
                    </Button>
                </Grid>
            </Grid>
        )
    }
    if (showSettings){
        return renderSetting();
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align='center'>
                <Typography variant='h4' component='h4'>
                    Code:{roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align='center'>
                <Typography variant='h6' component='h6'>
                    Votes:{votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align='center'>
                <Typography variant='h6' component='h6'>
                    Guest Can Pause:{guestCanPause.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align='center'>
                <Typography variant='h6' component='h6'>
                    Host:{isHost.toString()}
                </Typography>
            </Grid>
            {isHost ? (renderSettingButton()) : ("")}
            <Grid item xs={12} align='center' >
                <Button color='secondary' variant='contained' onClick={leaveButtonPressed} >Leave Room</Button>
            </Grid>
        </Grid>
    )
}

export default Room
