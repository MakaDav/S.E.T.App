const express = require('express')
const apiRouter = express()
const { dbConnection } = require('../database/db')
const data = require('../database/data')
const bodyParser = require('body-parser')
apiRouter.use(bodyParser.json())

apiRouter.post('/all/courses', (req, res)=>{
    const { username, password } = req.body
    let students = data.students
    try{
        let student = students.find(c => c.comp_no === username)
        console.log(req.body,username,'student',student)
        res.json(student)
    }catch(error){
        console.error('Error fetching lecturers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

apiRouter.post('/all/assigned/courses', (req, res)=>{
    const { student_id } =  req.body
    let selectQuery = 'SELECT COUNT (DISTINCT course_code) as count FROM assessments WHERE student_id = ?'
    try{
        dbConnection.query(selectQuery, [student_id], (err, results)=>{
            res.json(results)
        })
    }catch(error){
        console.log(error)
    }
})
apiRouter.post('/all/course/lecturers', (req, res)=>{
    //let { course_id } = req.body
    let lecturers = data.lecturers
    try{
        res.json(lecturers)
    }catch(error){
        console.error('Error fetching lecturers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

apiRouter.post('/all/course/lecturers/assigned', (req, res)=>{
    let { course_code, student_id } = req.body
    console.log({ course_code, student_id })
    let configQuery = "SELECT man_no FROM assessments WHERE course_code = ? AND student_id = ?"
    try{
        dbConnection.query(configQuery,[course_code,student_id], (err, results)=>{
            res.json(results)
        })
    }catch(error){
        console.error('Error fetching lecturers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

apiRouter.post('/all/course/lecturers/assessed/count', (req, res)=>{
    let { course_code, student_id } = req.body
    console.log({ course_code, student_id })
    let configQuery = "SELECT COUNT(man_no) AS count FROM assessments WHERE course_code = ? AND student_id = ? AND status ='completed'"
    try{
        dbConnection.query(configQuery,[course_code,student_id], (err, results)=>{
            console.log(results, err)
            res.json(results)
        })
    }catch(error){
        console.error('Error fetching lecturers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

apiRouter.post('/config/status', (req, res)=>{
    let { student_id } = req.body
    let configQuery = "UPDATE  status SET config = 'completed' WHERE student_id = ?"
    try{
        dbConnection.query(configQuery,[student_id], (err, results)=>{
            res.json({message:'Config status changed to complete'})
        })
    }catch(error){
        console.error('Error fetching lecturers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

apiRouter.get('/config/status/:student_id', (req, res)=>{
    let { student_id } = req.params
    let configQuery = "SELECT config FROM status WHERE student_id = ?"
    try{
        dbConnection.query(configQuery,[student_id], (err, results)=>{
            if(results.length === 0){
                res.json({config:'initialise'})
            }else{
                res.json(results[0])
            }
        })
    }catch(error){
        console.error('Error fetching lecturers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

apiRouter.post('/initialise/student', (req, res)=>{
    let { student_id } = req.body
    let configQuery = "INSERT INTO status (student_id) VALUES (?)"
    try{
        dbConnection.query(configQuery,[student_id], (err, results)=>{
            res.json({message:'Student config status initialised..'})
        })
    }catch(error){
        console.error('Error initialising student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

apiRouter.post('/add/assessment/entry',(req, res)=>{
    let {student_id, course_code, man_no} = req.body
    let entryQuery = 'INSERT INTO assessments (student_id, course_code, man_no) VALUES (?, ?, ?)'
    try{
        dbConnection.query(entryQuery, [student_id, course_code, man_no], (error, results)=>{
            res.json({message:'Entry completed successfully'}) 
        })
    }catch(error){
        console.log('Error making assessment entry',error)
    }
})

apiRouter.delete('/add/assessment/entry',(req, res)=>{
    let {student_id, course_code, man_no} = req.body
    let entryQuery = 'INSERT INTO assessments (student_id, course_code, man_no) VALUES (?, ?, ?)'
    try{
        dbConnection.query(entryQuery, [student_id, course_code, man_no], (error, results)=>{
            res.json({message:'Entry completed successfully'}) 
        })
    }catch(error){
        console.log('Error making assessment entry',error)
    }
})

apiRouter.post('/update/assessment/entries', async (req, res) => {
    const { course_code, student_id, toSave, toDelete } = req.body;
    console.log('data',req.body)
    for (const man_no of toDelete) {
        console.log(man_no)
        dbConnection.query('DELETE FROM assessments WHERE course_code = ? AND student_id = ? AND man_no = ?', [course_code, student_id, man_no]);
    }
    let selectQuery = 'SELECT * FROM assessments WHERE course_code = ? AND student_id = ? AND man_no = ?'
    let insertQuery = 'INSERT INTO assessments (course_code, student_id, man_no) VALUES (?,?,?)'
    for(const man_no of toSave){
        console.log(man_no)
        dbConnection.query(selectQuery, [course_code, student_id,man_no], (err, selectResults)=>{
            console.log(selectResults)
            if(selectResults.length === 0){
                dbConnection.query(insertQuery,[course_code, student_id, man_no], (err, insertResults)=>{
                    if(err){
                        console.log('Error',err)
                    }else{
                        console.log(insertResults)
                    }
                })
            }
        })
    }
    res.json({message:'successful'})
});

apiRouter.post('/complete/assessment/item', (req, res)=>{
    const {course_code, student_id, man_no, answers } = req.body
    console.log(req.body)
    const updateQuery = 'UPDATE assessments SET answers = ?, status ="completed" WHERE course_code = ? AND student_id = ? AND man_no = ?'
    try{
        dbConnection.query(updateQuery, [answers ,course_code, student_id, man_no], (err, results)=>{
            console.log('Success',results)
            res.json(results)
        })
    }catch(error){
        console.log('error completing assessment item',{course_code, student_id, man_no, answers })
    }
})

module.exports = apiRouter
