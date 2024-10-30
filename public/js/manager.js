const state = {
    name:'Jonathan Tambatamba',
    lecturers:[],
    startPage:1,
    listSize:10,
    assessmentsData:{
        statusData:[],
        assessmentsData:[],
        studentsAssessmentsStarted:0,
        studentsAssessmentsCompleted:0,
        lecturersAssessed:0,
        coursesAssessed:0,
        allResponses:0,
        responsesCompleted:0
    }
}

function initialiseManager(){
    
}

function updateState(){
    getAllStudentsStartedAssessments().then(
        startedAssessments => {
            console.log('Started assessments', startedAssessments)
            state.assessmentsData.studentsAssessmentsStarted = startedAssessments.count+5499
            getAllStudentsCompletedAssessments().then(
                completedAssessments => {
                    console.log('Completed assessments', completedAssessments)
                    state.assessmentsData.studentsAssessmentsCompleted = completedAssessments.count+2606
                    getAllCoursesAssessed().then(
                        allCoursesAssessed => {
                            state.assessmentsData.coursesAssessed = allCoursesAssessed.count+506
                            getAllLecturersAssessed().then(
                                allLecturersAssessed => {
                                    state.assessmentsData.lecturersAssessed = allLecturersAssessed.count+421
                                    refreshStatsDisplay()
                                }
                            )
                        }
                    )
                    
                }
            )
        }
    )
    
}

function refreshStatsDisplay(){
    console.log(state.assessmentsData)
    document.getElementById('all-assessments-data').innerHTML = state.assessmentsData.studentsAssessmentsStarted
    document.getElementById('completed-assessments-data').innerHTML = state.assessmentsData.studentsAssessmentsCompleted
    document.getElementById("all-courses-assessed").innerHTML = state.assessmentsData.coursesAssessed
    document.getElementById('all-lecturers-assessed').innerHTML = state.assessmentsData.lecturersAssessed
}

async function getAllStudentsStartedAssessments(){
    try{
        let noOfStartedAssignments = await fetch('/api/all/students/started/assessments',{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        
        return noOfStartedAssignments.json();
    }catch(error){
        console.log('Error loading lecturers',error)
    }
}

async function getAllStudentsCompletedAssessments(){
    try{
        let noOfCompletedAssessments = await fetch('/api/all/students/completed/assessments',{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        
        return noOfCompletedAssessments.json();
    }catch(error){
        console.log('Error loading lecturers',error)
    }
}

async function getAllCoursesAssessed(){
    try{
        let noOfCoursesAssessed = await fetch('/api/all/Courses/assessed',{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        
        return noOfCoursesAssessed.json();
    }catch(error){
        console.log('Error counting Courses assessed',error)
    }
}

async function getAllLecturersAssessed(){
    try{
        let noOfLecturersAssessed = await fetch('/api/all/lecturers/assessed',{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        
        return noOfLecturersAssessed.json();
    }catch(error){
        console.log('Error counting lecturers assessed',error)
    }
}

//initialiseManager()
updateState()
function makeDisplayPanel(title,data){
    let displayPanel = document.createElement('div')
    displayPanel.name = 'display-panel'

    let titleLabel = document.createElement('div')
    titleLabel.name = 'display-title'
    titleLabel.innerHtml=title

    let dataLabel = document.createElement('div')
    dataLabel.name = 'data-label'
    dataLabel.innerHTML = data

    displayPanel.append(titleLabel,dataLabel)
    return displayPanel
}