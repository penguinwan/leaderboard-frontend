import { RESULT_PATH } from './env'
import axios from "axios";
import React, { Component } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { AppBar, Toolbar, Typography, Box, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import StarOutlined from '@material-ui/icons/StarOutlined';
import StarRateOutlinedIcon from '@material-ui/icons/StarRateOutlined';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rank: [],
      isError: false,
      errorMessage: null
    };
  }

  componentDidMount() {
    axios.get(
      `${RESULT_PATH}/leaderboard`, {}
    ).then((response) => {
      this.setState({
        rank: response.data.rank,
        isError: false,
        errorMessage: null
      });
    }).catch((error) => {
      let errorMessage = 'Internal server error.'
      if (error.response.status === 403) {
        errorMessage = 'You have submitted answer before.'
      }
      this.setState({
        ...this.state,
        isError: true,
        errorMessage
      })
    })
  }
  render() {
    let result;
    if (this.state.isError) {
      result = <Alert severity="error">{this.state.errorMessage}</Alert>;
    } else if (this.state.rank.length > 0) {
      let index = 0;
      const participants = this.state.rank.map(({ nickname, total, score, response_time }) => {
        const scoreTxt = `[Score: ${score}/${total}] [ResponseTime: ${response_time/1000} second(s)]`;
        if(index === 0) {
          index++;
          return (<ListItem><ListItemAvatar><Avatar><StarOutlined color="secondary"/></Avatar></ListItemAvatar><ListItemText primary={nickname} secondary={scoreTxt} /></ListItem>);
        } else {
          return (<ListItem><ListItemAvatar><Avatar><StarRateOutlinedIcon/></Avatar></ListItemAvatar><ListItemText primary={nickname} secondary={scoreTxt} /></ListItem>);
        }
      });
      result = <List>{participants}</List>
    }
    return (
      <div>
        <AppBar position="static">
        <Toolbar>
        <Typography variant="h6">Leaderboard</Typography>
        </Toolbar>
        </AppBar>
        <Box textAlign="left" boxShadow={1} p={2} b={3}><Paper elevation={3}>{result}</Paper></Box>
        </div>
    );
  }
}

export default App;
