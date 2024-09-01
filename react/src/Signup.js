import { useState } from "react";
import { LuUser2 } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, Redirect } from 'react-router-dom';
import './signup.css'

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [con_password, setPassword2] = useState('');
    const [otp, setOtp] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [error, setError] = useState('');
    const [SignupT, setSignupT] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordsMatch(true);
    };

    const handleConfirmPasswordChange = (e) => {
        setPassword2(e.target.value);
        setPasswordsMatch(true);
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otpSent) {
            // Check if email matches the email in the database before sending OTP
            try {
                const response = await fetch('/check_email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok) {
                    const { exists } = data;
                    if (exists) {
                        // Send OTP request
                        const otpResponse = await fetch('/send_otp', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ email })
                        });

                        const otpData = await otpResponse.json();

                        if (otpResponse.ok) {
                            setOtpSent(true);
                            setError('');
                        } else {
                            setError(otpData.message);
                        }
                    } else {
                        setError('Email not found in database. Please enter a valid email.');
                    }
                } else {
                    setError(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Something went wrong. Please try again later.');
            }
        } else {
            // Verify OTP and proceed with signup
            try {
                const response = await fetch('/verify_otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, otp })
                });

                const data = await response.json();

                if (response.ok) {
                    // OTP verification successful, proceed with signup
                    const signupResponse = await fetch('/register', {
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

                    const signupData = await signupResponse.json();

                    if (signupResponse.ok) {
                        alert(signupData.message); // Registration successful
                        setUsername('');
                        setEmail('');
                        setPassword('');
                        setPassword2('');
                        setOtp('');
                        setPasswordsMatch(true);
                        setError('');
                        setSignupT(true);
                    } else {
                        setError(signupData.message);
                    }
                } else {
                    setError(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Something went wrong. Please try again later.');
            }
        }
    };

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

                    {!otpSent && (
                        <div className="input-container2">
                            <button type="button" onClick={handleSubmit}>Send OTP</button>
                        </div>
                    )}

                    {otpSent && (
                        <div className="input-container2">
                            <input className="login_ip2"
                                type="text"
                                placeholder="Enter OTP"
                                required
                                value={otp}
                                onChange={handleOtpChange}
                            />
                        </div>
                    )}

                    <div className="input-container2">
                        <input className="login_ip2"
                            type="password"
                            placeholder="  Password"
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
                    <button className="login_btn2" type="submit">{otpSent ? 'Sign Up' : 'Send OTP'}</button>
                </form>
                {SignupT && <Redirect to="/" />}
                <div className="already2">
                    <Link to="/"><p>Already a user? Login </p></Link>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
