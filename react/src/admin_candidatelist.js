import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from 'react-router-dom';

const AdCandidateList = () => {
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

    const deleteCandidate = async (id) => {
        try {
            await axios.delete(`/delete_candidate/${id}`);
            fetchCandidates();
        } catch (error) {
            console.error('Error deleting candidate:', error);
        }
    };

    return (
        <div className="candPage">
            <div className="cNavbar">
                <h2 id="ctitle">Candidate List</h2>
                <div className="cfun">
                    <div className="addCand">
                        <Link to="/addCdForm"><button id="addCadBut">+ Add Candidate</button></Link>
                    </div>
                </div>
            </div>
            <div className="cList">
                {candidates.map((candidate) => (
                    <div className="prevCan" key={candidate.id}>
                        <div className="canImg">
                            
                            {candidate.photo && (
                                <img src={`http://localhost:5000/static/${candidate.photo}`} alt={candidate.name} />
                            )}
                        </div>
                        <div className="canInfo">
                            <h4>Name : {candidate.name}</h4>
                            <p>Branch : {candidate.branch}</p>
                            <p>Year : {candidate.year}</p>
                            <p>CGPA : {candidate.cgpa}</p>
                            <p>Special Achievements : {candidate.achievements.join(', ')} </p>
                        </div>
                        <div className="canEdit">
                            
                            <button id="canDelBut" onClick={() => deleteCandidate(candidate.id)}><MdDelete /> Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdCandidateList;
