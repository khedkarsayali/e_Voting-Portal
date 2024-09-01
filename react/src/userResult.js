import './userResult.css';


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './userResult.css';

const UserResult = () => {
    const [winner, setWinner] = useState(null);
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [statistics, setStatistics] = useState([]);
    const [showResult, setShowResult] = useState(false); // New state to check if the result is published
    const [chartImagePath, setChartImagePath] = useState('');
    const [chartImageUrl, setChartImageUrl] = useState(null);
    useEffect(() => {
        fetch('/get_vote_count_pie_chart')
            .then(response => response.blob())
            .then(blob => {
                // Create a URL for the blob object
                const imageUrl = URL.createObjectURL(blob);
                setChartImageUrl(imageUrl);
            })
            .catch(error => console.error('Error fetching pie chart image:', error));

        fetch('/get_total_candidates')
            .then(response => response.json())
            .then(data => setTotalCandidates(data.totalCandidates))
            .catch(error => console.error('Error fetching total candidates:', error));

        fetch('/get_winner')
            .then(response => response.json())
            .then(data => setWinner(data))
            .catch(error => console.error('Error fetching winner:', error));

        fetch('/get_election_statistics')
            .then(response => response.json())
            .then(data => setStatistics(data))
            .catch(error => console.error('Error fetching data:', error));

        // Fetch the showResult status from the server
        fetch('/admin/get_result_status')
            .then(response => response.json())
            .then(data => setShowResult(data.showResult))
            .catch(error => console.error('Error fetching showResult status:', error));
    }, []);

    return (
        <div className="userrepage">
            <div className="navbar">
                <div className="nav1_titile">
                    <h2>COEP e-voting portal</h2>
                </div>
                <div className="nav1_links">
                    <Link to='./UserHome'>Home</Link>
                    <Link to='./CandidateProfile'>Candidates Profile</Link>
                    <Link to='./Voting'>Vote</Link>
                    <Link to='./Result'>Result</Link>
                    <Link to='./Login1'>Login</Link>
                </div>
            </div>
            {showResult ? (
                <div className="outerouter">
                    <div className="outerflex1">
                        <div className="flexbox1234" id="box333">
                            <div className="box112">
                                <h1>{totalCandidates}</h1>
                                <p>Total Candidates</p>
                            </div>
                        </div>
                        <div className="flexbox1234" id="box444">
                            <div className="box112">
                                <div className="winner">
                                    <div className="infoWinner">
                                        <div className="winTitle">
                                            <h5>Congratulations !!
                                                <br></br>
                                                Winner of elections 
                                            </h5>
                                        </div>
                                        <div className="winnerInfo">
                                            <h2 id="WinName">{winner && winner.name}</h2>
                                            <h3 id="WinName">{winner && winner.branch}</h3>
                                        </div>
                                        <div className="winnerimg">
                                        <img src={`http://localhost:5000/static/${winner.photo}`} alt='img' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lowerBox1">
                        <div className="showCountdata1">
                            <div className="innerT12">
                                <h4>Vote Statistics</h4>
                            </div>
                            <table>
                                
                                    
                                <tbody>
                                    {statistics.map(candidate => (
                                        <tr key={candidate.mis}>
                                            <td>{candidate.name}</td>
                                            <td>{candidate.mis}</td>
                                            <td>{candidate.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="winChart1">
                            <div className="innerT12">
                                {/* Display the pie chart image */}
                                <h4>Pie Chart: Vote Count for Each Candidate</h4>

                                
                            </div>
                            <div className="imgpie">
                            {chartImageUrl && <img src={chartImageUrl} alt="Pie Chart" />}

                            </div>
                            
                        </div>
                    </div>
                </div>
            ) : (
                <div className="resultNotPublished">
                    <p>Result not yet published.</p>
                </div>
            )}
        </div>
    );
};

export default UserResult;
