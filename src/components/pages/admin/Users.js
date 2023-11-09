import { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUser, updateUser } from '../../../store/reducers/user.reducer';
import './style.scss';
import { Alert, AlertIcon, Avatar, Editable, EditableInput, EditablePreview, FormControl } from '@chakra-ui/react';
import { Button, Form, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Users() {
    const dispatch = useDispatch();
    const state = useSelector(state => state.user);
    console.log(state);
    const [show, setShow] = useState(false);
    const [select, setSelect] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("Active");
    const [id, setId] = useState()
    const usersPerPage = 10;
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = state.allUsers ? state.allUsers.slice(indexOfFirstUser, indexOfLastUser) : [];
    const navigate = useNavigate()
    const deleteHandler = (array) => {
        try {
            dispatch(deleteUser(array))
        } catch (e) {
            console.log(e.message);
        }
    }

    const navigating = (id) => {
        navigate(`/userProfile/${id}`)
    }
    const updateHandler = (e) => {
        try {
            e.preventDefault();
            const obj = {
                Status: selectedStatus,
            };
            console.log(obj);
            dispatch(updateUser(obj, id));
            setShow(true);

            setTimeout(() => {
                setShow(false);
            }, 2000);
        } catch (e) {
            console.log(e.message);
        }
    }

    const handleCheckboxChange = (userId) => {
        setSelectedUserIds((prevSelectedUserIds) => {
            if (prevSelectedUserIds.includes(userId)) {
                return prevSelectedUserIds.filter((id) => id !== userId);
            } else {
                return [...prevSelectedUserIds, userId];
            }
        });
    };

    useEffect(() => {
        dispatch(getUser());
    }, []);

    return (
        <div className='parent-user'>
            <form onSubmit={(e) => updateHandler(e)}>
                <div className='button-delete'>
                    {
                        selectedUserIds.length > 0 ?
                            <Button onClick={() => deleteHandler(selectedUserIds)}>Delete</Button>
                            : null
                    }
                    <Button onClick={() => setSelect(!select)}>Select</Button>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>User_ID</th>
                            <th>User</th>
                            <th>Status</th>
                            {
                                select &&
                                <th>Select</th>
                            }
                            <th>Save Changes</th>
                        </tr>
                    </thead>
                    {currentUsers &&
                        currentUsers.map(user => {
                            return (
                                user.role !== 'admin' ? (
                                    <tbody key={user.id}>
                                        <tr>
                                            <td style={{ width: '5%' }}>{user.id}</td>
                                            <div style={{ display: 'flex', gap: '30px', cursor: 'pointer' }} onClick={() => navigating(user.id)}>
                                                <td style={{ fontWeight: 'bold' }}><Avatar src={user.Profile} /></td>
                                                <td style={{ fontWeight: 'bold' }}>{user.name}</td>
                                            </div>
                                            <td style={{ width: '15%' }}>
                                                <Form.Select
                                                    id='Status'
                                                    defaultValue={user.Status}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                    <option value="Deleted">Deleted</option>
                                                    <option value="Expired">Expired</option>
                                                </Form.Select>
                                            </td>
                                            {
                                                select &&
                                                < td style={{ width: '0.5%' }}>
                                                    <Form.Check
                                                        type='checkbox'
                                                        id={`checkbox-${user.id}`}
                                                        onChange={() => handleCheckboxChange(user.id)}
                                                    />
                                                </td>
                                            }
                                            <td style={{ width: '8%' }}>
                                                <Button type='submit' onClick={() => setId(user.id)}>Save</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : null
                            );
                        })
                    }
                </Table>
            </form>
            {
                show &&
                <Alert status='success'>
                    <AlertIcon />
                    User Updated
                </Alert>
            }
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
                    disabled={currentUsers.length < usersPerPage}
                >
                    Next
                </Button>
            </div>
        </div >
    );
}
