import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box } from "@chakra-ui/react";
import { } from "@chakra-ui/react";
import SingleChat from "../components/SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();
    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="white"
            w={{ base: "100%", md: "68%" }}
            borderRadius="5px"
            borderWidth="1px"
        >
            <SingleChat />
        </Box>
    )
}

export default ChatBox