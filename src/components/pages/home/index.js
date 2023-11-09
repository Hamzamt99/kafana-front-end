import Card from 'react-bootstrap/Card';
import deals from '../../../assets/deals.jpg'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { claimDeal, getClaim, getDeals, removeClaim } from '../../../store/reducers/deals.reducer';
import Button from 'react-bootstrap/Button';
import './style.scss'
import { Col, Row } from 'react-bootstrap';
import AddDeal from '../addDeal';

function Home() {
    const dispatch = useDispatch()
    const state = useSelector(state => state.deals)
    const claimedDeals = useSelector(state => state.deals.claimed)
    const [refresh, setRefresh] = useState(false)
    console.log(state);
    const handleClick = (deal) => {
        dispatch(claimDeal(deal))
    }
    const handleDelete = (deal) => {
        dispatch(removeClaim(deal.id))
        setRefresh(!refresh)
    }
    useEffect(() => {
        dispatch(getDeals())
        dispatch(getClaim())
    }, [claimedDeals, refresh])

    return (
        <>

            <Row xs={1} md={2} lg={4} className="g-4 grid" >
                {state.allDeals.map((deal) => (
                    <Col key={deal.id}>
                        <Card className='grid-item'>
                            <Card.Img variant="top" src={deal.image || deals} className='image-deal'/>
                            <Card.Body>
                                <Card.Title> {deal.name}</Card.Title>
                                <Card.Text>  <span style={{ fontWeight: 'bold' }}>Description: </span> {deal.Description}</Card.Text>
                                <Card.Text> <span style={{ fontWeight: 'bold' }}>Amount: </span> {deal.Amount}$</Card.Text>
                                <Card.Text> <span style={{ fontWeight: 'bold' }}>Currency: </span> {deal.Currency}</Card.Text>
                                <Card.Text>
                                    <span style={{ fontWeight: 'bold' }}>Status: </span>
                                    <span style={{ color: deal.Status === 'Active' ? 'green' : 'red' }}>
                                        {deal.Status}
                                    </span>
                                </Card.Text>
                                <Row className="justify-content-end">
                                    <Col xs="auto" >
                                        {
                                            Array.isArray(state.getClaimed) && state.getClaimed.filter((claimedDeal) => claimedDeal.Deal_ID === deal.id).length > 0 ? (
                                                deal.Status === 'Active' ? (
                                                    <Button className='button-card' onClick={() => handleDelete(deal)}>Claimed</Button>
                                                ) : null
                                            ) : deal.Status === 'Active' ? (
                                                <Button onClick={() => handleClick(deal)}>Claim Deal</Button>
                                            ) : null
                                        }
                                    </Col>
                                </Row>
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
            <div className='add-deal'>
                <AddDeal />
            </div>
        </>
    );
}
export default Home;
