import { Box, Button, Image, Link } from '@chakra-ui/react';

function NotAuth() {
    return (
        <Box
            maxW='full'
            borderWidth='1px'
            borderRadius='lg'
            overflow='hidden'
        >
            <Box p='6'>
                <Box
                    mt='1'
                    fontWeight='semibold'
                    as='h4'
                    lineHeight='tight'
                    noOfLines={1}
                >
                    401 You are Not Authorized
                </Box>
                <Button>
                    <Link href='/signin'>Go to login page</Link>
                </Button>
            </Box>
        </Box>
    );
}

export default NotAuth;