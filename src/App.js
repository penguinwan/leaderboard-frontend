import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import StarOutlined from '@material-ui/icons/StarOutlined';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AddIcon from '@material-ui/icons/Add';
import LockIcon from '@material-ui/icons/Lock';
import Leaderboard from './Leaderboard';
import Question from './Question';
import LockQuestion from './LockQuestion';
import Login from './Login';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleBottomNavigationChanged = this.handleBottomNavigationChanged.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.state = {
      showLeaderboard: false,
      showQuestionBank: false,
      showLockQuestion: false,
      showMenu: false,
      showLogin: true
    }
  }

  handleLoginSubmit(isSuccessful) {
    if(isSuccessful) {
      this.setState({
        ...this.state,
        showLogin: false,
        showMenu: true
      })
    }
  }
  
  handleBottomNavigationChanged(event, newValue) {
    if (newValue === 0) {
      this.setState({
        ...this.state,
        showLeaderboard: true,
        showQuestionBank: false,
        showLockQuestion: false
      });
    } else if (newValue === 1) {
      this.setState({
        ...this.state,
        showLeaderboard: false,
        showQuestionBank: true,
        showLockQuestion: false
      })
    } else if (newValue === 2) {
      this.setState({
        ...this.state,
        showLeaderboard: false,
        showQuestionBank: false,
        showLockQuestion: true
      })
    }
  }

  render() {
    return (
      <div>
        { this.state.showLeaderboard && <Leaderboard />}
        { this.state.showQuestionBank && <Question />}
        { this.state.showLockQuestion && <LockQuestion />}
        { this.state.showLogin && <Login handleLoginSubmit={this.handleLoginSubmit}/>}
        { this.state.showMenu && 
          <Box boxShadow={2} p={1} b={1}>
            <BottomNavigation value={this.bottomNavigationValue} onChange={this.handleBottomNavigationChanged} showLabels>
              <BottomNavigationAction label="Leaderboard" icon={<StarOutlined />} />
              <BottomNavigationAction label="Question Bank" icon={<AddIcon />} />
              <BottomNavigationAction label="Lock Question" icon={<LockIcon />} />
            </BottomNavigation>
          </Box>
        }
      </div>
    );
  }
}

export default App;
