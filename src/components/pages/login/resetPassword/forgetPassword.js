import React, { useEffect, useState } from 'react';
import {
    Button,
    FormControl,
    Flex,
    Heading,
    Input,
    Stack,
    Text,
    useColorModeValue,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';
import { id } from '../../../../store/reducers/user.reducer';
import axios from 'axios';
import Cookies from 'react-cookies';
import CryptoJS from 'crypto-js'
import { useDispatch } from 'react-redux';
export default function ForgotPassword() {
    const dispatch = useDispatch()
    const [alert, setAlert] = useState(false);
    const [faild, setFaild] = useState(false);
    const [email, setEmail] = useState('');
    const [id, setId] = useState()
    const URL = process.env.REACT_APP_URL;

    const submitHandler = async (e) => {
        try {
            e.preventDefault();
            const obj = {
                email: e.target.email.value,
            };
            const data = await axios.post(`${URL}/forgetPassword`, obj);
            if (data.status === 200) {
                setAlert(true);
                const numberToEncrypt = data.data.id;
                const secretKey = 'pixel';
                const encryptedNumber = CryptoJS.AES.encrypt(
                    numberToEncrypt.toString(),
                    secretKey
                ).toString();
                Cookies.save('#%5$', encryptedNumber)
            }
        } catch (e) {
            setFaild(true);
            setEmail('');
        }
    };
    return (
        <>
            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}
            >
                <Stack
                    spacing={4}
                    w={'full'}
                    maxW={'md'}
                    bg={useColorModeValue('white', 'gray.700')}
                    rounded={'xl'}
                    boxShadow={'lg'}
                    p={6}
                    my={12}
                >
                    {!alert && (
                        <form onSubmit={submitHandler}>
                            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                                Forgot your password?
                            </Heading>
                            <Text fontSize={{ base: 'sm', sm: 'md' }}>
                                You&apos;ll get an email with a reset link
                            </Text>
                            <FormControl id="email">
                                <Input
                                    name="email"
                                    placeholder="your-email@example.com"
                                    _placeholder={{ color: 'gray.500' }}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>
                            <br />
                            <Stack spacing={6}>
                                <Button
                                    type="submit"
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}
                                >
                                    Request Reset
                                </Button>
                            </Stack>
                        </form>
                    )}
                    {alert && (
                        <Alert
                            status="success"
                            variant="subtle"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            textAlign="center"
                            height="200px"
                        >
                            <AlertIcon boxSize="40px" mr={0} />
                            <AlertTitle mt={4} mb={1} fontSize="lg">
                                We sent a reset link to this Email
                            </AlertTitle>
                            <AlertDescription maxWidth="sm">
                                Please open the link to reset your password
                            </AlertDescription>
                        </Alert>
                    )}
                    {faild && (
                        <Alert status="error">
                            <AlertIcon />
                            <AlertTitle>Email Not Found</AlertTitle>
                            <AlertDescription>Please Enter A Valid Email</AlertDescription>
                        </Alert>
                    )}
                </Stack>
            </Flex>
        </>
    );
}