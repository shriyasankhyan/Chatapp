import React from 'react';
import { Box } from "@chakra-ui/react"
import { CloseIcon } from '@chakra-ui/icons';

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            px={2}
            py={1}
            borderRadius="1g"
            m={1}
            mb={2}
            variant="solid"
            backgroundColor="purple"
            color="white"
            fontSize={12}
            cursor="pointer"
            onClick={handleFunction}
        >
            {user.name}
            <CloseIcon
                pl={1}
            />
        </Box>
    )
}

export default UserBadgeItem