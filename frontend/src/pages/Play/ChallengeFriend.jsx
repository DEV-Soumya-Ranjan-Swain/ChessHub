import { Avatar, Button, Card, Flex, Image, Select, Text, TextInput, Title } from '@mantine/core'
import React from 'react'
import FriendsList from '../../components/FriendsList'
import { IconSearch } from '@tabler/icons-react'
import { Form, Link, redirect, useParams, useSearchParams } from 'react-router-dom'
import { getAuthToken, getUserData } from '../../../utils/auth'

const ChallengeFriend = () => {
    const params = useParams();
    let friend_username = params["friend_username"];

    return (
        <Card
            sx={{
                width: '450px',
                height: '600px',
                textAlign: 'center'
            }}
        >
            <Form action={`/play/friend/${friend_username}`} method='POST'>
                <Flex align="center" direction="column" justify="center" gap="xs" my="lg">
                    <Title order={2}>Play vs {friend_username}</Title>
                    <Avatar mt="lg" color='lime' size="100px">{friend_username[0].toUpperCase()}</Avatar>
                    <Text>{friend_username}</Text>
                </Flex>
                <Select label="Time limit" placeholder='Time limit' name='time_limit' defaultValue='10' data={['5', '10', '15', '30']} />
                <Select defaultValue='w' my="20px" color='lime' name='color' label={<Text mx="auto" order={3}>I play as</Text>} placeholder='choose your color' data={[
                    { value: 'w', label: 'White' },
                    { value: 'b', label: 'Black' },
                    { value: 'RANDOM', label: 'Random' }
                ]} />
                <Button color='lime' type='submit' >Challenge</Button>
            </Form>
        </Card>
    )
}


// TESTED
export const playFriendAction = async ({ request, params }) => {
    const formData = await request.formData();
    let color = formData.get('color');
    let timeLimit = formData.get('time_limit');
    let username = getUserData().username;
    let challenged = params.friend_username;
    console.log(color, timeLimit, username, challenged);

    let roomIDURL = `${import.meta.env.VITE_BACKEND_HOST}/api/room/create`;
    let reqBody = { challenger: username, challenged }

    try {
        console.log(reqBody);
        const response = await fetch(roomIDURL, {
            method: 'POST', body: JSON.stringify(reqBody), headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });

        const resJSON = await response.json();
        const { roomID } = resJSON;
        console.log('Room ID:', roomID);

        localStorage.setItem('roomID', roomID)
        localStorage.setItem('my_color', color);
        localStorage.setItem('timeLimit', timeLimit);
        localStorage.setItem('opponent', challenged);

        return redirect(`/game/friend/${roomID}`);
    } catch (err) {
        console.log(err)
        return err;
    }
}

export default ChallengeFriend;