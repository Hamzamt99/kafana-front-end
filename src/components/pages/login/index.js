import {
    ColorModeProvider,
    CSSReset,
    Box,
    Flex,
    Heading,
    Text,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Checkbox,
    Button,
    AlertIcon,
    Alert,
    InputRightElement,
    InputGroup
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { signin } from '../../../store/reducers/user.reducer';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const Signin = () => {

    return (
        <ColorModeProvider>
            <CSSReset />
            <LoginArea />
        </ColorModeProvider>
    );
};

const LoginArea = () => {
    return (
        <Flex minHeight='85vh' width='full' align='center' justifyContent='center' >
            <Box
                borderWidth={1}
                px={4}
                width='full'
                maxWidth='500px'
                borderRadius={4}
                textAlign='center'
                boxShadow='xl'
                background='white'
                paddingTop='15px'

            >
                <Box p={4}>
                    <LoginHeader />
                    <LoginForm />
                </Box>
            </Box>
        </Flex>
    );
};

const LoginHeader = () => {
    return (
        <Box textAlign='center'>
            <Heading className='logo-login' padding='10px'>
                Login
            </Heading>
            <Text color="fg.muted" fontSize='17px'>
                Don't have an account? <Link to="/">Sign up</Link>
            </Text>
        </Box>
    );
};

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isChecked, setCheck] = useState(false);
    const [data, setData] = useState();
    const [isOpen, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const url = process.env.REACT_APP_URL;

    const handleCheckboxChange = () => {
        setCheck(!isChecked);
    };

    const submitHandler = async (e) => {
        try {
            e.preventDefault();
            const obj = {
                email: e.target.email.value,
                password: e.target.password.value
            }
            const data = await axios.post(`${url}login`, null, {
                headers: {
                    Authorization: `Basic ${btoa(`${obj.email}:${obj.password}`)}`
                }
            });

            dispatch(signin(data.data));
            if (data.status === 200) {
                if (isChecked) {
                    const dataToEncrypt = JSON.stringify(obj);
                    const secretKey = process.env.SECRETKEY || 'kafana';
                    const encryptedData = CryptoJS.AES.encrypt(dataToEncrypt, secretKey).toString();
                    localStorage.setItem('Remember_Me', encryptedData);
                }
                navigate('/')

            }
        } catch (e) {
            setError(e.response.data);
            setOpen(true);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem('Remember_Me');
        if (userData) {
            const decodedData = CryptoJS.AES.decrypt(userData, 'kafana').toString(CryptoJS.enc.Utf8);
            if (decodedData) {
                const parsed = JSON.parse(decodedData);
                setData(parsed);
            }
        }
    }, []);

    return (
        <Box my={8} textAlign='left' >
            <form onSubmit={submitHandler}>
                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type='text'
                        placeholder='Enter your Email'
                        name='email'
                        defaultValue={data ? data.email : ''}
                    />
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input type={showPassword ? 'text' : 'password'} defaultValue={data ? data.password : ''} />
                        <InputRightElement h={'full'}>
                            <Button
                                variant={'ghost'}
                                onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Stack isInline justifyContent='space-between' mt={4}>
                    <Box>
                        <Checkbox isChecked={data ? !isChecked : isChecked} onChange={handleCheckboxChange}>Remember Me</Checkbox>
                    </Box>
                    <Box>
                        <Link color={'#3F72AF'} to='/forgetPassword'>Forgot your password?</Link>
                    </Box>
                </Stack>
                <br />
                <Stack>
                    {isOpen && (
                        <Alert status='error'>
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}
                </Stack>
                <Button width='full' mt={4} type='submit'>
                    Sign In
                </Button>
            </form>
        </Box>
    );
};

export default Signin;