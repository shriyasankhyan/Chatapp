import React from 'react';
import { Container, Box, Text, Tabs, TabPanel, TabPanels, Tab, TabList } from '@chakra-ui/react';
import Signup from "../components/Authentication/Signup";
import Login from "../components/Authentication/Login";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Homepage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userModel"));
        if (user) { navigate("/chats"); }
    }, [navigate]);

    return (
        <Container maxW='xl' centerContent>
            <Box
                color="white"
                bg="green"
                textAlign="center"
                d='flex'
                justifyContent="center"
                p={3}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="5vh"
                borderWidth="1px"
                borderColor="white"
            >
                <Text fontSize='2xl' fontFamily="McLaren">Chit-Chat</Text>
            </Box>
            <Box
                bg="white"
                color="black"
                w="100%"
                p={4}
                borderRadius="1g"
                borderWidth="1px"

            >
                <Tabs isFitted variant='soft-rounded' colorScheme='green'>
                    <TabList mb="1em">
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Signup</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Homepage;