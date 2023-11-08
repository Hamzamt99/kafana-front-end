import { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { useDispatch, useSelector } from 'react-redux';
import { allClaimed, deleteUser, getUser, updateUser } from '../../../store/reducers/user.reducer';
import './style.scss';
import { Alert, AlertIcon, Avatar, Editable, EditableInput, EditablePreview } from '@chakra-ui/react';
import { Button, Form, Table } from 'react-bootstrap';

export default function Claimed() {
    const dispatch = useDispatch();
    const state = useSelector(state => state.user);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const usersPerPage = 10;
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = state.allClaimed ? state.allClaimed.slice(indexOfFirstUser, indexOfLastUser) : [];

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = currentUsers.filter(user => {
        return user.user.id.toString().includes(searchQuery);
    });

    useEffect(() => {
        dispatch(allClaimed());
    }, []);

    return (
        <div className='parent-user'>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by User ID"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className='searchBar'
                />
            </div>
            {filteredUsers.length > 0 ? ( // Check if there are filtered users
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Claim ID</th>
                            <th>User ID</th>
                            <th>Deal name</th>
                            <th>Claimed By</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Currency</th>
                            <th>Posted At</th>
                        </tr>
                    </thead>
                    {filteredUsers.map(user => {
                        return (
                            user.role !== 'admin' ? (
                                <tbody key={user.id}>
                                    <tr>
                                        <td style={{ width: '7%' }}>{user.Deal_ID}</td>
                                        <td style={{ width: '7%' }}>{user.user.id}</td>
                                        <td style={{ fontWeight: 'bold' }}>{user.deal.name}</td>
                                        <td style={{ fontWeight: 'bold' }}>{user.user.name}</td>
                                        <td style={{ width: '15%' }}>
                                            {user.deal.Status}
                                        </td>
                                        <td style={{ width: '10%' }}>{user.Amount}$
                                        </td>
                                        <td style={{ width: '10%' }}>
                                            {user.Currency}
                                        </td>
                                        <td style={{ width: '10%' }}>
                                            {(() => {
                                                const timestamp = new Date(user.createdAt);
                                                const date = timestamp.toISOString().split('T')[0];
                                                return (
                                                    <span style={{ fontWeight: 'bold' }}>{date}</span>
                                                );
                                            })()}
                                        </td>
                                    </tr>
                                </tbody>
                            ) : null
                        );
                    })}
                </Table>
            ) : (
                <p>No matching users found.</p> // Display a message when no matching users are found
            )}
            <div className="pagination">
                <Button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span>Page {currentPage}</span>
                <Button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={filteredUsers.length < usersPerPage}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
