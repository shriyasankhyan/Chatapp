import React, { useState } from 'react';
import {
    useDisclosure, Button, Modal, ModalOverlay, ModalFooter
    , ModalContent, ModalHeader, ModalCloseButton, ModalBody,
    IconButton, Box, FormControl, Input,
    useToast,
    Spinner
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import baseURL from "../../baseURL";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can remove someone from the group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
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

            const { data } = await axios.put(baseURL + 'api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: user1._id
            }, config);

            // If user has removed himself or left the group, set selected chat as empty and fetch the chats again.
            user1.id === user.id ? setSelectedChat() : setSelectedChat(data);
            setLoading(false);
            setFetchAgain(!fetchAgain);
            fetchMessages();
        } catch (error) {
            toast({
                title: "Error occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }

    const handleRename = async () => {
        if (!groupChatName) {
            return;
        }

        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(baseURL + "/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);

            setSelectedChat(data);
            setRenameLoading(false);
            setFetchAgain(!fetchAgain);

        } catch (error) {
            toast({
                title: "Error occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }

        setGroupChatName("");
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.get(baseURL + `api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error occured!",
                description: "Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
            setLoading(false);
        }

    }

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find(u =>
            u._id === user1._id
        )) {
            toast({
                title: "User already exists in the group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
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

            const { data } = await axios.put(baseURL + 'api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: user1._id
            }, config);

            setSelectedChat(data);
            setLoading(false);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast({
                title: "Error occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    const { selectedChat, setSelectedChat, user } = ChatState();

    return (
        <>
            <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            w="100%"
                            display="flex"
                            flexWrap="wrap"
                            pb={3}
                        >
                            {selectedChat.users.map(user => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => {
                                        handleRemove(user);
                                    }}
                                />
                            ))}
                        </Box>

                        <FormControl
                            display="flex"
                        >
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={e => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                backgroundColor="teal"
                                color="white"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}

                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add user to the group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner
                                size="lg"
                            />
                        ) : (
                            searchResult?.map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() =>
                            handleRemove(user)
                        }
                            colorScheme="red"
                        >
                            Leave group
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal;