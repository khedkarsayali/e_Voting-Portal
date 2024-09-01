import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EditCd = () => {
    const { candidateId } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        mis: '',
        year: '1',
        branch: 'comp',
        cgpa: '',
        achievements: '',
        link: '',
        gmailLink: '',
        twitterLink: '',
        photo: ''
    });

    useEffect(() => {
        fetch(`/api/candidates/${candidateId}`)
            .then(response => response.json())
            .then(data => {
                setCandidate(data);
                setFormData({
                    name: data.name,
                    mis: data.mis,
                    year: data.year,
                    branch: data.branch,
                    cgpa: data.cgpa,
                    achievements: data.achievements.join(', '),
                    link: data.linkedin_link,
                    gmailLink: data.mail_link,
                    twitterLink: data.twitter_link,
                    photo: data.photo
                });
            })
            .catch(error => console.error('Error fetching candidate data:', error));
    }, [candidateId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/edit_candidate/${candidateId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log('Candidate updated successfully');
                // Optionally, redirect to another page or show a success message
            } else {
                console.error('Failed to update candidate');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, photo: file });
    };

    if (!candidate) {
        return <div>Loading...</div>;
    }

    return (
        <div className="editCdFormPage">
            <div className="wrap">
                <div className="infoForm">
                    <h1>Edit Candidate</h1>
                    <h2>___________________</h2>
                    <h3>Edit information about the candidate here</h3>
                </div>
                <div className="cdForm">
                    <div className="innForm">
                        <form onSubmit={handleSubmit}>
                            {/* Input fields for editing candidate data */}
                            {/* Name */}
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            {/* MIS */}
                            <label>MIS</label>
                            <input
                                type="number"
                                name="mis"
                                value={formData.mis}
                                onChange={handleInputChange}
                                required
                            />
                            {/* Year */}
                            <label>Year</label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                            >
                                <option value='1'>1st year</option>
                                <option value='2'>2nd year</option>
                                <option value='3'>3rd year</option>
                                <option value='4'>4th year</option>
                            </select>
                            {/* Branch */}
                            <label>Branch</label>
                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={handleInputChange}
                            >
                                <option value='Computer Engineering'>Computer Engineering</option>
                                <option value='Electronics and Communication Engineering'>Electronics and Communication Engineering</option>
                                <option value='Electrical Engineering'>Electrical Engineering</option>
                                <option value='INstrumentation and Control Engineering'>INstrumentation and Control Engineering</option>
                                <option value='Mechanical Engineering'>Mechanical Engineering</option>
                                <option value='Civil Engineering'>Civil Engineering</option>
                                <option value='Manufacturing Engineering'>Manufacturing Engineering</option>
                                <option value='Metallurgy Engineering'>Metallurgy Engineering</option>
                            </select>
                            {/* CGPA */}
                            <label>CGPA</label>
                            <input
                                type="number"
                                name="cgpa"
                                value={formData.cgpa}
                                onChange={handleInputChange}
                                required
                            />
                            {/* Achievements */}
                            <label>Achievements</label>
                            <textarea
                                name="achievements"
                                value={formData.achievements}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                            {/* LinkedIn Link */}
                            <label>LinkedIn Link</label>
                            <input
                                type="url"
                                name="link"
                                value={formData.link}
                                onChange={handleInputChange}
                                required
                            />
                            {/* Gmail Link */}
                            <label>Gmail Link</label>
                            <input
                                type="url"
                                name="gmailLink"
                                value={formData.gmailLink}
                                onChange={handleInputChange}
                                required
                            />
                            {/* Twitter Link */}
                            <label>Twitter Account Link</label>
                            <input
                                type="url"
                                name="twitterLink"
                                value={formData.twitterLink}
                                onChange={handleInputChange}
                                required
                            />
                            {/* Upload Photo */}
                            <label>Upload Photo (JPEG only)</label>
                            <input
                                type="file"
                                accept="image/jpeg"
                                onChange={handlePhotoChange}
                            />
                            {/* Submit button */}
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCd;
