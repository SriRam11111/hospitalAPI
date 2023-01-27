const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2'
const app = express()
const router = express.Router()
const bodyParser = require('body-parser');
mongoose.set('strictQuery', false);
// mongoose.connect(url)
// const con = mongoose.connection

// con.on('open',function(){
//     console.log('connected.....')
// })

mongoose.connect(url,{ useNewUrlParser: true },(err)=>{
    if(err){
    console.log(err)
}
else{
    console.log("successfully connected")
}})

app.use(bodyParser.json());



const Doctor = require('./models/doctormodels');
const Patient = require('./models/patientmodel')


app.get('/',(req,res)=>{
  res.send("welcome to doctor-patient api")
})
// Create a new doctor
app.post('/doctors', (req, res) => {
  console.log("post doctors")
  const doc = req.body
  const newDoctor=new Doctor(doc);
  newDoctor.save((err, doctor) => {
    if (err) {
      res.send(err);
    } else {
      res.json(doctor);
    }
  });
});

//create new patient
app.post('/patients', (req, res) => {
  console.log("post patients")
  // console.log("post patients",req.body)
  const newPatient = new Patient(req.body);
  newPatient.save((err, patient) => {
    if (err) {
      res.send(err);
    } else {
      res.json(patient);
    }
  });
});
// Get all doctors
app.get('/doctors', (req, res) => {
  console.log("get doctors")
  Doctor.find((err, doctors) => {
    if (err) {
      res.send(err);
    } else {
      res.json(doctors);
    }
  });
});

//get all patients
app.get('/patients', (req, res) => {
  console.log("get patients")
  Patient.find((err, patients) => {
    if (err) {
      res.send(err);
    } else {
      res.json(patients);
    }
  });
});

// Get a specific doctor by ID
app.get('/doctors/:id', (req, res) => {
  console.log("get doctor by id")
  Doctor.findById(req.params.id, (err, doctor) => {
    if (err) {
      res.send(err);
    } else {
      res.json(doctor);
    }
  });
});

// Get a specific patient by ID
app.get('/patients/:id', (req, res) => {
  console.log("get patients by id")
  Patient.findById(req.params.id, (err, patient) => {
    if (err) {
      res.send(err);
    } else {
      res.json(patient);
    }
  });
});

// Update a specific doctor by ID
//no need for , { new: true } if exist also no problem                 npm run server
app.put('/doctors/:id', (req, res) => {
  console.log("update doctor by id")
  console.log("req.params.id==",req.params.id)
  console.log("req.body==",req.body)
  Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doctor) => {
    if (err) {
      res.send(err);
    } else {
      res.json(doctor);
    }
  });
});

//update a specific patient by ID
app.put('/patients/:id', (req, res) => {
  console.log("update PARIENT by id")
  Patient.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, patient) => {
    if (err) {
      res.send(err);
    } else {
      res.json(patient);
    }
  });
});

// Delete a specific doctor by ID
app.delete('/doctors/:id', (req, res) => {
  console.log("delete doctor by id")
  Doctor.findByIdAndRemove(req.params.id, (err, doctor) => {
    if (err) {
      res.send(err);
    } else {
      res.json(doctor);
    }
  });
});

// Delete a specific patient by ID
app.delete('/patients/:id', (req, res) => {
  console.log("delete patient by id")
  Patient.findByIdAndRemove(req.params.id, (err, patient) => {
    if (err) {
      res.send(err);
    } else {
      res.json(patient);
    }
  });
});

//getting all patients under a doctor
app.get('/doctors/:doctorId/patients', async (req, res) => {
  try {
    const patients = await Patient.find({ doctor: req.params.doctorId });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});