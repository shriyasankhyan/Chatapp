import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import ChatBox from "../components/Chats/ChatBox";
import SideDrawer from "../components/Miscellaneous/SideDrawer";
import MyChats from "../components/Chats/MyChats";

const Chatpage = () => {
    const { user } = ChatState();

    return (
        <div style={{ width: "100%", color: "black" }}>
            {user && <SideDrawer />}
            <Box
                display="flex"
                justifyContent="space-between"
                w="100%"
                h="91.5vh"
                p="10px"
            >
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>
        </div>
    );
};

export default Chatpage;