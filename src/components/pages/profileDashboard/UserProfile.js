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
import './style.scss'
import { Card, Col, Row } from 'react-bootstrap';
import { getOneUser } from '../../../store/reducers/user.reducer';
import { useParams } from 'react-router-dom';
import { getClaim, getUserClaim } from '../../../store/reducers/deals.reducer';

function User() {
    const { id } = useParams()
    const profileState = useSelector(state => state.user)
    const claimedDeals = useSelector(state => state.deals.getClaimed)
    const dispatch = useDispatch()
    let sum = 0;
    useEffect(() => {
        dispatch(getOneUser(id))
        dispatch(getUserClaim(id))
    }, [])

    return (
        <div>
            <>
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
                        {profileState.oneUser
                            && (
                                <>
                                    <Image
                                        src={profileState.oneUser.heroImage ? profileState.oneUser.heroImage : 'https://placehold.co/600x400'}
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
                                        src={profileState.oneUser.profileImage}
                                    />
                                </>
                            )}
                    </Stack>
                    {
                        profileState.oneUser &&
                        <Stack gap='0' marginTop='25px'>
                            {
                                claimedDeals &&
                                < Stack justifyContent='center' gap='30px' alignItems='center'>
                                    <Text fontSize='3xl' marginBottom='0' className='name-profile'>{profileState.oneUser.name}</Text>
                                    <Text fontSize='2xl' className='address-profile'>
                                        Account Status: {profileState.oneUser.Status === 'Active' ? (
                                            <button style={{ color: 'green' }}>{profileState.oneUser.Status}</button>
                                        ) : (
                                            <button style={{ color: 'red' }}>{profileState.oneUser.Status}</button>
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
            </>
        </div >
    )
}

export default User