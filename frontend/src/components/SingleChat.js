import React, { useState, useEffect } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, FormControl, IconButton, Spinner, Text, Input, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics"
import ProfileModal from "./Miscellaneous/ProfileModal"
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import "./styles.css";
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import Lottie from "lottie-react";
import animationData from "../animations/typing.json"
import baseURL from '../baseURL';

const ENDPOINT = 'https://chit-chat-shriya-sankhyan.onrender.com';
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const toast = useToast();
    const [isTyping, setIsTyping] = useState(false);
    const [typing, setTyping] = useState(false);
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        },
    };

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => { setSocketConnected(true); });
        socket.on('typing', () =>
            setIsTyping(true)
        );
        socket.on('stop typing', () =>
            setIsTyping(false)
        );
    }, [])

    // Receiving the message
    useEffect(() => {
        socket.on('message received', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                // Give notification
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                // Add message into the opened list.
                setMessages([...messages, newMessageRecieved]);
            }
        })
    })

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);
            const { data } = await axios.get(baseURL + `api/message/${selectedChat._id}`, config);

            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast({
                title: "Error occurred!",
                description: "Failed to load the messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    };

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);


    // If key is pressed and message is typed, send message.
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                // We need to empty message as soon as possible.
                // But it takes time too.
                // So newMessage will still be pointing to the old message.


                const { data } = await axios.post(baseURL + 'api/message', {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);
                setNewMessage("");
                socket.emit('new message', data);
                setMessages([...messages, data]);

            } catch (error) {
                toast({
                    title: "Error occured!",
                    description: "Failed to send the message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                });
            }
        }
    }



    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // Typing Indicator Logic

        if (!socketConnected) return;
        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
            }
            setTyping(false);
        }, timerLength);

    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>{getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)}>

                                </ProfileModal></>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="10px"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className='messages'>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                        {/* Messages  */}
                        <FormControl
                            onKeyDown={sendMessage}
                            isRequired
                            mt={3}
                        >
                            {isTyping ? <div>
                                <Lottie
                                    options={defaultOptions}
                                    width={70}
                                    style={{ marginBottom: 15, marginLeft: 0, justifyContent: 'center' }}
                                >
                                    <b>. . . . .</b>
                                </Lottie>

                            </div> : <></>}
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a message.."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    h="100%"
                >
                    <Text
                        fontSize="3xl"
                        pb={3}
                        fontFamily="Work sans"
                    >
                        Click on a user to start chatting
                    </Text>

                </Box>
            )
            }
        </>
    )
}

export default SingleChat;