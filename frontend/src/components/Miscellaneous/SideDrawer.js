import {
    Box, Tooltip, Button, Text, Menu, MenuButton,
    MenuList, MenuItem, Avatar, MenuDivider, Drawer, useDisclosure,
    DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input,
    useToast, Spinner
} from '@chakra-ui/react';
import { getSender } from '../../config/ChatLogics';
import UserListItem from "../UserAvatar/UserListItem"
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import ChatLoading from "../Chats/ChatLoading"
import axios from "axios";
import Badge from 'react-badger';

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const toast = useToast();

    const logoutHandler = () => {
        localStorage.removeItem("userModel");
        navigate("/");
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please enter something in the search bar",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error occured!",
                description: "Failed to load the search results",
                status: "error",
                duration: "5000",
                isClosable: true,
                position: "bottom-left",
            })
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
            };

            const data = await axios.post('/api/chat', { userId }, config);

            if (!chats.find(c => c._id === data._id)) {
                setChats([data, ...chats]);
            }

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
            setLoadingChat(false);
        }
    };

    return (
        <>


            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search users to chat"
                    hasArrow
                    placement='bottom-end'>
                    <Button variant="ghost" onClick={onOpen}>
                        <i className='fas fa-search' />
                        <Text d={{ base: "none", md: "flex" }} px="4">Search user</Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work sans">
                    Chit-Chat
                </Text>
                <div>
                    <Menu>

                        <MenuButton p={1} style={{ position: 'relative' }} >
                            <BellIcon fontSize="2xl" m="1" />
                            {notification.length ? (< Badge anchor='topLeft' color='red' visible ><b>{notification.length}</b> </Badge>) : (<></>)}
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No new messages"}
                            {notification.map(not => (
                                <MenuItem key={not._id} onClick={() => {
                                    setSelectedChat(not.chat);
                                    setNotification((notification.filter(n => n !== not)));
                                }}>
                                    {not.chat.isGroupChat ? `New message in ${not.chat.chatName}` : `New Message from ${getSender(user, not.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.picture}>
                            </Avatar>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider></MenuDivider>
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerHeader
                            borderBottomWidth="1px"
                        >
                            Search users
                        </DrawerHeader>
                        <DrawerBody>
                            <Box
                                display="flex"
                                pb={2}
                            >
                                <Input
                                    placeholder='Search by name or email'
                                    mr={2}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Button onClick={handleSearch}>Go</Button>
                            </Box>
                            {loading ? (
                                <ChatLoading />
                            ) : (

                                searchResult?.map(user => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() =>
                                            accessChat(user._id)
                                        }
                                    />
                                ))
                            )}
                            {loadingChat && <Spinner ml="auto" display="flex" />}

                        </DrawerBody>
                    </DrawerContent>

                </DrawerOverlay>
            </Drawer>
        </>
    )
};

export default SideDrawer;