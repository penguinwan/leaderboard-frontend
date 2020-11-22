import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, Box, Input, Button, Snackbar, List, ListItem, Grid, Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
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
    const key = event.target.id;
    const value = event.target.value;
    this.setState({
      ...this.state,
      answers: Object.assign(this.state.answers, { [key]: value })
    })
  }
  validation() {
    let required = [];
    if(this.state.question.length === 0) {
      required.push('Question');
    }
    if(this.state.answers.a.length === 0) {
      required.push('Answer for A');
    }
    if(this.state.answers.b.length === 0) {
      required.push('Answer for B');
    }
    if(this.state.answers.c.length === 0) {
      required.push('Answer for C');
    }
    if(this.state.answers.d.length === 0) {
      required.push('Answer for D');
    }
    if(!this.state.correct) {
      required.push('Correct answer')
    }

    if(required.length > 0) {
      return { isOk: false, required};
    } else {
      return { isOk: true };
    }
  }
  handleQuestionSubmit() {
    const { isOk, required } = this.validation();
    if(!isOk) {
      this.setState({
        ...this.state,
        isSuccess: false,
        isError: true,
        errorMessage: `Please complete these fields. [${required}]`
      });
    } else {
      const data = {
        question: this.state.question,
        answers: Object.keys(this.state.answers).map((key) => { return { key: key, value: this.state.answers[key] } }),
        correct: this.state.correct
      }
      axios.put(
        `${QUESTION_PATH}/batches`,
        data
      ).then((response) => {
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
          isError: false,
          errorMessage: null
        });
      }).catch((error) => {
        this.setState({
          ...this.state,
          isSuccess: false,
          isError: true,
          errorMessage: 'Error! Please try again later.'
        })
      })
    }
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
            <Typography variant="h6">Insert Question</Typography>
          </Toolbar>
        </AppBar>

        <Box boxShadow={4} p={4} b={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Question</Typography>
              <Input required="true" label="Question" multiline rowMax={4} placeholder="Type your question here" value={this.state.question} onChange={this.handleQuestionChange} fullWidth variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Answer</Typography>
              <div>
                <List>
                  <ListItem>A&nbsp;<Input id="a" key="a" label="Answer A" value={this.state.answers.a} variant="outlined" onChange={this.handleAnswerChange} /></ListItem>
                  <ListItem>B&nbsp;<Input id="b" key="b" label="Answer B" value={this.state.answers.b} variant="outlined" onChange={this.handleAnswerChange} /></ListItem>
                  <ListItem>C&nbsp;<Input id="c" key="c" label="Answer C" value={this.state.answers.c} variant="outlined" onChange={this.handleAnswerChange} /></ListItem>
                  <ListItem>D&nbsp;<Input id="d" key="d" label="Answer D" value={this.state.answers.d} variant="outlined" onChange={this.handleAnswerChange} /></ListItem>
                </List>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Which answer is correct?</Typography>
              <RadioGroup row name="correct" value={this.state.correct} onChange={this.handleCorrectChange}>
                <FormControlLabel key="a" value="a" control={<Radio />} label="A" />
                <FormControlLabel key="b" value="b" control={<Radio />} label="B" />
                <FormControlLabel key="c" value="c" control={<Radio />} label="C" />
                <FormControlLabel key="d" value="d" control={<Radio />} label="D" />
              </RadioGroup>
              <Button onClick={this.handleQuestionSubmit} variant="contained" color="primary">Submit</Button>
            </Grid>
          </Grid>
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

export default Question;
