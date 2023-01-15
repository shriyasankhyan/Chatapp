import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider"
import ChatBox from "../components/ChatBox";
import SideDrawer from "../components/Miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import { useState } from "react";

const Chatpage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

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
                {user &&
                    (<MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                    )}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    );
};

export default Chatpage;