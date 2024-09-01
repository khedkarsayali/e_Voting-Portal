import {Link} from 'react-router-dom';
import { FaUsers } from "react-icons/fa6";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { RiUserSettingsLine } from "react-icons/ri";
import { MdLogin } from "react-icons/md";



const AdminNavbar = () => {
    return ( 
        <div className="adnav">
            <div className="adtitle">
                <h2>COEP e-voting portal</h2>
            </div>
            <div className="adlinks">
            <div className="box1">
            <Link to='./Ad_home'><FaUsers/>     Candidates</Link>

            </div>
            <div className="box2">
            <Link to='./AdminResult'><TbDeviceDesktopAnalytics />   Result</Link>

            </div>
            <div className="box3">
            <Link to='./addVoters'><RiUserSettingsLine />Voters</Link>


            </div>

            <div className="box4">
            <Link to='./Login2'><MdLogin /> Login</Link>
            

            </div>
            
           

            </div>
        </div>
        
     );
}
 
export default AdminNavbar;