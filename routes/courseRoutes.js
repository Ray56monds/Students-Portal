import express from 'express';
import courseController from '../controllers/courseController.js'; // Import the courseController

const router = express.Router();

// Define routes for CRUD operations on courses
router.post('/courses', courseController.createCourse);
router.get('/courses', courseController.getAllCourses);
router.get('/courses/:courseId', courseController.getCourseById);
router.patch('/courses/:courseId', courseController.updateCourseById);
router.delete('/courses/:courseId', courseController.deleteCourseById);

// Export the router
export default router;