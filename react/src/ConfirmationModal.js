import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = (props) => {
    const { candidate, onConfirm } = props;
    return (
        <div className="confirmationModal">
            <div className="confirmationBox">
            <p>Are you sure you want to vote for {candidate && candidate.name}?</p>
            <div className="buttonConfirm">
            <button onClick={() => onConfirm(true)}>Yes</button>
            <button onClick={() => onConfirm(false)}>No</button>
                
            </div>
            

            </div>
            
        </div>
    );
};

export default ConfirmationModal;
