const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors());
app.use(express.json())
const port = 8080

app.get('/leaderboard', async (req, res) => {
  res.send({
    rank: [
      { session_id: 'session2', nickname: 'nickname2', total: 0, score: 0, response_time: 3000 },
      { session_id: 'session1', nickname: 'nickname1', total: 0, score: 0, response_time: 0 }
    ]
  });
})

app.post('/questions', async (req, res) => {
  console.log('data', JSON.stringify(req.body));
  res.sendStatus(200);
  // res.sendStatus(500);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})