import { PATH } from './env'
import axios from "axios";
import React, { Component } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { AppBar, Toolbar, Typography, Box, TextField, Button, Snackbar } from '@material-ui/core';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class LockQuestion extends Component {
  constructor(props) {
    super(props);
    this.handleLockClicked = this.handleLockClicked.bind(this);
    this.handleQuestionCodeUpdate = this.handleQuestionCodeUpdate.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.state = {
      isSuccess: false,
      isError: false,
    };
  }

  handleQuestionCodeUpdate(event) {
    this.setState({
      ...this.state,
      questionCode: event.target.value
    })
  }

  handleLockClicked() {
    axios.put(
      `${PATH}/batches/${this.state.questionCode}`,
      {}
    ).then((response) => {
      this.setState({
        questionCode: '',
        isSuccess: true,
        isError: false,
        errorMessage: null
      });
    }).catch((error) => {
      console.log(error);
      this.setState({
        ...this.state,
        isSuccess: false,
        isError: true,
        errorMessage: 'Error! Please try again later.'
      })
    })
  }

  handleSnackbarClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      ...this.state,
      isSuccess: false,
      isError: false
    })
  }

  render() {
    return (
      <div>
        <AppBar position="static">
        <Toolbar>
        <Typography variant="h6">Lock Question</Typography>
        </Toolbar>
        </AppBar>
        <Box textAlign="left" boxShadow={4} p={4} b={4}>
        <TextField id="standard-basic" autoComplete="off" label="Key" value={this.state.questionCode} onChange={this.handleQuestionCodeUpdate}/>
        <Button onClick={this.handleLockClicked} variant="contained" color="primary">Lock</Button>
        </Box>
        <Snackbar open={this.state.isSuccess} autoHideDuration={2000} onClose={this.handleSnackbarClose}>
          <Alert onClose={this.handleSnackbarClose} severity="success">Success!</Alert>
        </Snackbar>
        <Snackbar open={this.state.isError} autoHideDuration={2000} onClose={this.handleSnackbarClose}>
          <Alert onClose={this.handleSnackbarClose} severity="error">{this.state.errorMessage}</Alert>
        </Snackbar>
        </div>
    );
  }
}

export default LockQuestion;
