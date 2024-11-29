import { getAllAssessmentsEntries } from "./fix-assessments.js"
//import { users } from "../../database/data.js"
const state = {
    assessmentEntries:[]
}

function loadAssessmentEntries(){
    console.log('In load assessment entries')
    let testObj = '{"0":\"4\","1":"5","2":"5","3":"5","4":"5","5":"5","6":"5","7":"5","8":"5","9":"5","10":"5","11":"5","12":"5","13":"5","14":"5","15":"5","16":"5","17":"5"}'
    console.log("Test Object",JSON.parse(testObj))
    getAllAssessmentsEntries().then(
        assessmentEntries => {
            console.log('assessment entries',assessmentEntries)
            state.assessmentEntries = assessmentEntries
            displayAssessmentEntriesTable()
        }
    )
}

function displayAssessmentEntriesTable(){
    const entries = state.assessmentEntries
    for(let i = 0; i<entries.length;i++){
        const tableRow = document.createElement('tr')
        const snRowData = document.createElement('td')
        snRowData.innerHTML = (i+1)
        const idRowData = document.createElement('td')
        idRowData.id = entries[i].id
        idRowData.innerHTML = entries[i].id
        const answersRowData = document.createElement('td')
        answersRowData.innerHTML = entries[i].answers
        const fixRowData = document.createElement('td')
        fixRowData.innerHTML = '<input name ="fix-button" type="button" value="Fix Entry" />'
        fixRowData.addEventListener('click',
            function(e){
                let id = idRowData.id
                /*let newAnswer = entries[i].answers+'5":"'+(Math.floor(Math.random()*5+1))+'","16":"'+(Math.floor(Math.random()*5+1))+'","17":"'+(Math.floor(Math.random()*5+1))+'"}'
                console.log(idRowData.id,newAnswer)
                setAnswers(idRowData.id,newAnswer).then(
                    res => {
                        console.log(res)
                        //displayAssessmentEntriesTable()
                    }
                )*/
               let answer = JSON.parse(entries[i].answers)
                if(!answer['0']){
                    answer['0'] = (Math.floor(Math.random()*5+1))
                    console.log(id,answer)
                    setAnswers(id,JSON.stringify(answer)).then(
                        res => console.log(res)
                    )
                }
            }
        )
        tableRow.append(snRowData,idRowData,answersRowData)
        document.getElementById('assessment-entries').append(tableRow)
    }
}

loadAssessmentEntries()

async function setAnswers(id,newAnswer){
    try {
        let response = await fetch('/api/set/new/answer', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                id,newAnswer
            })
        })
        if(response.ok){
            let res = response.json()
            return res
        }
        
    } catch (error) {
        
    }
}

document.getElementById('fix-all').addEventListener('click',
    function(e){
        state.assessmentEntries.forEach(
            entry => {
                let answer = entry.answers
                if(answer[0]==='{' && answer[answer.length-1]==='}'){
                    const id = entry.id
                    console.log("ID",id)
                    //let newAnswer = JSON.parse(answer)
                    
                    let preamble = '{"0":"'+(Math.floor(Math.random()*5+1))+'",'
                    let newAnswer = preamble+answer.slice(1)
                    console.log(newAnswer)
                    setAnswers(id,newAnswer).then(
                        res => console.log(res)
                    )
                    /*if(!newAnswer['0']){
                        newAnswer['0'] = (Math.floor(Math.random()*5+1))
                        console.log(id,JSON.stringify(newAnswer))
                        
                    }*/
                }
                
                /*if(newAnswer[newAnswer.length-1]==='"'){
                    newAnswer += '16":"'+(Math.floor(Math.random()*5+1))+'","17":"'+(Math.floor(Math.random()*5+1))+'"}'
                    console.log('Ends with "',JSON.parse(newAnswer))
                    setAnswers(id,newAnswer).then(
                        res => console.log(res)
                    )
                }
                else{
                    if(newAnswer[newAnswer.length-1]==='"'){
                        console.log('Other',newAnswer)
                    }else{
                        newAnswer = JSON.parse(newAnswer)
                        if(!newAnswer['0']){
                            newAnswer['0'] = '"'+(Math.floor(Math.random()*5+1))+'"'
                            console.log(id,newAnswer)
                            /*setAnswers(id,JSON.stringify(newAnswer)).then(
                                res => console.log(res)
                            )

                        }
                    }
                }*/
                //console.log(id)
                //const newAnswer = JSON.parse(entry.answers)
                //.log(newAnswer['0'])
                /*
                setAnswers(id,newAnswer).then(
                    res => console.log(res)
                )*/
            }
        )
    }
)

document.getElementById('show-query').addEventListener('click',
    function(e){
        const query = createInsertAssessmentsQuery();
        console.log('Insert query',query)
    }
)

function createInsertAssessmentsQuery(){
    let insertAssessmentQuery = 'INSERT INTO assessments (student_id, course_code,man_no,status,answers) values '
    state.assessmentEntries.forEach(
        assessmentEntry => {
            const studentId = assessmentEntry.student_id
            const courseCode = assessmentEntry.course_code
            const manNo = assessmentEntry.man_no
            const status = assessmentEntry.status
            const answers = assessmentEntry.answers
            insertAssessmentQuery+="('"+studentId+"','"+courseCode+"','"+manNo+"','"+status+"','"+answers+"'),"
        }
    )
    return insertAssessmentQuery
}

