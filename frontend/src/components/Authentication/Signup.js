import React from 'react'
import { FormControl,Button, FormLabel, VStack, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { useState } from 'react';
const Signup = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const handleClick = () => setShow(!show);

    const postDetails = (pics) => {
        
    };

    const submitHandler = () => {
        
    };

  return (
    <VStack spacing="5px">
        <FormControl isRequired id='first-name' >
            <FormLabel >
                  Name
            </FormLabel>
                  <Input
                      placeholder='Enter your name'
                      onChange={(e) => setName(e.target.value)}
                  />
        </FormControl>
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
                <FormControl isRequired id="confirm-password">
              <FormLabel>
                  Confirm Password
              </FormLabel>
              <InputGroup>
                  <Input
                      type={show ? "text" :"password"}
                  placeholder='Confirm your password'
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? "Hide" : "Show"}
                      </Button>
                  </InputRightElement>
              </InputGroup>
              
          </FormControl>
    
                <FormControl isRequired id="pic">
              <FormLabel>
                  Upload your picture
              </FormLabel>
              <Input
                  type="file"
                  p={1.5}
                  accept="image/*"
                  onChange={(e) => postDetails(e.target.files[0])}
                     />
          </FormControl>
          <Button
              color="#FFFDE7"
              background="#5F370E"
              width="100%"
              border="#5F370E solid 1px"
              style={{ marginTop: 15 }}
              onClick = {submitHandler}
          >
              Sign up
          </Button>
    </VStack>
  )
}

export default Signup