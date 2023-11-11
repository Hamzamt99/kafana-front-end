import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
    useColorModeValue,
    Select,
    Stack,
    Text,
    useDisclosure,
    InputLeftAddon,
    Spinner
} from '@chakra-ui/react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const url = process.env.REACT_APP_URL;
    const submitHandler = async (e) => {
        try {
            e.preventDefault()
            const obj = {
                email: e.target.email.value,
                name: e.target.Name.value,
                password: e.target.password.value,
                Gender: e.target.options.value,
                birthday: e.target.bday.value,
                phone: e.target.phone.value,
                role: e.target.role.value
            }
            setLoading(true)
            localStorage.setItem('email', obj.email)
            const signUp = await axios.post(`${url}signup`, obj)
            if (signUp.status === 200) {
                setLoading(false)
                navigate('/signin')
            }
        } catch (e) {
            setLoading(false)
            console.log(e.response.data);
            setError(e.response.data);
            onOpen();
        }
    }
    return (
        <>
            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} width='100%'>
                    <form onSubmit={submitHandler}>
                        <Box
                            rounded={'lg'}
                            bg={useColorModeValue('white', 'gray.700')}
                            boxShadow={'lg'}
                            p={8}>
                            <Stack spacing={4}>
                                <Stack align={'center'}>
                                    <Heading fontSize={'4xl'} textAlign={'center'}>
                                        Sign up
                                    </Heading>
                                    {/* <Text fontSize={'lg'} color={'gray.600'}>
                                    to enjoy all of our cool features ✌️
                                </Text> */}
                                </Stack>
                                <Divider />
                                <HStack>
                                    <Box width='100%'>
                                        <FormControl id="Name" isRequired>
                                            <FormLabel>Name</FormLabel>
                                            <Input type="text" />
                                        </FormControl>
                                    </Box>
                                </HStack>
                                <FormControl id="email" isRequired>
                                    <FormLabel>Email address</FormLabel>
                                    <Input type="email" />
                                </FormControl>
                                <Stack direction="row">
                                    <FormControl id="options">
                                        <FormLabel htmlFor="select">Gender</FormLabel>
                                        <Select placeholder="Male / Female">
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </Select>
                                    </FormControl>
                                    <FormControl flex="1">
                                        <FormLabel htmlFor="bday">Birthday</FormLabel>
                                        <Input
                                            name="bday"
                                            placeholder="Select Date"
                                            size="md"
                                            type="date"
                                        />
                                    </FormControl>
                                </Stack>
                                <FormControl id="role">
                                    <FormLabel htmlFor="select">Role <p>(Just for the task)</p></FormLabel>
                                    <Select >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </Select>
                                </FormControl>
                                <FormControl id="phone">
                                    <FormLabel htmlFor="phone">phone number</FormLabel>
                                    <InputGroup >
                                        <InputLeftAddon children='+962' />
                                        <Input type='tel' />
                                    </InputGroup>
                                </FormControl>
                                <FormControl id="password" isRequired>
                                    <FormLabel>Password</FormLabel>
                                    <InputGroup>
                                        <Input type={showPassword ? 'text' : 'password'} />
                                        <InputRightElement h={'full'}>
                                            <Button
                                                variant={'ghost'}
                                                onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                                {/* <Stack direction='row'>
                                <Checkbox defaultChecked>I have read and agreed to the</Checkbox>
                                <Link variant="text" size="sm" style={{ textDecoration: 'underline lightblue', color: 'black' }} href='#'>
                                    Terms of use
                                </Link>
                                <Link variant="text" size="sm" style={{ textDecoration: 'underline lightblue', color: 'black' }} href='#'>
                                    Privacy notice
                                </Link>
                            </Stack> */}
                                <Stack spacing={10} pt={2}>
                                    {
                                        loading ? (
                                            <Button width='full' mt={4}>
                                                <Spinner />
                                            </Button>
                                        )
                                            :
                                            <Button
                                                type='submit'
                                                loadingText="Submitting"
                                                size="lg"
                                                bg={'blue.400'}
                                                color={'white'}
                                                _hover={{
                                                    bg: 'blue.500',
                                                }}>
                                                Sign up
                                            </Button>
                                    }

                                </Stack>
                                <Stack pt={6}>
                                    <Text align={'center'}>
                                        Already a user? <Link to='/signin' color={'blue.400'}>Login</Link>
                                    </Text>
                                </Stack>
                            </Stack>
                        </Box>
                    </form >
                    <AlertDialog
                        motionPreset="slideInBottom"
                        leastDestructiveRef={cancelRef}
                        onClose={onClose}
                        isOpen={isOpen}
                        isCentered
                    >
                        <AlertDialogOverlay />
                        <AlertDialogContent>
                            <AlertDialogHeader>Error</AlertDialogHeader>
                            <AlertDialogCloseButton />
                            <AlertDialogBody>{error}</AlertDialogBody>
                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                    OK
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </Stack>
            </Flex >

        </>
    )
}