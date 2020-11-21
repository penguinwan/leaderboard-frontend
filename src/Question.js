import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, Box, Input, Button, Snackbar, ListItem, ListItemText, ListItemAvatar, Avatar, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import { QUESTION_PATH } from './env'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Question extends Component {
  constructor(props) {
    super(props);
    this.handleCorrectChange = this.handleCorrectChange.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.handleQuestionSubmit = this.handleQuestionSubmit.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.state = {
      question: '',
      correct: null,
      answers: {
        'a': '',
        'b': '',
        'c': '',
        'd': ''
      },
      isSuccess: false,
      isError: false
    };
  }
  handleQuestionChange(event) {
    this.setState({
      ...this.state,
      question: event.target.value
    })
  }
  handleCorrectChange(event) {
    this.setState({
      ...this.state,
      correct: event.target.value
    })
  }
  handleAnswerChange(event) {
    console.log('handleAnswerChange')
    const key = event.target.id;
    const value = event.target.value;
    this.setState({
      ...this.state,
      answers: Object.assign(this.state.answers, { [key]: value })
    })
  }
  handleQuestionSubmit() {
    const data = {
      question: this.state.question,
      answers: Object.keys(this.state.answers).map((key) => { return {key: key, value: this.state.answers[key]} } ),
      correct: this.state.correct
    }
    console.log(JSON.stringify(data));
    axios.post(
      `${QUESTION_PATH}/questions`, 
      data
    ).then((response) => {
      console.log('done');
      this.setState({
        question: '',
        correct: null,
        answers: {
          'a': '',
          'b': '',
          'c': '',
          'd': ''
        },
        isSuccess: true,
        isError: false
      });
    }).catch((error) => {
      this.setState({
        ...this.state,
        isSuccess: false,
        isError: true
      })
    })
  }
  handleSnackbarClose() {
    this.setState({
      ...this.state,
      isSuccess: false,
      isError: false
    })
  }
  render() {
    return(
      <div>
        <AppBar position="static">
        <Toolbar>
        <Typography variant="h6">Insert Question</Typography>
        </Toolbar>
        </AppBar>
        <Box textAlign="left" boxShadow={1} p={2} b={3}>
        <Input label="Question" multiline rowMax={4} placeholder="Type your question here" value={this.state.question} onChange={this.handleQuestionChange} fullWidth variant="outlined"/>
        <Input id="a" key="a" label="Answer A" value={this.state.answers.a} variant="outlined" onChange={this.handleAnswerChange}/>
        <Input id="b" label="Answer B" value={this.state.answers.b} variant="outlined" onChange={this.handleAnswerChange}/>
        <Input id="c" label="Answer C" value={this.state.answers.c} variant="outlined" onChange={this.handleAnswerChange}/>
        <Input id="d" label="Answer D" value={this.state.answers.d} variant="outlined" onChange={this.handleAnswerChange}/>
        <RadioGroup row name="correct" value={this.state.correct} onChange={this.handleCorrectChange}>
        <FormControlLabel key="a" value="a" control={<Radio />} label="A" />
        <FormControlLabel key="b" value="b" control={<Radio />} label="B" />
        <FormControlLabel key="c" value="c" control={<Radio />} label="C" />
        <FormControlLabel key="d" value="d" control={<Radio />} label="D" />
        </RadioGroup>
        </Box>   
        <Button onClick={this.handleQuestionSubmit} variant="contained" color="primary">Submit</Button>
        <Snackbar open={this.state.isSuccess} autoHideDuration={2000} onClose={this.handleSnackbarClose}>
        <Alert severity="success">Success!</Alert>
        </Snackbar>
        <Snackbar open={this.state.isError} autoHideDuration={2000} onClose={this.handleSnackbarClose}>
        <Alert severity="error">Error! Please try again later.</Alert>
        </Snackbar>
      </div>
    );
  }
}

export default Question;
