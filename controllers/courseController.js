// Import necessary modules
import fs from 'fs';
import path from 'path';

// Defining path to the courses JSON file
const coursesFilePath = path.resolve(__dirname, '../models/courses.json');

// Defining controller functions for handling course-related requests
const courseController = {
    // Function to retrieve all courses
    getAllCourses: (req, res) => {
        fs.readFile(coursesFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            const courses = JSON.parse(data);
            res.json(courses);
        });
    },

    // Function to retrieve a specific course by ID
    getCourseById: (req, res) => {
        const courseId = req.params.courseId;
        fs.readFile(coursesFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            const courses = JSON.parse(data);
            const course = courses.find(course => course._id === courseId);
            if (!course) {
                return res.status(404).send('Course not found');
            }
            res.json(course);
        });
    },

    // Function to create a new course
    createCourse: (req, res) => {
        const newCourse = req.body;
        fs.readFile(coursesFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            const courses = JSON.parse(data);
            newCourse._id = Date.now().toString();
            courses.push(newCourse);
            fs.writeFile(coursesFilePath, JSON.stringify(courses, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }
                res.status(201).json(newCourse);
            });
        });
    },

    // Function to update a specific course by ID
    updateCourseById: (req, res) => {
        const courseId = req.params.courseId;
        const updatedCourse = req.body;
        fs.readFile(coursesFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            let courses = JSON.parse(data);
            const index = courses.findIndex(course => course._id === courseId);
            if (index === -1) {
                return res.status(404).send('Course not found');
            }
            courses[index] = { ...courses[index], ...updatedCourse };
            fs.writeFile(coursesFilePath, JSON.stringify(courses, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }
                res.json(courses[index]);
            });
        });
    },

    // Function to delete a specific course by ID
    deleteCourseById: (req, res) => {
        const courseId = req.params.courseId;
        fs.readFile(coursesFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            let courses = JSON.parse(data);
            const filteredCourses = courses.filter(course => course._id !== courseId);
            if (filteredCourses.length === courses.length) {
                return res.status(404).send('Course not found');
            }
            fs.writeFile(coursesFilePath, JSON.stringify(filteredCourses, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }
                res.status(204).send();
            });
        });
    }
};

// Export the courseController object
export default courseController;
