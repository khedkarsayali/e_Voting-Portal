
import './voting.css'
import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfirmationModal from "./ConfirmationModal";
import { FaLinkedin, FaTwitterSquare } from "react-icons/fa";
import { GrLinkNext } from "react-icons/gr";
import { SiGmail } from "react-icons/si";
import { FaTwitter } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Voting = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [userMis, setUserMis] = useState(null);
  const [votingEnabled, setVotingEnabled] = useState(true);

  useEffect(() => {
    fetchCandidates();
    fetchUserMis();
    checkVotingStatus();
  }, []);

  const checkVotingStatus = async () => {
    try {
      const response = await axios.get("/admin/get_voting_status");
      if (response.data && response.data.votingEnabled === false) {
        alert("Voting is currently disabled. Please try again later.");
        setVotingEnabled(false);
      }
    } catch (error) {
      console.error("Error checking voting status:", error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("/api/candidates");
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    }
  };

  const fetchUserMis = async () => {
    try {
      const response = await fetch("/get_user_mis", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUserMis(data.mis);
      } else {
        console.error("Failed to fetch user MIS:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user MIS:", error);
    }
  };

  const handleConfirmation = async (confirmed) => {
    if (confirmed && selectedCandidate && !hasVoted) {
      try {
        const response = await axios.post("/vote", {
          candidate_id: selectedCandidate.id,
          user_mis: userMis,
        });
        if (response.status === 200) {
          alert(`Voted for ${selectedCandidate.name} successfully`);
          setHasVoted(true);
          fetchCandidates(); // Update candidate list after voting
        } else {
          alert("Failed to cast vote. Please try again later.");
        }
      } catch (error) {
        console.error("Error casting vote:", error);
        alert("Failed to cast vote. Please try again later.");
      }
    }

    setSelectedCandidate(null);
    setConfirmationModal(false);
  };

  const handleVoteClick = (candidate) => {
    if (!votingEnabled) {
      alert("Voting is currently disabled. Please try again later.");
    } else if (hasVoted) {
      alert("You have already voted. You cannot vote multiple times!");
    } else {
      setSelectedCandidate(candidate);
      setConfirmationModal(true);
    }
  };

  return (
    <div className="votepage">
      {/* Your navigation bar and other components */}
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
      <div className="ballotTitle">
        <h1>Voting Ballot</h1>
      </div>
      <div className="votingList">
        <div className="cdCard">
          {candidates.map((candidate) => (
            <div className="cdimg" key={candidate.id}>
              <div className="candImg">
                {candidate.photo && (
                  <img
                  src={`http://localhost:5000/static/${candidate.photo}`}
                    alt="Profile"
                  />
                )}
              </div>
              <div className="candInfo">
                <h4>{candidate.name}</h4>
                <p>{candidate.branch}</p>
              </div>
              {/* Render candidate details */}
              <div className="voteButton">
                <button onClick={() => handleVoteClick(candidate)}>Vote</button>
              </div>
              {/* Other candidate information */}
              <div className="connectLinks">
                <a href={candidate.mail_link}>
                  <SiGmail />
                </a>
                <a href={candidate.linkedin_link}>
                  <FaLinkedin />
                </a>
                <a href={candidate.twitter_link}>
                  <FaTwitter />
                </a>
                <div className="moreinfo">
                  <Link to="./CandidateProfile">
                    More info <GrLinkNext />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {confirmationModal && (
        <ConfirmationModal
          candidate={selectedCandidate}
          onConfirm={handleConfirmation}
        />
      )}
    </div>
  );
};

export default Voting;
