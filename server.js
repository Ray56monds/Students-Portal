import express from 'express';
import morgan from 'morgan';
import path from 'path';

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Serve static files from the Public directory
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Hardcoded password for demonstration purposes (replace with your actual password)
const hardcodedPassword = 'Password@123';

// Route for the login page
app.get('/login', (req, res) => {
  res.sendFile(path.resolve(publicPath, 'login.html'));
});

// Route for handling login submission
app.post('/login', (req, res) => {
  const { password } = req.body;
  // Compare the entered password with the hardcoded password
  if (password === hardcodedPassword) {
    // Redirect the user to the node-course page upon successful authentication
    res.redirect('/node-course');
  } else {
    // Redirect back to the login page with an error message upon unsuccessful authentication
    res.redirect('/login?error=1');
  }
});

// Route for the Node Course page
app.get('/node-course', (req, res) => {
  // Check if the user is authenticated (e.g., through session or token)
  res.sendFile(path.resolve(publicPath, 'node-course.html'));
});

// Route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Student Web Service Portal!');
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
