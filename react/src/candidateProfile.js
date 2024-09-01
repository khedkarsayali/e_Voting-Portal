import './candidateProfile.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gmailPic from './img/gmail.png';
import linkedInPic from './img/linkedin.png';
import twitterPic from './img/twitter.png';

const CandidateProfile = () => {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const response = await fetch(`/api/candidates`);
            if (!response.ok) {
                throw new Error('Failed to fetch candidate data');
            }
            const data = await response.json();
            setCandidates(data);
        } catch (error) {
            console.error('Error fetching candidate data:', error);
        }
    };

    return (
        <div className="profilePage">
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
            <div className="cdptitle">
                <h1>Candidate Profiles</h1>
            </div>
            <div className="profileList">
                <div className="profileCard">
                    {candidates.map(candidate => (
                        <div className="cardp" key={candidate.id}>
                            <div className="cardImg">
                                <img src={`http://localhost:5000/static/${candidate.photo}`} alt={candidate.name} />
                            </div>
                            <div className="cardText">
                                <h1>{candidate.name}</h1>
                                <h2>{candidate.branch}</h2>
                            </div>
                            <div className="textinfo">
                                <p>MIS: {candidate.mis}</p>
                                <p>Year : {candidate.year}</p>
                                <p>CGPA : {candidate.cgpa}</p>
                                <p>Special Achievements: {candidate.achievements.join(', ')}</p>
                            </div>
                            <div className="followLinks">
                                <a href={candidate.mail_link}><img src={gmailPic} alt="Gmail" /></a>
                                <a href={candidate.linkedin_link}><img src={linkedInPic} alt="LinkedIn" /></a>
                                <a href={candidate.twitter_link}><img src={twitterPic} alt="Twitter" /></a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CandidateProfile;
