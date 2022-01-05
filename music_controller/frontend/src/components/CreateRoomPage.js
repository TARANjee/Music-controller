import React, { useState } from 'react'
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'

const CreateRoomPage = () => {
    const defaultvotes = 2;
    const history = useHistory();
    const [guestCanPause, setGuestCanPause] = useState(true);
    const [votesToSkip, setVotesToSkip] = useState(defaultvotes);

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

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align='center' >
                <Typography component='h4' variant='h4'>
                    Create A Room
                </Typography>
            </Grid>

            {/* Control Playback RadioButton */}

            <Grid item xs={12} align='center' >
                <FormControl component='fieldset'>
                    <FormHelperText component="div">
                        <div align='center'>Guest Control of Playback State</div>
                    </FormHelperText>

                    <RadioGroup row defaultValue='true' onChange={(e) => setVotesToSkip(e.target.value)}>
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
                        defaultValue={defaultvotes}
                        inputProps={{
                            min: 1,
                            style: { textAlign: 'center' },
                        }}
                        onChange={(e) => setGuestCanPause(e.target.value === 'true' ? true : false)}
                    >
                    </TextField>
                    <FormHelperText component="div">
                        <div align='center'>Votes Required to Skip Song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>

            {/* Buttons */}

            <Grid item xs={12} align='center' >
                <Button color='primary' variant='contained' onClick={handleRoomButtonPressed}>Create A Room</Button>
            </Grid>
            <Grid item xs={12} align='center' >
                <Button color='secondary' variant='contained' to='/' component={Link} >Back</Button>
            </Grid>
        </Grid>
    )
}

export default CreateRoomPage
