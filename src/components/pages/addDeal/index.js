import { Alert, AlertIcon, Avatar, Box, Button, Editable, EditablePreview, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BsFillPencilFill } from 'react-icons/bs';
import { addDeal } from '../../../store/reducers/deals.reducer';
import { useDispatch } from 'react-redux';

function AddDeal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [heroImage, setheroImage] = useState(null);
    const [show, setShow] = useState(false)
    const dispatch = useDispatch()
    const submitHandler = (e) => {
        try {
            e.preventDefault()
            const obj = {
                name: e.target.name.value,
                Description: e.target.Description.value,
                Amount: e.target.Amount.value,
                Currency: e.target.Currency.value,
                image: heroImage
            };
            dispatch(addDeal(obj))
            setShow(true)
            onClose()
        } catch (e) {
            console.log(e.message);
        }
    }

    useEffect(() => {
        if (show === true) {
            setTimeout(() => {
                setShow(false)
            }, 2000)
        }
    })
    return (
        <div>
            {
                show &&
                <Alert status='success' variant='subtle'>
                    <AlertIcon />
                    Deal Added
                </Alert>
            }
            <Button onClick={onOpen} backgroundColor='blue' color='white'>Add Deal? </Button>
            <Modal onClose={onClose} size='2xl' isOpen={isOpen}>
                < form onSubmit={submitHandler} >
                    <ModalOverlay
                        bg='blackAlpha.300'
                        backdropFilter='blur(10px) '
                    />
                    <ModalContent>
                        <ModalHeader>Add Deal</ModalHeader>
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
                                    <Image
                                        src={heroImage ? URL.createObjectURL(heroImage) : 'https://placehold.co/600x400'}
                                        objectFit="cover"
                                        maxW={['420px', '768px', '992px', '1200px', '1260px']}
                                        width={['100%', '490px', '620px', '600px', '630px']}
                                        height="220px"
                                    />

                                </Stack>
                                <Input placeholder='Name' id='name' isRequired />
                                <Input placeholder='Description' id='Description' isRequired />
                                <Input placeholder='Amount' id='Amount' isRequired />
                                <Input placeholder='Currency' id='Currency' isRequired />
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
        </div>
    )
}

export default AddDeal
