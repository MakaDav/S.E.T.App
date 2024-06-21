async function getCourseLecturers(course_id){
    try{
        let lecturers = await fetch('/api/all/course/lecturers',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({course_id})
        })
        return lecturers.json();
    }catch(error){
        console.log('Error loading lecturers',error)
    }
}

async function getCourseLecturersAssigned(course_code,student_id){
    try{
        let lecturers = await fetch('/api/all/course/lecturers/assigned',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({course_code,student_id})
        })
        return lecturers.json();
    }catch(error){
        console.log('Error loading lecturers',error)
    }
}

async function getCourseLecturersAssessedCount(course_code,student_id){
    try{
        let lecturersAssessed = await fetch('/api/all/course/lecturers/assessed/count',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({course_code,student_id})
        })
        return lecturersAssessed.json()
    }catch(error){
        console.log('Error loading lecturers',error)
    }
}



export {getCourseLecturers, getCourseLecturersAssigned, getCourseLecturersAssessedCount}