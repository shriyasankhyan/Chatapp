import React, { useEffect, useRef } from 'react'
import { Avatar, Tooltip } from '@chakra-ui/react';
import { isLastMessage, isSameSender, isSameSenderMargin } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom()
    }, [messages]);


    return (
        <div>
            {messages && messages.map((m, i) => (
                <div
                    style={{ display: "flex" }}
                    key={m._id}
                >

                    {(isSameSender(messages, m, i, user._id)
                        || isLastMessage(messages, i, user._id)
                        || isLastMessage(messages, i, user._id)
                    ) && (
                            <Tooltip
                                label={m.sender.name}
                                placement="bottom-start"
                                hasArrow
                            >
                                <Avatar
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.picture}
                                />
                            </Tooltip>
                        )}
                    <span
                        style={{
                            backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(messages, m, i, user._id),
                            marginTop: isSameSender(messages, m, i, user._id) ? 3 : 10
                        }}
                    >
                        {m.content}
                        <div ref={messagesEndRef} />
                    </span>
                    <div ref={messagesEndRef} />
                </div>
            ))
            }
        </div >
    )
}

export default ScrollableChat;