import React, { useEffect, useState } from 'react';
import {
    Box,
    Flex,
    Avatar,
    HStack,
    Text,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
} from '@chakra-ui/react';
import cookies from 'react-cookies';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../store/reducers/user.reducer';
import { getProfile } from '../../store/reducers/profile.reducer';
import { decodeToken } from 'react-jwt';

const Links = [
    { text: 'Home', url: '/' },
    { text: 'Users List', url: '/users' },
    { text: 'Deals List', url: '/deals' },
    { text: 'Claimed Deals List', url: '/claimed' },
];

const NavLink = ({ children }) => {
    return (
        <Box
            as="a"
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
            }}
            href={'/'}
        >
            {children}
        </Box>
    );
};

export default function Header() {
    const [decode, setDecode] = useState(null);
    const state = useSelector(state => state.user);
    const isAuth = cookies.load('user_session');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profileState = useSelector(state => state.profile);
    const handleLogout = () => {
        dispatch(logOut());
        navigate('/signin');
    };

    useEffect(() => {
        if (isAuth) {
            const decodeAuth = decodeToken(isAuth);
            setDecode(decodeAuth);
        } else {
            setDecode(null);
        }
    }, [isAuth]);

    useEffect(() => {
        dispatch(getProfile());
    }, []);

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Link to='/'><Box>Kafana Tech</Box></Link>
                        {
                            decode && decode.role === 'admin' &&
                            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                                {Links.map((link) => (
                                    <Link to={link.url} key={link.text}>
                                        <NavLink>{link.text}</NavLink>
                                    </Link>
                                ))}
                            </HStack>
                        }
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}
                            >
                                {profileState.profile && (
                                    <Avatar
                                        size={'sm'}
                                        src={profileState.profile.profileImage}
                                    />
                                )}
                            </MenuButton>
                            <MenuList>
                                <Link to='/profile'>
                                    <MenuItem>Profile</MenuItem>
                                </Link>
                                <MenuDivider />
                                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link) => (
                                <Link to={link.url} key={link.text}>
                                    <NavLink>{link.text}</NavLink>
                                </Link>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    );
}
