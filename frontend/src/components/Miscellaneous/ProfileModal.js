import { ViewIcon } from '@chakra-ui/icons';
import {
    useDisclosure, IconButton, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, Image, Text
} from '@chakra-ui/react';
import React from 'react';

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (<div>
        {children ?
            (<span onClick={onOpen}>{children}</span>)
            : (
                <IconButton
                    display={{ base: "flex" }}
                    icon={<ViewIcon />}
                    onClick={onOpen}
                >
                </IconButton>
            )}
        <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent h="410px">
                <ModalHeader
                    fontSize="40px"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent="center"
                >{user.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    display="flex"
                    flexDir="column"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Image
                        borderRadius="full"
                        boxSize="150px"
                        src={user.picture}
                        alt={user.name}
                    />
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        fontFamily="Work sans"
                    >
                        {user.email}
                    </Text>

                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>

                </ModalFooter>
            </ModalContent>
        </Modal>
    </div>
    )
}

export default ProfileModal;