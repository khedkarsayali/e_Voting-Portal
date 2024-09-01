import './adminResult.css';

import { useState, useEffect } from 'react';
import AdminNavbar from './admin_navbar';

const AdminResult = () => {
    const [statistics, setStatistics] = useState([]);
    const [votingEnabledAlert, setVotingEnabledAlert] = useState(false);
    const [votingDisabledAlert, setVotingDisabledAlert] = useState(false);
    const [resultEnabledAlert, setResultEnabledAlert] = useState(false);
    const [resultDisabledAlert, setResultDisabledAlert] = useState(false);
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [totalUsersVoted, setTotalUsersVoted] = useState(0);
    const [chartImagePath, setChartImagePath] = useState('');
    const [chartImageUrl, setChartImageUrl] = useState(null);
    
    useEffect(() => {
        fetch('/get_election_statistics')
            .then(response => response.json())
            .then(data => setStatistics(data))
            .catch(error => console.error('Error fetching data:', error));

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

        fetch('/get_total_users_voted')
            .then(response => response.json())
            .then(data => setTotalUsersVoted(data.totalUsersVoted))
            .catch(error => console.error('Error fetching total users voted:', error));
    }, []);

    const enableVoting = async () => {
        try {
            const response = await fetch('/admin/enable_voting', {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok) {
                setVotingEnabledAlert(true);
                alert('Voting enabled');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error enabling voting:', error);
        }
    };

    const disableVoting = async () => {
        try {
            const response = await fetch('/admin/disable_voting', {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok) {
                setVotingDisabledAlert(true);
                alert('Voting disabled');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error disabling voting:', error);
        }
    };

    const enableResults = async () => {
        try {
            const response = await fetch('/admin/enable_results', {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok) {
                setResultEnabledAlert(true);
                alert('Result display enabled');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error enabling result display:', error);
        }
    };

    const disableResults = async () => {
        try {
            const response = await fetch('/admin/disable_results', {
                method: 'POST'
            });
            const data = await response.json();
            if (response.ok) {
                setResultDisabledAlert(true);
                alert('Result display disabled');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error disabling result display:', error);
        }
    };

    const generatePDF = async () => {
        try {
            const response = await fetch('/generate_pdf', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/pdf'
                }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'election_report.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <div className="adminrepage">

            <div className="adnnav">
                <AdminNavbar></AdminNavbar>

            </div>
            <div className="resultpage">
            
            <div className="outerflex">
                <div className="flexbox123" id="box11">
                    <div className="box12">
                        <button className='enbutton' onClick={enableVoting}>Enable Voting</button>
                        <button className='enbutton' onClick={disableVoting}>Disable Voting</button>
                    </div>
                </div>
                
                <div className="flexbox123" id="box33">
                    <div className="box12">
                    <h1>{totalCandidates}</h1>
                        <p>Total Candidates</p>
                    </div>
                </div>
                <div className="flexbox123" id="box44">
                    <div className="box12">
                    <h1>{totalUsersVoted}</h1>
                        <p>Total Users Voted</p>
                    </div>
                </div>

                <div className="flexbox123" id="box22">
                    <div className="box12">
                        <button className='enbutton' onClick={enableResults}>Enable User Result</button>
                        <button className='enbutton' onClick={disableResults}>Disable User Result</button>
                    </div>
                </div>

                <div className="flexbox123" id="box22">
                    <div className="box12">
                    
                        <button className='enbutton' onClick={generatePDF}>Generate PDF</button>
                  
                    </div>
                </div>

                
            </div>
            <div className="lowerBox">
                <div className="showCountdata">
                    <div className="innerT">
                        <h4>Vote Statistics</h4>
                    </div>
                    <table>
                                <tr>
                                <td>Name</td>
                                <td>MIS</td>
                                    <td>Vote Count</td>
                                    
                                </tr>
                            
                            
                                {statistics.map(candidate => (
                                    <tr key={candidate.mis}>
                                        <td>{candidate.name}</td>
                                        <td>{candidate.mis}</td>
                                        <td>{candidate.count}</td>
                                    </tr>
                                ))}
                            
                        </table>
                    
                </div>
                <div className="winChart">
                    <div className="innerT">
                    <h4>Pie Chart: Vote Count for Each Candidate</h4>

                    </div>
                    <div className="imgpie">
                            {chartImageUrl && <img src={chartImageUrl} alt="Pie Chart" />}

                            </div>
                </div>
                {/* Button to generate PDF */}
                
            </div>
        </div>
        </div>
    );
}

export default AdminResult;
