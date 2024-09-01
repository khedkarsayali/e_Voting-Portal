import React from 'react';
import './App.css';
import Login1 from './login1';   //user login
import SignUp from './Signup';
import Login2 from './admin_login';
import Ad_home from './admin_home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CandidateProfile from './candidateProfile';
import Voting from './voting'
import UserResult from './userResult';
import UserHome from './userHome';
import LoginToggle from './LoginToggle';
import AddCd from './addCdForm';
import AddVoter from './addVoters';
import AdminResult from './adminResult';
import EditCd from './edit_candidate';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/Signup'>
            <SignUp />
          </Route>
          <Route path='/Ad_home'>
            <Ad_home />
          </Route>
          <Route path='/CandidateProfile'>
            <CandidateProfile />
          </Route>
          <Route path='/Voting'>
            <Voting />
          </Route>
          <Route path='/Result'>
            <UserResult />
          </Route>
          <Route path='/Login2'>
            <Login2 />
          </Route>
          <Route path='/LoginToggle'>
            <LoginToggle />
          </Route>
          <Route path='/UserHome'>
            <UserHome/>
          </Route>
          <Route path='/addCdForm'>
            <AddCd/>
          </Route>
          <Route path='/addVoters'>
            <AddVoter/>
          </Route>
          <Route path='/adminResult'>
            <AdminResult/>
          </Route>
          <Route path='/editCand'>
            <EditCd/>
          </Route>
          
          <Route path='/'>
            {/* Default route, you may want to render your Login components here */}
            
            <Login1 />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
