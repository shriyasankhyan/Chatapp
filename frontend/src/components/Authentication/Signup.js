import { FormControl, Button, FormLabel, VStack, Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import baseURL from '../../baseURL';


const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [picture, setPicture] = useState("");
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    function postDetails(pic) {
        setLoading(true);
        if (pic === undefined) {
            toast({
                title: "Please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            console.log("I am in undefined");
            setLoading(false);
            return;
        }
        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "Chit-Chat");
            data.append("cloud_name", "dhh0y6yml");
            fetch("https://api.cloudinary.com/v1_1/dhh0y6yml/image/upload", {
                method: "post",
                body: data
            }).then((res) => res.json())
                .then((data) => {
                    setPicture(data.url.toString());
                    setLoading(false);
                }).catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            toast({
                title: "Please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
    };

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: "Please fill all the details.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(baseURL + "/api/user",
                { name, email, password, picture },
                config
            );

            toast({
                title: "Registation successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });

            localStorage.setItem("userModel", JSON.stringify(data));
            setLoading(false);
            navigate('./chats');
        } catch (error) {
            toast({
                title: "Error occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    }

    return (
        <VStack spacing="10px">
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter your name'
                    onChange={(event) => {
                        setName(event.target.value);
                    }}
                />

            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter your email'
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />

            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        placeholder='Enter your password'
                        type={show ? 'text' : 'password'}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <InputRightElement width="4.5rem">
                        <Button onClick={() => {
                            setShow(!show);
                        }} h="1.75rem" size="sm">
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>


            </FormControl>
            <FormControl id='confirm-password' isRequired>
                <FormLabel>Confirm password</FormLabel>
                <InputGroup>
                    <Input
                        placeholder='Confirm your password'
                        type={show2 ? 'text' : 'password'}
                        onChange={(event) => {
                            setConfirmPassword(event.target.value);
                        }}
                    />
                    <InputRightElement width="4.5rem">
                        <Button onClick={() => {
                            setShow2(!show2);
                        }} h="1.75rem" size="sm">
                            {show2 ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>


            </FormControl>
            <FormControl id='picture'>
                <FormLabel>Upload Profile Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(event) => postDetails(event.target.files[0])}
                />

            </FormControl>
            <Button
                colorScheme="green"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign up
            </Button>
        </VStack>
    )
}

export default Signup