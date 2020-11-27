import { RESULT_PATH } from './env'
import axios from "axios";
import React, { Component } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { AppBar, Toolbar, Typography, Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, FormControlLabel, Switch, Grid } from '@material-ui/core';
import StarOutlined from '@material-ui/icons/StarOutlined';
import StarRateOutlinedIcon from '@material-ui/icons/StarRateOutlined';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.refreshInterval = null;
    this.handleAutoRefreshChange = this.handleAutoRefreshChange.bind(this);
    this.fetchLeaderboard = this.fetchLeaderboard.bind(this);
    this.state = {
      rank: [],
      isError: false,
      errorMessage: null,
      isAutoRefreshChecked: false
    };
  }

  handleAutoRefreshChange(event) {
    if(event.target.checked) {
      this.refreshInterval = setInterval(() => {
        this.fetchLeaderboard();
      }, 6000)
    } else {
      clearInterval(this.refreshInterval);
    }
    
    this.setState({
      ...this.state,
      isAutoRefreshChecked: event.target.checked
    });
  }

  fetchLeaderboard() {
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

  componentDidMount() {
    this.fetchLeaderboard();
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
          <Grid container>
          <Grid item xs={6}>
          <Typography variant="h6">Leaderboard</Typography>
          </Grid>
          <Grid item xs={6}>
        <FormControlLabel
          control={
            <Switch checked={this.state.isAutoRefreshChecked} onChange={this.handleAutoRefreshChange} name="autorefresh" color="secondary"/>
          }
          label="Auto-refresh"/>
        </Grid>
        </Grid>
        </Toolbar>
        </AppBar>
        <Box textAlign="left" boxShadow={4} p={4} b={4}>{result}</Box>
        </div>
    );
  }
}

export default Leaderboard;
