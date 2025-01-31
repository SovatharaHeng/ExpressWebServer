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
