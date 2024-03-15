// Import necessary modules
import fs from 'fs';
import path from 'path';

// Get the directory name using import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Define the path to the courses JSON file
const coursesFilePath = path.resolve(__dirname, '../models/courses.json');

// Defining a hardcoded password for authentication
const hardcodedPassword = 'your_hardcoded_password';

// Defining controller functions for handling course-related requests
const courseController = {
    // Function to handle login request
    handleLogin: (req, res) => {
        const { password } = req.body;
        if (password === hardcodedPassword) {
            // Password matches, redirect user to the Node course page
            res.redirect('/node-course');
        } else {
            // Password does not match, display an error message
            res.send('Incorrect password. Please try again.');
        }
    },

    // Get all courses
    getAllCourses: (req, res) => {
        try {
            const coursesData = fs.readFileSync(coursesFilePath, 'utf-8');
            const courses = JSON.parse(coursesData);
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: 'Error getting courses' });
        }
    },

    // Get a course by ID
    getCourseById: (req, res) => {
        const courseId = req.params.courseId;
        try {
            const coursesData = fs.readFileSync(coursesFilePath, 'utf-8');
            const courses = JSON.parse(coursesData);
            const course = courses.find(c => c._id === courseId);
            if (!course) {
                res.status(404).json({ message: 'Course not found' });
            } else {
                res.status(200).json(course);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error getting course' });
        }
    },

    // Create a new course
    createCourse: (req, res) => {
        try {
            const { title, description, instructor, price, rating } = req.body;
            const newCourse = {
                _id: `course_id${Math.floor(Math.random() * 1000)}`, //this generates a unique ID
                title,
                description,
                instructor,
                price,
                createdAt: new Date().toISOString(), //this will generate the current date and time
            };
            const coursesData = JSON.parse(fs.readFileSync(coursesFilePath, 'utf-8'));
            coursesData.push(newCourse);
            fs.writeFileSync(coursesFilePath, JSON.stringify(coursesData, null, 2));
            res.status(201).json(newCourse);
        } catch (error) {
            res.status(500).json({ message: 'Error creating course' });
        }
    },

    // Update a course by ID
    updateCourseById: (req, res) => {
        const courseId = req.params.courseId;
        const { title, description, instructor, price } = req.body;
        try {
            let coursesData = JSON.parse(fs.readFileSync(coursesFilePath, 'utf-8'));
            const courseIndex = coursesData.findIndex((course) => course._id === courseId);
            if (courseIndex === -1) {
                res.status(404).json({ message: 'Course not found' });
            } else {
                coursesData[courseIndex] = {
                    ...coursesData[courseIndex],
                    title: title || coursesData[courseIndex].title,
                    description: description || coursesData[courseIndex].description,
                    instructor: instructor || coursesData[courseIndex].instructor,
                    price: price || coursesData[courseIndex].price,
                };
                fs.writeFileSync(coursesFilePath, JSON.stringify(coursesData, null, 2));
                res.status(200).json(coursesData[courseIndex]);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating course' });
        }
    },

    // Delete a course by ID
    deleteCourseById: (req, res) => {
        const courseId = req.params.courseId;
        try {
            let coursesData = JSON.parse(fs.readFileSync(coursesFilePath, 'utf-8'));
            const updatedCoursesData = coursesData.filter((course) => course._id !== courseId);
            if (updatedCoursesData.length === coursesData.length) {
                res.status(404).json({ message: 'Course not found' });
            } else {
                fs.writeFileSync(coursesFilePath, JSON.stringify(updatedCoursesData, null, 2));
                res.status(204).json({ message: 'Course deleted successfully' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting course' });
        }
    }
};

// Export the courseController object
export default courseController;