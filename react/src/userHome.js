import './userHome.css';
import { Link } from 'react-router-dom';
import Voting from './voting';
import CandidateProfile from './candidateProfile';

const UserHome = () => {

    

    return ( 

        <div className="page1">
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
            <div className="uTitle">
                <h1>Welome  to  <br></br>COEP  e-Voting <br></br>Portal</h1>
            </div>
            <div className="uText">
                <p id="vline"></p>
                <p>Voting for elections , now simplified <br></br>and more faster using e-voting portal</p>
            </div>
            <div className="uButton">
            <Link to="/Voting"><button>Vote Now</button></Link>
            </div>
        </div>


     );
}
 
export default UserHome;