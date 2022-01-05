import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Room = () => {
    const { roomCode } = useParams();
    const [votesToSkip, setVotesToSkip] = useState(2)
    const [guestCanPause, setGuestCanPause] = useState(false)
    const [isHost, setIsHost] = useState(false)

    const getRoomDetails = async () => {
        await fetch(`/api/get-room?code=${roomCode}`)
            .then((response) => response.json())
            .then((data) => {
                setGuestCanPause(data.guest_can_pause),
                setVotesToSkip(data.votes_to_skip),
                setIsHost(data.is_host)
            })
    }
    useEffect(() => {
        getRoomDetails()
    }, [])

    return (
        <div>

            <p>roomCode:{roomCode}</p>
            <p>votesToSkip: {votesToSkip}</p>
            <p>guestCanPause: {guestCanPause.toString()}</p>
            <p>isHost: {isHost.toString()}</p>
        </div>
    )
}

export default Room
