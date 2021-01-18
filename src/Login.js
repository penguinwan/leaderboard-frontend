import React, { Component } from 'react';
import { Box, Input, Button, Grid } from '@material-ui/core';
import { USERNAME, PASSWORD } from './env'

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.state = {
      username: '',
      password: ''
    };
  }
  handleUsernameChange(event) {
    this.setState({
      ...this.state,
      username: event.target.value
    })
  }
  handlePasswordChange(event) {
    this.setState({
      ...this.state,
      password: event.target.value
    })
  }
  handleLoginSubmit() {
    if(this.state.username === USERNAME && this.state.password === PASSWORD) {
      const isSuccessful = true;
      this.props.handleLoginSubmit(isSuccessful);
    }
  }
  isSuccessful() {
    return this.state.isSuccessful;
  }
  render() {
    return (
        <Box boxShadow={4} p={4} b={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Input required="true" label="Username" placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange} variant="outlined" autoComplete="off"/>
            </Grid>
            <Grid item xs={12}>
              <Input required="true" label="Password" placeholder="Password" type="password" value={this.state.password} onChange={this.handlePasswordChange} variant="outlined" autoComplete="off"/>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={this.handleLoginSubmit} variant="contained" color="primary">Login</Button>
            </Grid>
            </Grid>
        </Box>
    );
  }
}

export default Login;
