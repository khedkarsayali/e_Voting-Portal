/* import './signup.css'; 
import {useState} from "react";
import { LuUser2 } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import {Link} from 'react-router-dom';

const SignUp = () => {

    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [con_password,setPassword2]=useState('');
    const [passwordsMatch,setPasswordsMatch] = useState(true);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        // Reset the error when the user types in the password field
        setPasswordsMatch(true);
      };

      const handleConfirmPasswordChange = (e) => {
        setPassword2(e.target.value);
        // Reset the error when the user types in the password field
        setPasswordsMatch(true);
      };
      
    
    const handleSubmit=(e)=>{
        e.preventDefault()  ; 
               //doesnt let page refresh on submitting
    
        // Check if passwords match
    if (password === con_password) {
        // Passwords match, you can proceed with your form submission logic
        alert('SignUp Successful');
      } else {
        // Passwords do not match, provide feedback to the user
        setPasswordsMatch(false);
      }
    }
    return (  
        <div className="login_page">

        
        <div className="outer_signup2">
            
            <h2 className="head2">Sign Up</h2>
            
            <form className="login2" onSubmit={handleSubmit}>
                <div className="input-container2">
                
                <input className="login_ip2"
                    type="number"
                    placeholder=" MIS "
                    required
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                />
                <LuUser2 className="icon2" />
                </div>
                
                <div className="input-container2">
                <input className="login_ip2"
                    type="email"
                    placeholder="  Email"
                    required
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <MdOutlineEmail className="icon2" />

                </div>
                
                <div className="input-container2">
                <input className="login_ip2"
                    type="password"
                    placeholder="  password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                />
                <RiLockPasswordLine className="icon2" />

                </div>

                <div className="input-container2">
                <input className="login_ip2"
                    type="password"
                    placeholder="  Confirm password"
                    required
                    value={con_password}
                    onChange={handleConfirmPasswordChange}
                />
                <RiLockPasswordLine className="icon2" />


                </div>
                {passwordsMatch ? null : <p style={{ color: 'red' }}>Passwords do not match</p>}
                <button className="login_btn2" type="submit">SignUp</button>
                
            </form>
            <div className="already2">
                <Link to="/"><p>Already a user? Login </p></Link>
                
            </div>
        </div>

        </div>
        


    );
}
 
export default SignUp; */

import './signup.css'; 
import { useState } from "react";
import { LuUser2 } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link } from 'react-router-dom';

const SignUp = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [con_password, setPassword2] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [error, setError] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        // Reset the error when the user types in the password field
        setPasswordsMatch(true);
    };

    const handleConfirmPasswordChange = (e) => {
        setPassword2(e.target.value);
        // Reset the error when the user types in the password field
        setPasswordsMatch(true);
    };
      
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== con_password) {
            setPasswordsMatch(false);
            return;
        }

        // Send registration data to Flask backend
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mis: username,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            alert(data.message); // Registration successful
            // Reset form fields
            setUsername('');
            setEmail('');
            setPassword('');
            setPassword2('');
            setPasswordsMatch(true);
            setError('');
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again later.');
        }
    }

    return (  
        <div className="login_page">
            <div className="outer_signup2">
                <h2 className="head2">Sign Up</h2>
                <form className="login2" onSubmit={handleSubmit}>
                    <div className="input-container2">
                        <input className="login_ip2"
                            type="number"
                            placeholder=" MIS "
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <LuUser2 className="icon2" />
                    </div>
                    
                    <div className="input-container2">
                        <input className="login_ip2"
                            type="email"
                            placeholder="  Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <MdOutlineEmail className="icon2" />
                    </div>
                    
                    <div className="input-container2">
                        <input className="login_ip2"
                            type="password"
                            placeholder="  password"
                            required
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <RiLockPasswordLine className="icon2" />
                    </div>

                    <div className="input-container2">
                        <input className="login_ip2"
                            type="password"
                            placeholder="  Confirm password"
                            required
                            value={con_password}
                            onChange={handleConfirmPasswordChange}
                        />
                        <RiLockPasswordLine className="icon2" />
                    </div>
                    
                    {passwordsMatch ? null : <p style={{ color: 'red' }}>Passwords do not match</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button className="login_btn2" type="submit">SignUp</button>
                </form>
                <div className="already2">
                    <Link to="/"><p>Already a user? Login </p></Link>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
