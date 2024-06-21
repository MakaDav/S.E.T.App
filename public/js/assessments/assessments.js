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

export { completeAssessmentItem}