import React from 'react'
import { FormControl,Button, FormLabel, VStack, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { useState } from 'react';

const Login = () => {
     const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const handleClick = () => setShow(!show);

    const postDetails = (pics) => {
        
    };

    const submitHandler = () => {
        
    };
      
  return (
    <VStack spacing="5px">
    
        <FormControl isRequired id='email' >
                <FormLabel >  
                      Email
                </FormLabel>
                  <Input
                      placeholder='Enter your email'
                      onChange={(e) => setEmail(e.target.value)}
                      />  
        </FormControl>
          <FormControl isRequired id="password">
              <FormLabel>
                  Password
              </FormLabel>
              <InputGroup>
                  <Input
                      type={show ? "text" :"password"}
                  placeholder='Enter your password'
                  onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? "Hide" : "Show"}
                      </Button>
                  </InputRightElement>
              </InputGroup>
              </FormControl>
          <Button
              color="#FFFDE7"
              background="#5F370E"
              width="100%"
              border="#5F370E solid 1px"
              style={{ marginTop: 15 }}
              onClick = {submitHandler}
          >
              Log in
          </Button>
          <Button
              variant="solid"
              background="FFFDE7"
              color="#5F370E"
              width="100%"
              border="#5F370E solid 1px"
               onClick = {() => {
                  setEmail("guest@example.com");
                  setPassword("123456");
              }}
          >
              Get Guest user credentials
          </Button>
    </VStack>
  )
}

export default Login