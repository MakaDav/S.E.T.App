const state = {
    loggedIn:0,
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
        configCompleted:0,
        allResponses:0,
        responsesCompleted:0
    }
}

function updateState(){
    getAllStudentsStartedAssessments().then(
        startedAssessments => {
            console.log('Started assessments', startedAssessments)
            state.assessmentsData.studentsAssessmentsStarted = startedAssessments.count.toLocaleString()
            getAllStudentsCompletedAssessments().then(
                completedAssessments => {
                    console.log('Completed assessments', completedAssessments)
                    state.assessmentsData.studentsAssessmentsCompleted = completedAssessments.count.toLocaleString()
                    getAllCoursesAssessed().then(
                        allCoursesAssessed => {
                            state.assessmentsData.coursesAssessed = (allCoursesAssessed.count+506).toLocaleString()
                            getAllLecturersAssessed().then(
                                allLecturersAssessed => {
                                    state.assessmentsData.lecturersAssessed = (allLecturersAssessed.count+421).toLocaleString()
                                    getAllStudentsConfigAssessments().then(
                                        noOfConfigCompleted => {
                                            state.assessmentsData.configCompleted = (noOfConfigCompleted.count+0).toLocaleString()
                                            getAllReports().then(
                                                allReports => {
                                                    state.assessmentsData.allReports = (allReports.count+844).toLocaleString()
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
            )
        }
    )
}

function refreshStatsDisplay(){
    console.log(state.assessmentsData)
    document.getElementById('all-assessments-data').innerHTML = state.assessmentsData.studentsAssessmentsStarted
    document.getElementById('completed-assessments-data').innerHTML = state.assessmentsData.studentsAssessmentsCompleted
    document.getElementById('assessments-config-data').innerHTML = state.assessmentsData.configCompleted
    document.getElementById('all-assessment-reports').innerHTML = state.assessmentsData.allReports
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

async function getAllStudentsConfigAssessments(){
    try{
        let noOfConfigCompleted = await fetch('/api/all/students/completed/config',{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        
        return noOfConfigCompleted.json();
    }catch(error){
        console.log('Error counting config assessments',error)
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

async function getAllReports(){
    try{
        let noOfReports = await fetch('/api/all/reports',{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })
        return noOfReports.json();
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
const loggedIn = sessionStorage.getItem('loggedIn')
state.loggedIn = loggedIn
if(state.loggedIn){
    setInterval(
        updateState,
        1000
    );
}else{
    location.href='./index.html'
}

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