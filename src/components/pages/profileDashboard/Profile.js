import React, { useEffect, useState } from 'react'
import {
    Avatar,
    Text,
    Image,
    Button,
    Box,
    Stack,
    FormControl,
    FormLabel,
    Input,
    HStack,
    Divider,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    useDisclosure,
    ModalBody,
    Modal,
    ModalHeader,
    ModalFooter,
    Editable,
    EditableInput,
    EditablePreview,
    InputGroup,
    InputLeftAddon,
    AlertIcon,
    Alert,
} from '@chakra-ui/react';
import { FaHandshake } from 'react-icons/fa'
import { BsFillPencilFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, profileEdit, uploadHero, uploadImage } from '../../../store/reducers/profile.reducer';
import './style.scss'
import { claimDeal, getClaim, getDeals, removeClaim } from '../../../store/reducers/deals.reducer';
import { Card, Col, Row } from 'react-bootstrap';
import deals from '../../../assets/deals.jpg'

function Profile() {
    const [profileImage, setprofileImage] = useState(null);
    const [heroImage, setheroImage] = useState(null);
    const [refresh, setRefresh] = useState(false)
    const [show, setShow] = useState(false)
    const profileState = useSelector(state => state.profile)
    const claimedDeals = useSelector(state => state.deals.getClaimed)
    const dispatch = useDispatch()
    const { isOpen, onOpen, onClose } = useDisclosure()
    let sum = 0;

    const handleClick = () => {
        onOpen()
    }

    const submitHandler = (e) => {
        try {
            e.preventDefault()
            const obj = {
                email: e.target.email.value !== profileState.profile.email ? e.target.email.value : null,
                name: e.target.name.value ? e.target.name.value : null,
                phone: e.target.phone.value ? e.target.phone.value : null,
                Date_Of_Birth: e.target.bday ? e.target.bday.value : null,
            };

            if (profileImage !== null) {
                dispatch(uploadImage(profileImage))
            }
            if (heroImage !== null) {
                dispatch(uploadHero(heroImage))
            }

            dispatch(profileEdit(obj))
            setShow(true)
            setRefresh(!refresh)
            onClose()
        } catch (e) {
            console.log(e.message);
        }
    }
    const handleDelete = (deal) => {
        dispatch(removeClaim(deal))
        setRefresh(!refresh)
    }
    useEffect(() => {
        dispatch(getProfile())
        dispatch(getClaim())
        dispatch(getDeals())
        if (show === true) {
            setTimeout(() => {
                setShow(false)
            }, 2000)
        }
    }, [refresh])

    return (
        <div>
            <>
                {
                    show &&
                    <Alert status='success' variant='subtle'>
                        <AlertIcon />
                        Profile Updated
                    </Alert>
                }

                <Stack
                    as={Box}
                    spacing={{ base: 8, md: 16 }}
                >

                    <Stack
                        direction={'column'}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}
                    >
                        {profileState.profile && (
                            <>
                                <Image
                                    src={profileState.profile.heroImage ? profileState.profile.heroImage : 'https://placehold.co/600x400'}
                                    objectFit="cover"
                                    objectPosition='50% 50%'
                                    maxW={['100%', '100%', '100%', '100%', '100%']}
                                    width={['100%', '100%', '100%', '1250px', '1600px']}
                                    height="400px"
                                />
                                <Avatar
                                    position="absolute"
                                    top={['88%', '90%', '93%', '90%']}
                                    size={['xl', 'xl', '2xl']}
                                    src={profileState.profile.profileImage}
                                />
                            </>
                        )}
                    </Stack>
                    {
                        profileState.profile &&
                        <Stack gap='0'>
                            <Box display='flex' justifyContent='flex-end'>
                                <Button
                                    className='btn-profile'
                                    onClick={handleClick}
                                    style={{
                                        transition: 'background-color 0.3s ease',
                                        backgroundColor: '#3F72AF',
                                        color: '#F9F7F7',
                                        borderColor: '#112D4E',
                                        borderWidth: '2px',
                                        borderStyle: 'solid',
                                    }}
                                >
                                    <BsFillPencilFill />
                                </Button>
                            </Box>
                            {
                                claimedDeals &&
                                < Stack justifyContent='center' gap='30px' alignItems='center'>
                                    <Text fontSize='3xl' marginBottom='0' className='name-profile'>{profileState.profile.name}</Text>
                                    <Text fontSize='2xl' className='address-profile'>
                                        Account Status: {profileState.profile.Status === 'Active' ? (
                                            <button style={{ color: 'green' }}>{profileState.profile.Status}</button>
                                        ) : (
                                            <button style={{ color: 'red' }}>{profileState.profile.Status}</button>
                                        )}
                                    </Text>
                                    <HStack gap='40px'>
                                        <Text fontSize='2xl'>Claimed Deals: {claimedDeals.length}</Text>amount
                                        {
                                            claimedDeals.map(claim => {
                                                sum += claim.Amount
                                            })
                                        }
                                        < Text fontSize='2xl' > Total Amounts: {sum}$</Text>
                                    </HStack>
                                </Stack>
                            }
                        </Stack>
                    }
                </Stack>
                <Divider />
                {
                    claimedDeals &&
                        claimedDeals.length > 0 ?
                        <Row xs={1} md={2} lg={4} className="g-4 grid">
                            {claimedDeals.map((deal) => (
                                <Col key={deal.id}>
                                    <Card className='grid-item'>
                                        <Card.Img variant="top" src={deal.deal.image} />
                                        <Card.Body>
                                            <Card.Title> {deal.name}</Card.Title>
                                            <Card.Text>
                                                <span style={{ fontWeight: 'bold' }}>Description: </span> {deal.deal.Description}
                                            </Card.Text>
                                            <Card.Text>
                                                <span style={{ fontWeight: 'bold' }}>Amount: </span> {deal.Amount}$
                                            </Card.Text>
                                            <Card.Text>
                                                <span style={{ fontWeight: 'bold' }}>Currency: </span> {deal.Currency}
                                            </Card.Text>
                                            <Card.Text>
                                                <span style={{ fontWeight: 'bold' }}>Status: </span>
                                                <span style={{ color: deal.deal.Status === 'Active' ? 'green' : 'red' }}>
                                                    {deal.deal.Status}
                                                </span>
                                            </Card.Text>
                                        </Card.Body>

                                        <Row className="justify-content-end">
                                            <Col xs="auto" >
                                                {claimedDeals.filter((claimedDeal) => claimedDeal.Deal_ID === claimedDeal.deal.id).length > 0 ? (
                                                    deal.deal.Status === 'Active' ? (
                                                        <Button className='button-card' onClick={() => handleDelete(deal.Deal_ID)}>Claimed</Button>
                                                    ) : null
                                                ) : null}
                                            </Col>
                                        </Row>
                                        <Card.Footer>
                                            {(() => {
                                                const timestamp = new Date(deal.createdAt);
                                                const date = timestamp.toISOString().split('T')[0];
                                                return (
                                                    <small className="text-muted">
                                                        <span style={{ fontWeight: 'bold' }}>posted at</span> {date}
                                                    </small>
                                                );
                                            })()}
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        :
                        (
                            <div className='empty-profile'>
                                <FaHandshake size={100} />
                                <h4>No Claimed deals yet</h4>
                                <p>
                                    Claim New Deal, they will appear on your profile.
                                </p>

                            </div>
                        )
                }
                {/* <div>
                    {images && images.length > 0 ? (
                        <Posts posts={images} />
                    ) : (
                        <div className='empty-profile'>
                            <BsCamera size={100} />
                            <h4>Add New Post</h4>
                            <p>
                                Add New Post, they will appear on your profile.
                            </p>

                        </div>
                    )}
                </div> */}
                {/*/ Edit profile Modal/*/}
                <Modal onClose={onClose} size='2xl' isOpen={isOpen}>
                    < form onSubmit={submitHandler} >
                        <ModalOverlay
                            bg='blackAlpha.300'
                            backdropFilter='blur(10px) '
                        />
                        <ModalContent>
                            <ModalHeader>Edit Profile</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Stack
                                    as={Box}
                                    spacing={{ base: 9, md: 10 }}
                                >
                                    <Stack
                                        direction={'column'}
                                        align={'center'}
                                        alignSelf={'center'}
                                        position={'relative'}>
                                        <Button
                                            as="label"
                                            htmlFor="hero-file-input"
                                            position="absolute"
                                            bg='Background'
                                            color='white'
                                            left={['56%', '55%', '54%', '93%']}
                                            top={['99%', '100%', '100%', '1%']}
                                            rounded='30px'
                                            width='40px'
                                            className='btn'
                                            cursor='pointer'
                                            _hover={{ bg: 'hoverColor' }}
                                        >
                                            <BsFillPencilFill />
                                        </Button>

                                        <Input
                                            type="file"
                                            id="hero-file-input"
                                            display="none"
                                            onChange={(event) => {
                                                setheroImage(event.target.files[0]);
                                            }}
                                        />
                                        {profileState.profile && (
                                            <>
                                                <Image
                                                    src={heroImage ? URL.createObjectURL(heroImage) : profileState.profile.heroImage || 'https://placehold.co/600x400'}
                                                    objectFit="cover"
                                                    maxW={['420px', '768px', '992px', '1200px', '1260px']}
                                                    width={['100%', '490px', '620px', '600px', '630px']}
                                                    height="220px"
                                                />

                                                <Avatar
                                                    position='absolute'
                                                    top={['76%', '82%', '93%', '70%']}
                                                    size={['xl', 'xl', 'xl']}
                                                    src={profileImage ? URL.createObjectURL(profileImage) : profileState.profile.profileImage}
                                                />
                                            </>
                                        )}
                                        <Button
                                            as="label"
                                            htmlFor="file-input"
                                            position="absolute"
                                            left={['56%', '55%', '54%', '54%']}
                                            top={['99%', '100%', '100%', '96%']}
                                            bg='Background'
                                            rounded='30px'
                                            color='white'
                                            width='40px'
                                            className='btn'
                                            cursor='pointer'
                                            _hover={{ bg: 'hoverColor' }}

                                        >
                                            <BsFillPencilFill />
                                        </Button>

                                        <Input
                                            type="file"
                                            id="file-input"
                                            display="none"
                                            onChange={(event) => {
                                                setprofileImage(event.target.files[0]);
                                            }}
                                        />
                                        <BsFillPencilFill />
                                    </Stack>
                                    {
                                        profileState.profile &&
                                        <Stack>
                                            <HStack marginTop='20px'>
                                                <FormControl>
                                                    <FormLabel fontWeight='bold'>Name</FormLabel>
                                                    <Editable defaultValue={profileState.profile.name} style={{ borderBottom: '1px solid #000', padding: '1%', width: '50%' }}>
                                                        <EditablePreview />
                                                        <EditableInput name='name' />
                                                    </Editable>
                                                </FormControl>
                                                <FormControl id="phone">
                                                    <FormLabel htmlFor="phone">phone number</FormLabel>
                                                    <InputGroup >
                                                        <InputLeftAddon children='+962' />
                                                        <Input type='tel' defaultValue={profileState.profile.phone} />
                                                    </InputGroup>
                                                </FormControl>
                                            </HStack>
                                            <HStack>
                                                <FormControl>
                                                    <FormLabel fontWeight='bold'>Email</FormLabel>
                                                    <Editable defaultValue={profileState.profile.email} style={{ borderBottom: '1px solid #000', padding: '1%', width: '70%' }} >
                                                        <EditablePreview />
                                                        <EditableInput name='email' />
                                                    </Editable>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel fontWeight='bold' htmlFor="bday">Birthday</FormLabel>
                                                    <Input
                                                        defaultValue={profileState.profile.Date_Of_Birth}
                                                        style={{ border: 'none', borderBottom: '1px solid #000', padding: '1%', width: '50%' }}
                                                        name='bday'
                                                        placeholder="Select Date"
                                                        size="md"
                                                        type="date"
                                                    />
                                                </FormControl>
                                            </HStack>
                                        </Stack>
                                    }
                                </Stack>
                            </ModalBody>
                            <ModalFooter>
                                <HStack spacing={6}>
                                    <Button onClick={onClose} className='btnClose'>Close</Button>
                                    <Button className='btn' color='white' type='submit'>Save Changes</Button>
                                </HStack>
                            </ModalFooter>
                        </ModalContent>
                    </form>
                </Modal>
            </>
        </div >
    )
}

export default Profile