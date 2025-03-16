import express, { json } from 'express'
import course from '../models/course.js'
import mongoose from 'mongoose'
const router  = express.Router()
// add a course
router.post("/",async (req,res) => {
    try {
        const courseInfo = {...req.body}
        const c = new course(courseInfo)
        await c.save()
        res.status(200).json({
            message : "saved",
            courseId : c._id
        })
    } catch (error) {
        res.status(401).json({
            message : "couldn't save " + error.message,
        })
    }
})
//update course with id 
router.post("/:id", async (req,res) => {
    try {
        const courseId = req.params.id
        const courseInfo = {...req.body}
        await course.findByIdAndUpdate(courseId,courseInfo)
        res.status(200).json({
            message : "updated successfully"
        })
        
    } catch (error) {
        res.status(401).json({
            message : "couldn't update",
        })
    }

})

// list all courses
router.get("/",async (req,res) => {
    try {
        const {filter,value} = req.query
        let result  
        if(filter && value){
            result = await course.find({[filter] : value})
        }else{
            result = await course.find()
        }
        if(!result){
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Courses found successfully", courses : result });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
})
//delete course
router.delete('/:id', async (req, res) => {
    const courseId = req.params.id;
    try {
        const result = await course.deleteOne({ _id: courseId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
});

export default router