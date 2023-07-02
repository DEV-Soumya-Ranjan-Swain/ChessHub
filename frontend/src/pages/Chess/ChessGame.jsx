import { Avatar, Button, Flex, Image, Loader, NavLink, Text, Title } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import ChessBoard from '../Play/ChessBoard'
import { useNavigate, useParams } from 'react-router-dom'
import { socket } from '../../socket'
import { getUserData } from '../../../utils/auth'

const ChessGame = () => {
    const user = getUserData();
    let username = user.username;
    const [hasJoinedRoom, setHasJoinedRoom] = useState(localStorage.getItem('socketid'));
    const [isWaiting, setIsWaiting] = useState(true);
    const roomID = useParams()['roomID'];
    const navigate = useNavigate();

    const exitGame = () => {
        localStorage.removeItem('socketid');
        localStorage.removeItem('roomID');
        localStorage.removeItem('opponent');
        localStorage.removeItem('my_color');
        localStorage.removeItem('time_limit');
        socket.disconnect();
        navigate('/play/friend');
    }

    useEffect(() => {
        if (hasJoinedRoom) {
        } else {
            console.log('Connecting');
            socket.connect();
            socket.on('connect', () => {
                localStorage.setItem('socketid', socket.id);
                console.log('Connected');
            });
            socket.emit('join-room', roomID, username, localStorage.getItem('opponent'), { color: localStorage.getItem('my_color'), timeLimit: localStorage.getItem('time_limit') });
            socket.on('joined-room', () => {
                setHasJoinedRoom(true);
            });
            socket.on('room-created', () => {
                console.log('Room is created')
                setIsWaiting(false);
            });
        }
    }, []);

    if (!hasJoinedRoom) return (
        <Loader variant='bars' />
    )

    return (
        <Flex gap="xl" justify='center' align='center' wrap='nowrap' direction='row'>
            <Flex gap="xs" justify='center' align='start' wrap='nowrap' direction='column' >
                <NavLink
                    p="2px"
                    label={"username"}
                    icon={<Avatar radius="3px" />}
                    description={"description"}
                />
                <ChessBoard color={localStorage.getItem('my_color')} />
                <NavLink
                    p="2px"
                    label={username}
                    icon={<Avatar radius="3px" />}
                    description={"description"}
                />
            </Flex>
            <Flex w="450px" bg='gray' p="10px" justify='start' align='center' direction='column' h="600px" sx={{ borderRadius: '10px' }}>
                <Title>Game Data</Title>
                <Flex>
                    <Button onClick={exitGame} color='red'>Exit Game</Button>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default ChessGame