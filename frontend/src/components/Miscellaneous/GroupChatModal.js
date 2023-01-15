import {
    useDisclosure, Button, Modal, ModalOverlay, ModalFooter
    , ModalContent, ModalHeader, ModalCloseButton, ModalBody,
    useToast, FormControl, Input, Spinner, Box
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserListItem from "../UserAvatar/UserListItem"
import axios from 'axios';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import baseURL from '../../baseURL';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

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
            };

            const { data } = await axios.get(baseURL + `api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error occured !",
                description: "Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    };
    const handleSubmit = async () => {
        console.log(groupChatName);
        console.log(selectedUsers);
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,

                },
            }
            const { data } = await axios.post(baseURL + 'api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(u =>
                    u._id))
            }, config);
            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New group chat created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        } catch (error) {
            toast({
                title: "Failed to create the chat",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        }
    };
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    }

    const handleDelete = (userToDelete) => {
        setSelectedUsers(
            selectedUsers.filter(sel => sel._id !== userToDelete._id)
        )
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                    >
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                onChange={e =>
                                    setGroupChatName(e.target.value)
                                }
                            />
                        </FormControl>

                        <FormControl>
                            <Input
                                placeholder='Add users eg: Shriya, Ingit, etc.'
                                mb={1}
                                onChange={e =>
                                    handleSearch(e.target.value)
                                }
                            />
                            <Box
                                w="100%"
                                display="flex"
                                flexWrap="wrap"
                            >
                                {/* Render Selected users */}
                                {selectedUsers?.map(user => (
                                    <UserBadgeItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => {
                                            handleDelete(user);
                                        }}
                                    />
                                ))}
                            </Box>


                            {/* Render Searched users */}
                            {loading ? <Spinner /> : (searchResult?.slice(0, 4).map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => {
                                        handleGroup(user);
                                    }}
                                />
                            )))}
                        </FormControl>


                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='green' onClick={handleSubmit}>
                            Create Chat
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal