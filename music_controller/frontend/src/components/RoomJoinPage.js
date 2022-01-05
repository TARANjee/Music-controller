import React, { useState } from 'react'
import { TextField, Button, Grid, Typography } from '@material-ui/core'
import { Link,useHistory } from 'react-router-dom'

const RoomJoinPage = () => {
    const history = useHistory();
    const [roomCode, setRoomCode] = useState("")
    const [error, setError] = useState("")

    const roomButtonPressed = async () => {
        const requestOption = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code : roomCode
            })
        };
        await fetch('/api/join-room', requestOption)
            .then((response) => {
                if (response.ok) {
                    history.push(`/room/${roomCode}`)
                }
                else{
                    setError('Room not Found')
                }
            })
            .catch((error)=>{
                console.log(error);
            })
    }

    return (
        <Grid container spacing={1} >

            <Grid item xs={12} align='center'>
                <Typography component='h4' variant='h4'>
                    Join A Room
                </Typography>
            </Grid>

            {/* TextField for enter the code */}

            <Grid item xs={12} align='center'>
                <TextField
                    error={error}
                    label='code'
                    placeholder='Enter a Room Code'
                    value={roomCode}
                    helperText={error}
                    variant='outlined'
                    onChange={(e) => setRoomCode(e.target.value)}
                />
            </Grid>

            {/* Buttons */}

            <Grid item xs={12} align='center' >
                <Button color='primary' variant='contained' onClick={roomButtonPressed}>Enter Room</Button>
            </Grid>
            <Grid item xs={12} align='center' >
                <Button color='secondary' variant='contained' to='/' component={Link} >Back</Button>
            </Grid>

        </Grid>
    )
}

export default RoomJoinPage
