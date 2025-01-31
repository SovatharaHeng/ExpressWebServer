const express = require("express");
const app = express();
app.use(express.json());

let users = []; // Temporary in-memory storage

// 1. Registration Service (POST)
app.post("/register", (req, res) => {
    const user = req.body;
    users.push(user);
    res.status(201).json({ message: "User registered successfully", user });
});

// 2. Login Service (POST)
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ message: "Login successful", user });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://sovathara:cloudy123@cluster1.zkacv.mongodb.net/expressDB?retryWrites=true&w=majority&appName=Cluster1', 
{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch(err => {
  console.log('Error connecting to MongoDB:', err);
});

// Define the Employee schema
const employeeSchema = new mongoose.Schema({
  employeeid: { type: Number, required: true },
  firstname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salary: { type: Number, required: true }
});

// Create the Employee model
const Employee = mongoose.model('Employee', employeeSchema);

// 1. Registration Service (POST)
app.post('/reg', (req, res) => {
  const { employeeid, firstname, email, password, salary } = req.body;
  
  const newEmployee = new Employee({
    employeeid,
    firstname,
    email,
    password,
    salary
  });

  // Save the new employee to the database
  newEmployee.save()
    .then(() => res.status(200).send('Employee successfully registered'))
    .catch(err => res.status(500).send('Error saving employee: ' + err.message));
});

// 2. Login Service (POST)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  Employee.findOne({ email, password })
    .then(employee => {
      if (employee) {
        res.status(200).send('Login successful');
      } else {
        res.status(401).send('Invalid credentials');
      }
    })
    .catch(err => res.status(500).send('Error during login: ' + err.message));
});

// 3. Search Service (GET)
app.get('/search/:empid', (req, res) => {
  const empid = parseInt(req.params.empid);

  Employee.findOne({ employeeid: empid })
    .then(employee => {
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).send(`Employee with ID ${empid} not found`);
      }
    })
    .catch(err => res.status(500).send('Error fetching employee: ' + err.message));
});

// 4. Update Service (PUT)
app.put('/update/:empid', (req, res) => {
  const empid = parseInt(req.params.empid);
  const { password, salary } = req.body;

  Employee.findOneAndUpdate(
    { employeeid: empid },
    { $set: { password, salary } },
    { new: true }
  )
  .then(updatedEmployee => {
    if (updatedEmployee) {
      res.status(200).send('Employee details updated');
    } else {
      res.status(404).send('Employee not found');
    }
  })
  .catch(err => res.status(500).send('Error updating employee: ' + err.message));
});

// 5. Delete Service (DELETE)
app.delete('/del/:empid', (req, res) => {
  const empid = parseInt(req.params.empid);

  Employee.findOneAndDelete({ employeeid: empid })
    .then(deletedEmployee => {
      if (deletedEmployee) {
        res.status(200).send('Employee deleted');
      } else {
        res.status(404).send('Employee not found');
      }
    })
    .catch(err => res.status(500).send('Error deleting employee: ' + err.message));
});

// Start the Express server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// 3. Search Service (GET)
app.get("/search", (req, res) => {
    const { email } = req.query;
    const user = users.find(u => u.email === email);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// 4. Profile Update Service (PUT)
app.put("/update", (req, res) => {
    const { email, newData } = req.body;
    let user = users.find(u => u.email === email);
    if (user) {
        Object.assign(user, newData);
        res.json({ message: "Profile updated successfully", user });
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// 5. Delete User Service (DELETE)
app.delete("/delete", (req, res) => {
    const { email } = req.body;
    users = users.filter(u => u.email !== email);
    res.json({ message: "User deleted successfully" });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

