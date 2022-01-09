import React, { useState, useEffect, useRef } from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import { useParams, useHistory } from 'react-router-dom'
import CreateRoomPage from './CreateRoomPage';
import MusicPlayer from './MusicPlayer';

const Room = ({ leaveRoomCallback }) => {
    const { roomCode } = useParams();
    const history = useHistory();
    const intervalId = useRef(null)
    const [showSettings, setShowSettings] = useState(false)
    const [votesToSkip, setVotesToSkip] = useState(2)
    const [guestCanPause, setGuestCanPause] = useState(false)
    const [isHost, setIsHost] = useState(false)
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false)
    const [song, setSong] = useState({})

    useEffect(() => {
        getRoomDetails();
        intervalId.current = setInterval(() => {
            getCurrentSong();
        }, 1000);
        return () => {
            clearInterval(intervalId.current);
        };

    }, [])

    const getRoomDetails = async () => {
        await fetch(`/api/get-room?code=${roomCode}`)
            .then((response) => {
                if (!response.ok) {
                    leaveRoomCallback();
                    history.push('/');
                }
                return response.json();
            })
            .then((data) => {
                setGuestCanPause(data.guest_can_pause),
                    setVotesToSkip(data.votes_to_skip),
                    setIsHost(data.is_host)

                if (data.is_host) {
                    authenticateSpotify();
                }

            });
    }


    const authenticateSpotify = async () => {
        await fetch('/spotify/is_authenticated')
            .then((response) => response.json())
            .then((data) => {
                setSpotifyAuthenticated(data.status)
                console.log(data.status);
                if (!data.status) {
                    fetch('/spotify/get-auth-url')
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        })
                }
            })
    }

    const getCurrentSong = async () => {
        await fetch('/spotify/current-song')
            .then((response) => {
                if (!response.ok) {
                    return {};
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                setSong(data)
                console.log(data);
            })
    }


    const leaveButtonPressed = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch('/api/leave-room', requestOptions)
            .then((response) => {
                if (response.ok) {
                    leaveRoomCallback();
                    history.push('/');
                }
            });
        clearInterval(intervalId.current);
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
                        updateCallback={getRoomDetails}
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
    if (showSettings) {
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
                <MusicPlayer song={song} />
            </Grid>
            {isHost ? (renderSettingButton()) : ("")}
            <Grid item xs={12} align='center' >
                <Button color='secondary' variant='contained' onClick={leaveButtonPressed} >Leave Room</Button>
            </Grid>
        </Grid>
    )
}

export default Room
