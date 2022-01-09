import React, { useState } from 'react'
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, Collapse } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'
import { Alert } from '@material-ui/lab'

const CreateRoomPage = (props) => {
    const defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => { }
    }


    const history = useHistory();
    const [errorMsg, setErrorMsg] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [guestCanPause, setGuestCanPause] = useState(defaultProps.guestCanPause);
    const [votesToSkip, setVotesToSkip] = useState(defaultProps.votesToSkip);

    const handleRoomButtonPressed = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                guest_can_pause: guestCanPause,
                votes_to_skip: votesToSkip
            }),
        };
        await fetch('/api/create-room', requestOptions)
            .then((response) => response.json())
            .then((data) => history.push(`/room/${data.code}`))
    }
    const handleUpdateButtonPressed = async () => {
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                guest_can_pause: guestCanPause,
                votes_to_skip: votesToSkip,
                code: props.roomCode
            }),
        };
        await fetch('/api/update-room', requestOptions)
            .then((response) => {
                if (response.ok) {
                    setSuccessMsg("Room updated successfully!")
                }
                else {
                    setErrorMsg("Error updating room...")
                }
                props.updateCallback();
            })

    }
    const renderCreateButtons = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align='center' >
                    <Button color='primary' variant='contained' onClick={handleRoomButtonPressed}>Create A Room</Button>
                </Grid>
                <Grid item xs={12} align='center' >
                    <Button color='secondary' variant='contained' to='/' component={Link} >Back</Button>
                </Grid>
            </Grid>
        )
    }
    const renderUpdateButtons = () => {
        return (
            <Grid item xs={12} align='center' >
                <Button color='primary' variant='contained' onClick={handleUpdateButtonPressed} >Update Room</Button>
            </Grid>
        )
    }
    const title = props.update ? "Update Room" : "Create a Room";

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align='center' >
                <Collapse in={errorMsg != '' || successMsg != ''}>
                    {successMsg != '' ? (
                        <Alert severity="success" onClose={()=>setSuccessMsg("")}>{successMsg}</Alert>
                    ) : (
                        <Alert severity="error" onClose={()=>setErrorMsg("")}>{errorMsg}</Alert>
                    )}
                </Collapse>
            </Grid>
            <Grid item xs={12} align='center' >
                <Typography component='h4' variant='h4'>
                    {title}
                </Typography>
            </Grid>

            {/* Control Playback RadioButton */}

            <Grid item xs={12} align='center' >
                <FormControl component='fieldset'>
                    <FormHelperText component="div">
                        <div align='center'>Guest Control of Playback State</div>
                    </FormHelperText>

                    <RadioGroup row defaultValue={props.update ? props.guestCanPause.toString() : defaultProps.guestCanPause.toString()} onChange={(e) => setGuestCanPause(e.target.value === 'true' ? true : false)}
                    >
                        <FormControlLabel
                            value='true'
                            control={<Radio color='primary' />}
                            label='play/pause'
                            labelPlacement='bottom'
                        />
                        <FormControlLabel
                            value='false'
                            control={<Radio color='secondary' />}
                            label='No control'
                            labelPlacement='bottom'
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>

            {/* Votes to Skip */}

            <Grid item xs={12} align='center' >
                <FormControl>
                    <TextField
                        required={true}
                        type='number'
                        defaultValue={props.update ? props.votesToSkip.toString() : defaultProps.votesToSkip.toString()}
                        inputProps={{
                            min: 1,
                            style: { textAlign: 'center' },
                        }}
                        onChange={(e) => setVotesToSkip(e.target.value)}
                    >
                    </TextField>
                    <FormHelperText component="div">
                        <div align='center'>Votes Required to Skip Song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>

            {/* Buttons */}

            {props.update ? (renderUpdateButtons()) : (renderCreateButtons())}

        </Grid>
    )
}

export default CreateRoomPage
