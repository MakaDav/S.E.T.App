import { getConfigStatus, setConfigStatus } from "./config/config.js"
import { getStudentCourses, getAssignedCourses } from "./courses/student.js"
import { getCourseLecturers, getCourseLecturersAssigned, getCourseLecturersAssessedCount}  from "./lecturers/lecturers.js"
import { completeAssessmentItem, completeAssessments, getAssessmentItemStatus, getCompletedAssessments, getTotalAssessments } from './assessments/assessments.js'
import questions from "./questionnaire/questionnaire.js"

let state = {
    login:0,
    student:'',
    eligibleForAssessments:false,
    entriesToSave:[],
    entriesToDelete:[],
    questionnaire:{
        questions:questions,
        man_no:'',
        answers:{},
        activeQuestion:0,
        answerOptions:[{comment:'Poor',score:1}, {comment:'Average',score:2}, {comment:'Good',score:3}, {comment:'Very Good',score:4}, {comment:'Excellent',score:5}],
    }
}

function initialise(){
    showUIItem('initial-page')
    if(state.config){
       displayCourses(state.student.courses)
    }else{
        document.getElementById('login-button').addEventListener('click',authenticateStudent)
    }
}

initialise()
async function authenticateStudent(){
    let username = document.getElementById('username').value 
    let password =  document.getElementById('password').value
    console.log({username, password})
    let student = await getStudentCourses (username,password)
    
    if(student){
        state.student = student
        getConfigStatus(username).then(res=>{
            if(res.config === 'initialise'){
                initialiseStudent(username).then(res=>{
                    state.config = 'pending'
                    displayCourses(state.student.courses)
                })
            }else{
                state.config = res.config
                console.log(state.config)
                displayCourses(state.student.courses)
            }
        })
    }else{
        console.log('wrong username or password')
    }
}

async function initialiseStudent(student_id){
    try{
        let response = await fetch('api/initialise/student', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({student_id})
        })
        let result = response.json()
        return result
    }catch(error){
        console.log('Failed to initialise..'+student_id,error)
    }
}

async function displayCourses(){
    console.log('state',state)
    let coursesContainer = document.createElement('ul')
    coursesContainer.style.listStyle = 'none'
    coursesContainer.id = 'courses-container'
    coursesContainer.innerHTML = '<div class="courses-list-header">'+
                                 '<span class="course-code header">Code</span>'+
                                 '<span class="course-title header">Name</span>'+
                                 '<span class="lecturers-assigned header">Lecturers </span>'+
                                 (state.config === 'completed'? '<span class="lecturers-assessed header">Assessed</span>':'')+
                                 '<span class="action header">'+(state.config === 'completed'? 'Assess': 'Action')+'</span></div>'
    for(let course of state.student.courses){
        let courseListItem = document.createElement('li')
        courseListItem.innerHTML = '<div class="courses-list-item">'+
                                 '<span class="course-code header">'+course.code+'</span>'+
                                 '<span class="course-title header">'+course.name+'</span>'+
                                 '<span class="lectData lecturers-assigned header" lectData="'+course.code+'">loading..</span>'+
                                 (state.config === 'completed'? '<span class="assessedData lecturers-assessed header" assessedData="'+course.code+'" >0</span>':'')+
                                 '<button class="action header" id="'+course.id+'">'+(state.config === 'completed'? 'Assess': 'Select')+'</span></div>'
        coursesContainer.append(courseListItem)
    }

    getAssignedCourses(state.student.comp_no).then(
        assignedCourses => {
            console.log('assigned courses ',assignedCourses[0].count, 'all courses ',state.student.courses.length)
            state.eligibleForAssessments = assignedCourses[0].count === state.student.courses.length
            let startAssessmentButton = document.createElement('input')
            if(state.config === 'completed'){
                startAssessmentButton.style.display='none'
            }
            startAssessmentButton.id = 'start-assessments'
            startAssessmentButton.type  = 'button'
            startAssessmentButton.disabled = !state.eligibleForAssessments
            startAssessmentButton.className = 'form-control'
            startAssessmentButton.value = 'Start Assessments'
            startAssessmentButton.addEventListener('click',
                function(e){
                    e.preventDefault()
                    setConfigStatus(state.student.comp_no).then(
                        res=>{
                            console.log(res)
                            state.config = 'completed'
                            displayCourses(state.student.courses)
                        }
                    )
                }
            )
            coursesContainer.append(startAssessmentButton)
            let coursesList = document.getElementById('courses-list')

            if(coursesList.hasChildNodes){
                coursesList.innerHTML = ''
            }

            let banner = document.createElement('div')
            banner.className = 'courses-list-banner'
            let innerHtml = '<div class="set-banner-message">'
            if(state.config==='completed'){
                innerHtml += 'Assessment Stats: Total <span id="all-assessments-stats">'+state.student.courses.length+'</span> <span id="pending-assessments-stats">0</span>'
            }else{
                innerHtml += 'Instructions'
            }
            innerHtml += '</div>'
            banner.innerHTML = innerHtml 
            coursesList.append(banner,coursesContainer)
            showUIItem('courses-list')
            displayHeader()
            getCompletedAssessments(state.student.comp_no).then(
                completedAssessments=>{
                    getTotalAssessments(state.student.comp_no).then(
                        totalAssessments =>{
                            let allAssessments = totalAssessments.count
                            document.getElementById('all-assessments-stats').innerHTML=allAssessments
                            let pendingAssessments = allAssessments - completedAssessments.count
                            console.log('Completed assessments',completedAssessments,'Total assessments',totalAssessments)
                            if(pendingAssessments===0){
                                completeAssessments(state.student.comp_no).then(
                                    results => {
                                        document.getElementById('pending-assessments-stats').innerHTML = ':    Thank you! You have completed all assessments'
                                    }
                                )
                            }else{
                                document.getElementById('pending-assessments-stats').innerHTML = 'Pending: '+pendingAssessments
                            }
                        }
                    )
                }
            )
            
            let lectAssignedData = document.getElementsByClassName('lectData')
            for(const data of lectAssignedData){
                console.log(data.getAttribute('lectData'))
                getCourseLecturersAssigned(data.getAttribute('lectData'),state.student.comp_no).then(assignedLecturers => {
                    let noOfLecturers = assignedLecturers.length
                    console.log('assigned lecturers',noOfLecturers, assignedLecturers)
                    data.innerHTML = noOfLecturers
                })
            }

            let lectAssessedData = document.getElementsByClassName('assessedData')
                    for(const assessedDataEl of lectAssessedData){
                        console.log(assessedDataEl.getAttribute('assessedData'))
                        getCourseLecturersAssessedCount(assessedDataEl.getAttribute('assessedData'),state.student.comp_no).then(assessedLecturersCount => {
                            console.log('assessed lecturers', assessedLecturersCount)
                            let noOfLecturersAssessed = assessedLecturersCount[0].count
                            
                            assessedDataEl.innerHTML = noOfLecturersAssessed
                        })
                    }
            
            for(let course of state.student.courses){
                document.getElementById(course.id).addEventListener('click', 
                    ()=>{
                        if(state.config === 'pending'){
                            displayLecturers(course.id,course.code)
                        }else{
                            displayAssignedLecturers(course.id,course.code,state.student.comp_no)
                        }
                    }
                )
            }
        }
    )
}

function displayLecturers(courseId,courseCode){
    console.log('Course id',courseId)
    getCourseLecturers(courseId).then(
        lecturers => {
            console.log(lecturers,state)
            let course = state.student.courses.find(c => c.code === courseCode)
            let courseLabel = '<div class="course-label-lecturer-list">'+course.code+': '+course.name+'</div>'
            let lecturersListContainer = document.createElement('ul')
            lecturersListContainer.id = 'lecturers-list-container'
            lecturersListContainer.innerHTML = courseLabel+'<div class="lecturers-list-container-header">'+
                                               '<span class="lecturer-list-name">Name</span>'+
                                               '<span class="lecturer-list-action">'+
                                               (state.config === 'completed'? "Assess":'Select')+
                                               '</span>'
            for(let lecturer of lecturers){
                console.log('To post',lecturer.man_no, courseId,courseCode,state.student.comp_no)
                let lecturersListItem = document.createElement('li')
                lecturersListItem.innerHTML = '<div class="lecturers-list-item">'+
                                               '<span class="lecturer-list-item-name">'+(lecturer.first_name+' '+lecturer.last_name)+'</span>'+
                                               (state.config === 'completed'? "<input class='lecturer-list-item-action' type='button' id='"+lecturer.man_no+"' value='Assess'>":"<input class='lecturer-list-item-action' type='checkbox' id='"+lecturer.man_no+"'>")
                lecturersListContainer.appendChild(lecturersListItem)
            }

            let lecturersList = document.getElementById('lecturers-list')
            let saveSelectionButton = document.createElement('input')
            saveSelectionButton.type = 'button'
            saveSelectionButton.classList.add='form-control'
            saveSelectionButton.value = 'Save Selection'
            saveSelectionButton.addEventListener('click',
                function(e){
                    let data = {
                        course_code:courseCode,
                        student_id:state.student.comp_no,
                        toSave:state.entriesToSave,
                        toDelete:state.entriesToDelete
                    }
                    console.log(data)
                    updateAssessmentEntries(data).then(res=>{
                        state.entriesToSave = []
                        state.entriesToDelete = []
                        displayCourses(state.student.courses)
                    })
                }
            )
            lecturersListContainer.appendChild(saveSelectionButton)
            if(lecturersList.hasChildNodes){
                lecturersList.replaceChild(lecturersListContainer,lecturersList.firstChild)
            }else{
                lecturersList.appendChild(lecturersListContainer)
            }
            showUIItem('lecturers-list')
            displayHeader()
            if(state.config === 'pending'){
                getCourseLecturersAssigned(courseCode,state.student.comp_no).then(assignedLecturers => {
                    for(const l of assignedLecturers){
                        console.log(l)
                        document.getElementById(l.man_no).checked = true
                    }
                })
            }
            

            for(let l of lecturers){
                let el = document.getElementById(l.man_no)
                if(el){
                    el.addEventListener('click',updateSelection)
                }
            }

            function updateSelection(e){
                console.log(e.target.id)
                if(e.target.checked === true){
                    state.entriesToSave.push(e.target.id)
                    state.entriesToDelete = state.entriesToDelete.filter(l=>l!==e.target.id)
                }else{
                    state.entriesToDelete.push(e.target.id)
                    state.entriesToSave = state.entriesToSave.filter(l=>l!==e.target.id)
                }
                console.log('To save',{man_no:state.entriesToSave},'To delete',state.entriesToDelete)
            }

            async function updateAssessmentEntries(data){
                try{
                    let response = await fetch('api/update/assessment/entries',{
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body:JSON.stringify(data)
                    })
                    console.log(response)
                    return response.json()
                }catch(error){
                    console.log(error)
                }
            }
        }
    )
}

function displayAssignedLecturers(courseId,courseCode,studentId){
    console.log('Course id',courseId)
    getCourseLecturers(courseId).then(
        allLecturers =>{
            getCourseLecturersAssigned(courseCode,studentId).then(
                lecturers => {
                    console.log(lecturers,state)
                    let course = state.student.courses.find(c => c.code === courseCode)
                    let courseLabel = '<div class="course-label-lecturer-list">'+course.code+': '+course.name+'</div>'
                    let lecturersListContainer = document.createElement('ul')
                    lecturersListContainer.id = 'lecturers-list-container'
                    lecturersListContainer.innerHTML = courseLabel +'<div class="lecturers-list-container-header">'+
                                                       '<span class="lecturer-list-name">Name</span>'+
                                                       '<span class="lecturer-list-action">'+
                                                       (state.config === 'completed'? "Assess":'Select')+
                                                       '</span>'
                    for(let l of lecturers){
                        let lecturer = allLecturers.find(lect => lect.man_no === l.man_no)
                        console.log('To post',lecturer.man_no, courseId,courseCode,state.student.comp_no)
                        let lecturersListItem = document.createElement('li')
                        lecturersListItem.innerHTML = '<div class="lecturers-list-item">'+
                                                       '<span class="lecturer-list-item-name">'+(lecturer.first_name+' '+lecturer.last_name)+'</span>'+
                                                       (state.config === 'completed'? "<input class='lecturer-list-item-action' type='button' id='"+lecturer.man_no+"' value='Assess'>":"<input class='lecturer-list-item-action' type='checkbox' id='"+lecturer.man_no+"'>")
                        lecturersListContainer.appendChild(lecturersListItem)
                    }
        
                    let lecturersList = document.getElementById('lecturers-list')
                    let saveSelectionButton = document.createElement('input')
                    saveSelectionButton.type = 'button'
                    saveSelectionButton.classList.add='form-control'
                    saveSelectionButton.value = 'Back to Courses'
                    saveSelectionButton.addEventListener('click',
                        function(e){
                           showUIItem('courses-list')
                           displayHeader()
                        }
                    )
                    lecturersListContainer.appendChild(saveSelectionButton)
                    if(lecturersList.hasChildNodes){
                        lecturersList.replaceChild(lecturersListContainer,lecturersList.firstChild)
                    }else{
                        lecturersList.appendChild(lecturersListContainer)
                    }
                    showUIItem('lecturers-list')
                    displayHeader()
                    for(let l of lecturers){
                        console.log('Lecturer',l.man_no)
                        let el = document.getElementById(l.man_no)
                        let lecturer = allLecturers.find(lect => lect.man_no === l.man_no)
                        if(el){
                            getAssessmentItemStatus(course.code,state.student.comp_no,lecturer.man_no).then(status=>{
                                console.log("Display status",status)
                                el.addEventListener('click',()=>assessLecturer(course,lecturer))
                                if(status.status === 'completed'){
                                    el.disabled = true
                                    el.value="Done"
                                }
                            }) 
                        }
                    }
        
                    function assessLecturer(course,lecturer){
                        //document.getElementById('questionnaire').innerHTML = 'Assessment for '+lecturer.first_name+' '+lecturer.last_name+'<br>'+
                        //course.code+': '+course.title
                        showUIItem('questionnaire')
                        displayHeader()
                        document.getElementById('assessment-details-lecturer').innerHTML = lecturer.first_name +' '+lecturer.last_name
                        document.getElementById('assessment-details-course').innerHTML = course.code +': '+course.name
                        state.questionnaire.course_code = course.code
                        state.questionnaire.man_no = lecturer.man_no
                        document.getElementById('question-panel').innerHTML=state.questionnaire.questions[0].text
                        let questionnaireOptions = document.createElement('select')
                        questionnaireOptions.style.listStyle = 'none'
                        questionnaireOptions.style.display = 'flex'

                        const answerOptionsContainer = document.getElementById('answer-options');
                        answerOptionsContainer.style.display='flex'
                        answerOptionsContainer.style.justifyContent = 'center'
                        const options = state.questionnaire.answerOptions;
                        for(const option of options ){
                             // Create a div to wrap each radio button and its label
                            console.log(option)
                            const radioOption = document.createElement('div');
                            radioOption.style.display='block'
                            radioOption.style.flex='1'
                            //radioOption.classList.add('form-check'); // Bootstrap class for better styling
                            // Create the radio button
                            const radioButtonContainer = document.createElement('div');
                            const radioButton = document.createElement('input');
                            radioButton.type = 'radio';
                            radioButton.name = 'options';
                            radioButton.id = ""+option.score;
                            radioButton.addEventListener('click',
                                function(e){
                                    let key = state.questionnaire.activeQuestion
                                    let value = e.target.id
                                    state.questionnaire.answers[key]=value
                                    console.log(state.questionnaire.answers)
                                    document.getElementById('next').disabled = false
                                }
                            )
                            
                            //radioButton.value = option.comment;
                            radioButton.classList.add('form-check-input'); // Bootstrap class
                            // Create the label for the radio button
                            radioButtonContainer.append(radioButton)
                            const label = document.createElement('label');
                            label.htmlFor = radioButton.id;
                            label.textContent = option.comment;
                            label.classList.add('form-check-label'); // Bootstrap class
                            let labelContainer = document.createElement('div');
                            labelContainer.appendChild(label)

                            // Append the radio button and label to the div
                            radioOption.appendChild(radioButtonContainer);
                            radioOption.appendChild(labelContainer);
                            console.log(radioOption)
                            answerOptionsContainer.appendChild(radioOption)
                        }
                    }
        
                    async function updateAssessmentEntries(data){
                        try{
                            let response = await fetch('api/update/assessment/entries',{
                                method:'POST',
                                headers:{
                                    'Content-Type':'application/json'
                                },
                                body:JSON.stringify(data)
                            })
                            console.log(response)
                            return response.json()
                        }catch(error){
                            console.log(error)
                        }
                    }
                }
            )
        }
    )
}



function hideAll(){
    let uiItems = document.getElementsByClassName("set-ui")
    for(let element of uiItems){
        element.setAttribute('hidden','hidden')
    };
}

function showUIItem(id){
    console.log(typeof id)
    hideAll()
    document.getElementById(id).removeAttribute('hidden')
}

document.getElementById("questionnaire-submit-button").disabled=true

document.getElementById("questionnaire-submit-button").addEventListener('click',
    function(e){
        e.preventDefault()
        //showUIItem('courses-list')
        const questionnaireData = {
            course_code:state.questionnaire.course_code,
            student_id:state.student.comp_no,
            man_no:state.questionnaire.man_no,
            answers:JSON.stringify(state.questionnaire.answers)
        }
        console.log('Questionnaire data', questionnaireData )
        document.getElementById('answer-options').innerHTML = ''
        completeAssessmentItem(questionnaireData).then(
            response =>{
                state.questionnaire.answers = {}
                state.questionnaire.activeQuestion = 0
                displayCourses(state.student.courses)
                displayHeader()
            }
        )
        document.getElementById('questionnaire-instructions').removeAttribute('hidden')
        document.getElementById('questionnaire-body').setAttribute('hidden','hidden')
    }
)

function displayHeader(){
    let studentName = state.student.first_name+' '+state.student.last_name
    document.getElementById('student-name').innerHTML = studentName
    document.getElementById('header').removeAttribute('hidden')
}

document.getElementById('previous').addEventListener('click',
    function(e){
        let currentQuestionNo = state.questionnaire.activeQuestion
        if(currentQuestionNo>0){
            state.questionnaire.activeQuestion--
            currentQuestionNo = state.questionnaire.activeQuestion
            let id = state.questionnaire.answers[currentQuestionNo]
            console.log(id)
            deselectAllOptions()
            if(id){
                let el = document.getElementById(id)
                el.checked = true
                console.log(el)
            }
            document.getElementById('question-panel').innerHTML=state.questionnaire.questions[currentQuestionNo].text
        }
    }
)

document.getElementById('next').addEventListener('click',
    function(e){
        let currentQuestionNo = state.questionnaire.activeQuestion
        let noOfQuestions = state.questionnaire.questions.length
        if(currentQuestionNo<noOfQuestions-1){
            state.questionnaire.activeQuestion++
            currentQuestionNo = state.questionnaire.activeQuestion
            let id = state.questionnaire.answers[currentQuestionNo]
            console.log(id)
            deselectAllOptions()
            if(id){
                let el = document.getElementById(id)
                el.checked = true
                console.log(el)
            }
            document.getElementById('question-panel').innerHTML=state.questionnaire.questions[currentQuestionNo].text
            e.target.disabled = true
        }else{
            document.getElementById('questionnaire-submit-button').disabled = false
        }
    }
)

document.getElementById('begin-assessment').addEventListener('click',
    function(e){
        document.getElementById('questionnaire-body').removeAttribute('hidden')
        document.getElementById('questionnaire-instructions').setAttribute('hidden','hidden')
    }
)

function deselectAllOptions() {
    const radioButtons = document.getElementsByName('options');
    radioButtons.forEach(radio => {
        radio.checked = false;
    });
}