const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// this is  'database' just an array in memory
let jobs = [];

// CREATE a job
app.post('/jobs', (req, res) => {
  const newJob = {
    id: uuidv4(),           // random unique ID
    status: 'pending',      // always starts as pending
    startTime: new Date().toISOString(),
    endTime: null           // not finished yet
  };
  jobs.push(newJob);        // add to array
  res.status(201).json(newJob);
});

// GET all jobs
app.get('/jobs', (req, res) => {
  const { status } = req.query;
  if (status) {
    return res.json(jobs.filter(j => j.status === status));
  }
  res.json(jobs);
});

// UPDATE a job's status
app.patch('/job/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  job.status = req.body.status;
  if (job.status === 'success' || job.status === 'failed') {
    job.endTime = new Date().toISOString();
  }
  res.json(job);
});

// AUTO SIMULATION every 5 seconds, jobs move forward automatically
setInterval(() => {
  jobs.forEach(job => {
    if (job.status === 'pending') {
      job.status = 'running';
    } else if (job.status === 'running') {
      job.status = Math.random() < 0.7 ? 'success' : 'failed';
      job.endTime = new Date().toISOString();
    }
  });
}, 5000);

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});