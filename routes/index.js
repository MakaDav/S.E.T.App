const express = require('express')
const apiRouter = express()
const { dbConnection } = require('../database/db')
const data = require('../database/data')
const bodyParser = require('body-parser')
const isFirstSemesterCourse = require('../public/js/other-courses')
apiRouter.use(bodyParser.json())

apiRouter.get('/course/details/:course_code', (req, res)=>{
    const courseCode = req.params.course_code;
    let course = data.courses.find(c=>c.code===courseCode)
    if(course){
        res.json(course)
    }else{
        res.json({message:'Course does not exist'})
    }
})

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

apiRouter.get('/set/users',(req, res)=>{
    console.log('Local users',data.users)
    res.json(data.users)
})

apiRouter.post('/all/courses/sis', async (req, res)=>{
    const { username, password } = req.body
    try{
        let response = await fetch('http://set.unza.zm:8088/https://sis.unza.zm/Rest/authenticate.json',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({username, password})
        })
        let jsonData = (await response.json()).response.data
        console.log(jsonData.misk.Student)
        let userData = {
            comp_no:jsonData.user.computer_no,
            first_name:jsonData.misk.Student.first_name,
            last_name:jsonData.misk.Student.surname,
            courses:jsonData.courses.map(c=>c.c).filter(c => !isFirstSemesterCourse(c.code))
        }
        console.log(req.body,username,'student',userData)
        res.json(userData)
    }catch(error){
        console.error('Error fetching courses:', error);
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

apiRouter.get('/all/lecturers/sis', async (req, res)=>{
    try{
        let response = await fetch('http://set.unza.zm:8088/https://sis.unza.zm/Rest/getlecturerslistset.json',{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        let jsonData = (await response.json()).response.data
        let filteredLecturers = jsonData.filter(l => l.man_no !== null)
        console.log(filteredLecturers)
        res.json(filteredLecturers)
    }catch(error){
        console.log("Error fetching lecturers",error)
    }
})

apiRouter.post('/all/course/lecturers/sis', async (req, res)=>{
    const { course_id } = req.body
    try{
        let response = await fetch('http://set.unza.zm:8088/https://sis.unza.zm/Rest/getlecturerset.json',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({course_id})
        })
        let jsonData = (await response.json()).response.data
        let filteredLecturers = jsonData.filter(l => l.man_no !== null)
        console.log(filteredLecturers)
        res.json(filteredLecturers)
    }catch(error){
        console.log("Error fetching lecturers",error)
    }
})

apiRouter.post('/all/course/lecturers/assigned', (req, res)=>{
    let { course_code, student_id } = req.body
    console.log({ course_code, student_id })
    let configQuery = "SELECT DISTINCT(man_no) FROM assessments WHERE course_code = ? AND student_id = ?"
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
    let configQuery = "SELECT COUNT(DISTINCT man_no) AS count FROM assessments WHERE course_code = ? AND student_id = ? AND status ='completed'"
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

apiRouter.post('/assessments/status', (req, res)=>{
    const { student_id } = req.body
    const selectQuery = 'SELECT assessments FROM status WHERE student_id = ?'
    try{
        dbConnection.query(selectQuery,[ student_id ], (err, results)=>{
            res.json(results[0])
        })
    }catch(error){

    }
})

apiRouter.get('/assessments/status/:student_id', (req, res)=>{
    const { student_id } = req.params
    const selectQuery = 'SELECT assessments FROM status WHERE student_id = ?'
    try{
        dbConnection.query(selectQuery,[ student_id ], (err, results)=>{
            res.json(results[0])
        })
    }catch(error){

    }
})

apiRouter.post('/complete/assessments', (req, res)=>{
    const { student_id } = req.body
    const updateQuery = 'UPDATE status SET assessments = "completed" WHERE student_id = ?' 
    try{
        dbConnection.query(updateQuery,[ student_id ], (err, results)=>{
            res.json({message:'Assessment status updated'})
        })
    }catch(error){
        console.log('Error updating assessment')
        res.json({message:'Assessment status failed to update'})
    }
})
apiRouter.post('/all/assessments', (req, res)=>{
    const { student_id } = req.body
    const countQuery = 'SELECT COUNT(STUDENT_ID) as count FROM assessments WHERE student_id = ?' 
    try{
        dbConnection.query(countQuery,[ student_id ], (err, results)=>{
            res.json(results[0])
        })
    }catch(error){
        console.log('Error updating assessment')
        res.json({message:'Failed to count'})
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

apiRouter.post('/assessment/item/status', (req, res)=>{
    const {course_code, student_id, man_no } = req.body
    console.log(req.body)
    const updateQuery = 'SELECT status FROM assessments WHERE course_code = ? AND student_id = ? AND man_no = ?'
    try{
        dbConnection.query(updateQuery, [course_code, student_id, man_no], (err, results)=>{
            console.log('Success',results)
            if(results.length>0){
                res.json(results[0])
            }else{
                res.json(results)
            }
        })
    }catch(error){
        console.log('error getting assessment item',{course_code, student_id, man_no })
        //res.json(error)
    }
})

apiRouter.post('/completed/assessments',(req, res)=>{
    const { student_id } = req.body
    console.log('Received',student_id)
    const selectQuery = "SELECT COUNT(student_id) as count FROM assessments WHERE student_id = ? AND status = 'completed'"
    try{
        dbConnection.query(selectQuery, [ student_id ],(err,results)=>{
            console.log('Results ',results)
            if(results.length>0){
                res.json(results[0])
            }else{
                res.json(results)
            }
        })
    }catch(error){
        console.log("Error getting completed assessments",error)
    }
})

apiRouter.get('/all/reports',(req, res)=>{
    const selectQuery = "SELECT COUNT(DISTINCT course_code, man_no) as count FROM assessments WHERE status = 'completed'"
    try{
        dbConnection.query(selectQuery,(err,results)=>{
            console.log('Results all reports',results)
            if(results.length>0){
                res.json(results[0])
            }else{
                res.json(results)
            }
        })
    }catch(error){
        console.log("Error getting completed assessments",error)
    }
})

apiRouter.get('/all/assessments',(req, res)=>{
    const selectQuery = "SELECT COUNT(distinct student_id, course_code, man_no) as count FROM assessments"
    try{
        dbConnection.query(selectQuery, (err,results)=>{
            console.log('Results ',results)
            if(results.length>0){
                res.json(results[0])
            }else{
                res.json(results)
            }
        })
    }catch(error){
        console.log("Error getting completed assessments",error)
    }
})

apiRouter.get('/all/completed/assessments',(req, res)=>{
    const selectQuery = "SELECT COUNT(distinct student_id, course_code, man_no) as count FROM assessments WHERE status = 'completed'"
    try{
        dbConnection.query(selectQuery, (err,results)=>{
            console.log('Results ',results)
            if(results.length>0){
                res.json(results[0])
            }else{
                res.json(results)
            }
        })
    }catch(error){
        console.log("Error getting completed assessments",error)
    }
})

apiRouter.get('/all/students/started/assessments',(req, res)=>{
    const selectQuery = "SELECT COUNT(distinct student_id) as count FROM status"
    try{
        dbConnection.query(selectQuery, (err,results)=>{
            console.log('Results ',results)
            if(results.length>0){
                res.json(results[0])
            }else{
                res.json(results)
            }
        })
    }catch(error){
        console.log("Error getting completed assessments",error)
    }
})

apiRouter.get('/all/students/completed/assessments',(req, res)=>{
    const selectQuery = "SELECT COUNT(distinct student_id) as count FROM status WHERE assessments = 'completed'"
    try{
        dbConnection.query(selectQuery, (err,results)=>{
            console.log('Results ',results)
            if(results.length>0){
                res.json(results[0])
            }else{
                res.json(results)
            }
        })
    }catch(error){
        console.log("Error getting completed assessments",error)
    }
})

apiRouter.get('/all/courses/assessed',(req, res)=>{
    const selectQuery = "SELECT COUNT(distinct course_code) as count FROM assessments WHERE status = 'completed'"
    try{
        dbConnection.query(selectQuery, (err,results)=>{
            console.log('Results ',results)
            if(results.length>0){
                res.json(results[0])
            }else{
                res.json(results)
            }
        })
    }catch(error){
        console.log("Error getting courses assessed",error)
    }
})

apiRouter.get('/all/lecturers/assessed',(req, res)=>{
    const selectQuery = "SELECT COUNT(distinct man_no) as count FROM assessments WHERE status = 'completed'"
    try{
        dbConnection.query(selectQuery, (err,results)=>{
            console.log('Results ',results)
            if(results.length>0){
                res.json(results[0])
            }else{
                res.json(results)
            }
        })
    }catch(error){
        console.log("Error getting courses assessed",error)
    }
})

apiRouter.get('/all/students/completed/config',(req, res)=>{
    const selectQuery = "SELECT COUNT(distinct student_id) as count FROM status WHERE config = 'completed'"
    try{
        dbConnection.query(selectQuery, (err,results)=>{
            console.log('Results ',results)
            if(results.length>0){
                res.json(results[0])
            }else{
                res.json(results)
            }
        })
    }catch(error){
        console.log("Error getting completed assessments",error)
    }
})

apiRouter.post('/total/assessments',(req, res)=>{
    const { student_id } = req.body
    console.log('Received',student_id)
    const selectQuery = "SELECT COUNT(student_id) as count FROM assessments WHERE student_id = ?"
    try{
        dbConnection.query(selectQuery, [ student_id ],(err,results)=>{
            console.log('Results ',results)
            if(results.length>0){
                res.json(results[0])
            }else{
                res.json(results)
            }
        })
    }catch(error){
        console.log("Error getting completed assessments",error)
    }
})

apiRouter.get('/all/assessments/entries', (req, res) => {
    const query = `SELECT * FROM assessments where status = "completed" and id >227323`
    dbConnection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching assessments:', error);
        return res.status(500).json({ error: 'Database query error' });
      }
      res.json(results);
    });
  });

  apiRouter.post('/set/new/answer',(req, res)=>{
    const {id, newAnswer} = req.body
    const query = 'UPDATE assessments set answers = ? WHERE id = ?'
    dbConnection.query(query, [newAnswer,id], (err, results)=>{
        if(err){
            console.error('Error fetching assessments:', error);
            return res.status(500).json({ error: 'Database query error' });
        }else{
            res.json(results)
        }
    })
  })

  apiRouter.get('/report/courses/:man_no',(req, res)=>{
    const manNo = req.params.man_no
    const query = 'SELECT DISTINCT course_code FROM assessments WHERE man_no=?'
    try {
        dbConnection.query(query, [manNo], (err, results)=>{
            if(err) return res.json({message:""})
            
            res.json(results)
        })
    } catch (error) {
        
    }
  })

  apiRouter.get('/lecturer/course/assessments/:courseCode/:manNo',(req, res)=>{
    const {courseCode, manNo} = req.params
    console.log(courseCode, manNo)
    try {
        const selectQuery = 'SELECT answers FROM assessments WHERE course_code = ? AND man_no = ?'
        dbConnection.query(selectQuery, [ courseCode, manNo ], (error, results)=>{
            if(error) return res.json({massage:"Failed to fetch"})
            results = results.map(a=>a.answers)
            console.log(results)
            res.json(results)
        })
    } catch (error) {
        console.log('error')
    }
  })
module.exports = apiRouter
