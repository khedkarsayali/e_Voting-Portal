import AdminNavbar from './admin_navbar'
import './admin_home.css'
import  AdCandidateList from './admin_candidatelist'



const Ad_home = () => {
    return (
        <div className="admin_home">
                <div className="cont1">
                <AdminNavbar></AdminNavbar>

                </div>

                <div className="cont2">
                <AdCandidateList></AdCandidateList>


                </div>
                
                
        </div>
     );
}
 
export default Ad_home;