const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;
const JWT_SECRET = 'GJDH-FKLS-DSPF-PEOT';

app.use(cors());
app.use(express.json());

const usersFilePath = path.join(__dirname, 'users.json');

// Utility function to read users from the JSON file
const readUsersFromFile = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return an empty array
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

// Utility function to write users to the JSON file
const writeUsersToFile = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
};


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Register route
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = readUsersFromFile();

        // Check if user already exists
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = {
            id: users.length + 1,
            username,
            password: hashedPassword,
        };

        users.push(user);
        writeUsersToFile(users);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = readUsersFromFile();

        // Find user
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Protected route
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is protected data!', user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
