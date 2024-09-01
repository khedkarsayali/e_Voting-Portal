

import './addVoters.css';
import { useState, useEffect } from 'react';
import AdminNavbar from './admin_navbar';
import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
import { MdDelete } from "react-icons/md";

const AddVoter = () => {
    const [mis, setMis] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [voters, setVoters] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [email, setEmail] = useState('');

    useEffect(() => {


        fetchVoters();

        fetchTotalUsers();
    }, []);


    const fetchVoters = async () => {
        try {
            const response = await fetch('/api/voters');
            if (response.ok) {
                const data = await response.json();
                setVoters(data);
            } else {
                console.error('Failed to fetch voters');
            }
        } catch (error) {
            console.error('Error fetching voters:', error);
        }
    };

    const fetchTotalUsers = async () => {
        try {
            const response = await fetch('/get_total_users');
            if (response.ok) {
                const data = await response.json();
                setTotalUsers(data.totalUsers);
            } else {
                console.error('Failed to fetch total users');
            }
        } catch (error) {
            console.error('Error fetching total users:', error);
        }
    };
    const handleAddVoter = async () => {
        try {
            const response = await fetch('/api/add_voter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mis, email  }),
            });
            if (response.ok) {
                console.log('Voter added successfully');
                alert('Voter added successfully');
                fetchVoters();
                setMis('');
                setEmail('');

            } else {
                const errorData = await response.json();
                console.error('Failed to add voter:', errorData.error);
            }
        } catch (error) {
            console.error('Error adding voter:', error);
        }
    };

    const handleDeleteVoter = async (mis) => {
        try {
            const response = await fetch('/api/delete_voter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mis }),
            });
            if (response.ok) {
                console.log('Voter deleted successfully');
                alert('Voter deleted successfully');
                fetchVoters();
            } else {
                const errorData = await response.json();
                console.error('Failed to delete voter:', errorData.error);
            }
        } catch (error) {
            console.error('Error deleting voter:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredVoters = voters.filter(voter => voter.mis.toString().includes(searchQuery));

    return (
        <div className="addVoterPage">
            <div className="abc">
                <AdminNavbar />

            </div>

            <div className="titlebar">
                <div className="outerbox67">
                    <div className="addVot">

                        <div className="form-group">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter MIS"
                                value={mis}
                                onChange={(e) => setMis(e.target.value)}
                            />
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  // Add setEmail function to set the email state
                            />
                            <button className="btn btn-primary" onClick={handleAddVoter}>Add Voter</button>
                        </div>

                        <div className="newbox">
                            <h3 >Add new Voters </h3>
                        </div>

                    </div>

                    <div className="voterstats">
                        <div className="voteCount">
                            <h1>{totalUsers}</h1>

                        </div>

                        <div className="newbox2">
                            <p>Total Number of Voters</p>



                        </div>
                    </div>
                </div>
                <div className="outerbox56">
                    <div class='tabletitle'>

                        <h3>Eligible Voters </h3>


                        <div className="searchbar">
                            <MDBInputGroup>
                                <MDBInput label='Search' value={searchQuery} onChange={handleSearch} />
                                <MDBBtn rippleColor='dark'>
                                    <MDBIcon icon='search' />
                                </MDBBtn>
                            </MDBInputGroup>
                        </div>
                    </div>
                    <div className="displayvotersbox">
                        <div className="vList">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">MIS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredVoters.map((voter, index) => (
                                        <tr key={index}>
                                            <td>{voter.mis}

                                                <button id="VotDelBut" onClick={() => handleDeleteVoter(voter.mis)}><MdDelete /> Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddVoter;
