async function completeAssessmentItem(data){
    //const {course_code,student_id,man_no, answers} = data
    //let forwardedData = JSON.stringify({course_code,student_id,man_no, answers})

    //console.log('Received data', forwardedData)
    try{
        let response = await fetch('/api/complete/assessment/item',{
            method:'POST',
            headers:{
                'Content-Type':"application/json"
            },
            body:JSON.stringify(data)///({course_code,student_id,man_no, answers})//forwardedData
        })
        console.log(response)
        return response
    }catch(error){
        console.log('Error completing update')
    }
}

async function getAssessmentItemStatus(course_code,student_id,man_no){
    try{
        let response = await fetch('/api/assessment/item/status',{
            method:'POST',
            headers:{
                'Content-Type':"application/json"
            },
            body:JSON.stringify({course_code,student_id,man_no})///({course_code,student_id,man_no, answers})//forwardedData
        })
        let result = await response.json()
        console.log(result)
        return result
    }catch(error){
        console.log('Error getting assessment item status..',error)
    }
}

async function completeAssessments(student_id){
    //const {course_code,student_id,man_no, answers} = data
    //let forwardedData = JSON.stringify({course_code,student_id,man_no, answers})

    //console.log('Received data', forwardedData)
    try{
        let response = await fetch('/api/complete/assessments',{
            method:'POST',
            headers:{
                'Content-Type':"application/json"
            },
            body:JSON.stringify({ student_id })
        })
        const results = response.json()
        console.log('Results ...',results)
        return results
    }catch(error){
        console.log('Error completing update')
    }
}

async function getAssessmentsStatus(student_id){
    try{
        let response = await fetch('api/assessments/status',{
            method:'POST',
            header:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({student_id})
        })
        const results = response.json()
        response.json(results)

    }catch(error){
        console.log("Error getting assessment status",error)
    }
}

async function getCompletedAssessments(student_id){
    try{
        let response = await fetch('/api/completed/assessments',{
            method:'POST',
            headers:{
                'Content-Type':"application/json"
            },
            body:JSON.stringify({student_id})///({course_code,student_id,man_no, answers})//forwardedData
        })
        let result = await response.json()
        console.log('Completed assessments',result)
        return result
    }catch(error){
        console.log('Error getting assessment item status..',error)
    }
}

async function getTotalAssessments(student_id){
    try{
        let response = await fetch('/api/total/assessments',{
            method:'POST',
            headers:{
                'Content-Type':"application/json"
            },
            body:JSON.stringify({student_id})///({course_code,student_id,man_no, answers})//forwardedData
        })
        let result = await response.json()
        console.log('Completed assessments',result)
        return result
    }catch(error){
        console.log('Error getting assessment item status..',error)
    }
}


export {getTotalAssessments, completeAssessmentItem, getAssessmentItemStatus, completeAssessments, getCompletedAssessments, getAssessmentsStatus}