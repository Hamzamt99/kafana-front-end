import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeDeal, getClaim, getDeals, updateDeal } from '../../../store/reducers/deals.reducer';
import Button from 'react-bootstrap/Button';
import { Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { Editable, EditableInput, EditablePreview } from '@chakra-ui/react';
import './style.scss'
import { deleteDeal, deleteUser, updateUser } from '../../../store/reducers/user.reducer';

function Home() {
    const dispatch = useDispatch()
    const state = useSelector(state => state.deals)
    const updaeDeal = useSelector(state => state.deals.updatedDeal)
    const [show, setShow] = useState(false);
    const [data, setData] = useState()
    const [select, setSelect] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(''); // Search query state
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [refresh, setRefresh] = useState();
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const usersPerPage = 10;
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentDeals = state.allDeals ? state.allDeals.slice(indexOfFirstUser, indexOfLastUser) : [];

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredDeals = currentDeals.filter(deal => {
        return deal.id.toString().includes(searchQuery);
    });

    const handleClick = (deal) => {
        setData(deal);
        handleShow();
    }

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            const obj = {
                name: e.target.name.value,
                Description: e.target.Description.value,
                Amount: parseInt(e.target.Amount.value, 10),
                Currency: e.target.Currency.value,
                Status: e.target.Status.value,
            };
            dispatch(updateDeal(data.id, obj));
        } catch (e) {
            console.log(e.message);
        }
    }

    const removeOneDeal = () => {
        try {
            dispatch(removeDeal(data.id));
            setRefresh(!refresh);
            handleClose();
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

    const deleteAllHandler = (array) => {
        try {
            dispatch(deleteDeal(array));
        } catch (e) {
            console.log(e.message);
        }
    }

    useEffect(() => {
        dispatch(getDeals());
    }, [updaeDeal, refresh]);

    return (
        <div className='parent-user'>
            <div className='button-delete'>
                <input
                    type="text"
                    placeholder="Search by Deal ID"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className='searchBar'
                />
                {
                    selectedUserIds.length > 0 ?
                        <Button onClick={() => deleteAllHandler(selectedUserIds)}>Delete</Button>
                        : null
                }
                <Button onClick={() => setSelect(!select)}>Select</Button>

            </div>
            <div className="search-bar">

            </div>
            {
                filteredDeals.length > 0 ?
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Deal_ID</th>
                                <th>Deal Name</th>
                                <th>Description</th>
                                <th>Currency</th>
                                <th>Amount</th>
                                <th>Status</th>
                                {
                                    select &&
                                    <th>Select</th>
                                }
                                <th>Edit</th>
                            </tr>
                        </thead>
                        {filteredDeals &&
                            filteredDeals.map(deal => {
                                return (
                                    <tbody key={deal.id}>
                                        <tr>
                                            <td style={{ width: '5%' }}>{deal.id}</td>
                                            <td style={{ fontWeight: 'bold' }}>{deal.name}</td>
                                            <td style={{ fontWeight: 'bold' }}>{deal.Description}</td>
                                            <td style={{ fontWeight: 'bold' }}>{deal.Currency}</td>
                                            <td style={{ fontWeight: 'bold' }}>{deal.Amount}$</td>
                                            <td style={{ fontWeight: 'bold' }}>{deal.Status}</td>
                                            {
                                                select &&
                                                < td style={{ width: '0.5%' }}>
                                                    <Form.Check
                                                        type='checkbox'
                                                        id={`checkbox-${deal.id}`}
                                                        onChange={() => handleCheckboxChange(deal.id)}
                                                    />
                                                </td>
                                            }
                                            <td style={{ width: '8%' }}>
                                                <Button type='submit' onClick={() => handleClick(deal)}>Edit</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                );
                            })
                        }
                    </Table>
                    : (
                        <p>No matching deals found.</p> // Display a message when no matching users are found
                    )
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
                    disabled={filteredDeals.length < usersPerPage}
                >
                    Next
                </Button>
            </div>
            {
                data &&
                <Modal show={show} onHide={handleClose}>
                    <form onSubmit={handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>{data.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='modal-body'><span style={{ fontWeight: 'bold' }}>Name: </span>
                            <Editable defaultValue={data.name} style={{ borderBottom: '1px solid #000', padding: '1%', width: '50%' }}>
                                <EditablePreview />
                                <EditableInput name='name' />
                            </Editable>
                        </Modal.Body >
                        <Modal.Body className='modal-body'><span style={{ fontWeight: 'bold' }}>Description: </span>
                            <Editable defaultValue={data.Description} style={{ borderBottom: '1px solid #000', padding: '1%', width: '100%' }}>
                                <EditablePreview />
                                <EditableInput name='Description' />
                            </Editable>
                        </Modal.Body >
                        <Modal.Body className='modal-body'><span style={{ fontWeight: 'bold' }}>Amount: </span>
                            <Editable defaultValue={data.Amount} style={{ borderBottom: '1px solid #000', padding: '1%', width: '50%' }}>
                                <EditablePreview />
                                <EditableInput name='Amount' />
                            </Editable>
                        </Modal.Body>
                        <Modal.Body className='modal-body'><span style={{ fontWeight: 'bold' }}>Currency: </span>
                            <Editable defaultValue={data.Currency} style={{ borderBottom: '1px solid #000', padding: '1%', width: '50%' }}>
                                <EditablePreview />
                                <EditableInput name='Currency' />
                            </Editable>
                        </Modal.Body>
                        <Modal.Body className='modal-body'><span style={{ fontWeight: 'bold' }}>Status: </span>
                            <Form.Select id='Status' style={{ width: '50%' }} defaultValue={data.Status}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Deleted">Deleted</option>
                                <option value="Expired">Expired</option>
                            </Form.Select>
                        </Modal.Body>
                        <Modal.Body className='modal-body'><span style={{ fontWeight: 'bold' }}>Delete Deal ?  </span>
                            <Button className='button-card' onClick={removeOneDeal}>Delete</Button>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose} >
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleClose} type='submit'>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            }
        </div>
    );
}

export default Home;
