import './addCdForm.css';
import { useState } from 'react';
import AdminNavbar from './admin_navbar';

const AddCd = () => {
    const [name, setName] = useState('');
    const [mis, setMis] = useState('');
    const [year, setYear] = useState('1');
    const [branch, setBranch] = useState('comp');
    const [cgpa, setCgpa] = useState('');
    const [ach, setAchievements] = useState('');
    const [link, setLink] = useState('');
    const [gmailLink, setGmailLink] = useState('');
    const [twitterLink, setTwitterLink] = useState('');
    const [photo, setPhoto] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('mis', mis);
        formData.append('year', year);
        formData.append('branch', branch);
        formData.append('cgpa', cgpa);
        formData.append('ach', ach);
        formData.append('link', link);
        formData.append('gmailLink', gmailLink);
        formData.append('twitterLink', twitterLink);
        formData.append('photo', photo); // Change here

        try {
            const response = await fetch('/add_candidate', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                console.log('Candidate added successfully');
                alert('Candidate added successfully');
                // Optionally, you can reset the form fields here
            } else {
                console.error('Failed to add candidate');
            }
        } catch (error) {
            console.error('Error:', error);
        }

    };
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file); // Change here
    };

    return (
        <div className="addCdFormPage">
            <div className="abc">
                <AdminNavbar></AdminNavbar>

            </div>
            <div className="titlebar">


                <div className="wrap">
                    <div className="infoForm">
                        <h1>Add a new Candidate</h1>
                        <h2>___________________</h2>
                        <h3>Add information about the candidate here</h3>
                    </div>
                    <div className="cdForm">
                        <div className="innForm">
                            <form onSubmit={handleSubmit}>

                                <label>Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} />

                                <label>MIS</label>
                                <input
                                    type="number"
                                    required
                                    value={mis}
                                    onChange={(e) => setMis(e.target.value)} />

                                <label>Year</label>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}>
                                    <option value='1'>1st year</option>
                                    <option value='2'>2nd year</option>
                                    <option value='3'>3rd year</option>
                                    <option value='4'>4th year</option>
                                </select>

                                <label>Branch</label>
                                <select
                                    value={branch}
                                    onChange={(e) => setBranch(e.target.value)}>
                                    <option value='Computer Engineering'>Computer Engineering</option>
                                    <option value='Electronics and Communication Engineering'>Electronics and Communication Engineering</option>
                                    <option value='Electrical Engineering'>Electrical Engineering</option>
                                    <option value='INstrumentation and Control Engineering'>INstrumentation and Control Engineering</option>
                                    <option value='Mechanical Engineering'>Mechanical Engineering</option>
                                    <option value='Civil Engineering'>Civil Engineering</option>
                                    <option value='Manufacturing Engineering'>Manufacturing Engineering</option>
                                    <option value='Metallurgy Engineering'>Metallurgy Engineering</option>

                                </select>

                                <label>CGPA</label>
                                <input

                                    type="number"
                                    required
                                    value={cgpa}
                                    onChange={(e) => setCgpa(e.target.value)} />

                                <label>Achievements</label>
                                <textarea
                                    required
                                    value={ach}
                                    onChange={(e) => setAchievements(e.target.value)}></textarea>


                                <label>LinkedIn Link</label>
                                <input
                                    type="url"
                                    required
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                                <label>Gmail Link</label>
                                <input
                                    type="url"
                                    required
                                    value={gmailLink}
                                    onChange={(e) => setGmailLink(e.target.value)}
                                />
                                <label>Twitter Account Link</label>
                                <input
                                    type="url"
                                    required
                                    value={twitterLink}
                                    onChange={(e) => setTwitterLink(e.target.value)}
                                />
                                <label>Upload Photo (JPEG only)</label>
                                <input
                                    type="file"
                                    accept="image/jpeg"
                                    onChange={handlePhotoChange}
                                />
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
            </div>
            );
};

            export default AddCd;

