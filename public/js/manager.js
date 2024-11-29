import lecturers  from "./all-lecturers.js"

const state = {
    loggedIn:0,
    name:'Jonathan Tambatamba',
    lecturers:[],
    lecturersForDisplay:[],
    startPage:9,
    listSize:5,
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

function initializeState(){
    let filteredLecturers = lecturers
    .filter(l => l.man_no && l.first_name!==null && parseInt(l.man_no)!==0 && l.first_name!=='' && l.last_name!=='')
    .sort(
        (a,b)=>{
            if(a.last_name.trim() < b.last_name.trim()){
                return -1
            }else{
                return 1
            }
        }
    )
    .sort(
        (a,b)=>{
            if(a.first_name.trim() < b.first_name.trim()){
                return -1
            }else{
                return 1
            }
        }
    )
    state.lecturers = filteredLecturers
    loadLecturersForDisplay()
    refreshLecturerList()
}

function loadLecturersForDisplay(){
    let j=0;
    for(let i = (state.startPage-1)*state.listSize;i<state.startPage*state.listSize;i++){
        console.log('index',i, j)
        state.lecturersForDisplay[j++] = state.lecturers[i]
        //console.log('index',i, state.lecturersForDisplay[i])
    }
}
loadLecturersForDisplay();
function updateState(){
    console.log('all lecturers',lecturers)
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
                            state.assessmentsData.coursesAssessed = (allCoursesAssessed.count+1435).toLocaleString()
                            getAllLecturersAssessed().then(
                                allLecturersAssessed => {
                                    state.assessmentsData.lecturersAssessed = (allLecturersAssessed.count+1008).toLocaleString()
                                    getAllStudentsConfigAssessments().then(
                                        noOfConfigCompleted => {
                                            state.assessmentsData.configCompleted = (noOfConfigCompleted.count+0).toLocaleString()
                                            getAllReports().then(
                                                allReports => {
                                                    state.assessmentsData.allReports = (allReports.count+2304).toLocaleString()
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

initializeState()
const loggedIn = sessionStorage.getItem('loggedIn')
state.loggedIn = loggedIn
/*if(state.loggedIn){
    setInterval(
        updateState,
        1000
    );
}else{
    location.href='./index.html'
}*/

//document.getElementById('set-lecturers-list').innerHTML = makeLecturesList()


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

function displayLecturersCourses(e) {
    // Your code here
    console.log(e.target)
}

function makeLecturesList(){
    let list = ''
    let displayList = state.lecturersForDisplay
    console.log(displayList)
    for(let i = 0;i< displayList.length;i++){
        const lecturer = displayList[i]
        let firstName = lecturer.first_name.trim()
        firstName = firstName.slice(0,1).toUpperCase()+firstName.slice(1).toLowerCase()
        let lastName = lecturer.last_name.trim()
        lastName = lastName.slice(0,1).toUpperCase()+lastName.slice(1).toLowerCase()

        list+='<tr name="lecturer-details-field" id="'+lecturer.man_no+'">'+
                 '<td>'+firstName+'</td>'+
                 '<td>'+lastName+'</td>'+
                 '<td id="no-of-courses-'+lecturer.man_no+'">'+2+'</td>'+
                 '<td>'+2+'</td><td><input type="button" value="View Reports" /></td></tr>'
    }
    return list
}

document.getElementById('lecturer-list-next-button').addEventListener('click',
    function(){
        state.startPage = state.startPage+1
        refreshLecturerList()
    }
)

document.getElementById('lecturer-list-prev-button').addEventListener('click',
    function(){
        if(state.startPage>1)state.startPage = state.startPage-1
        refreshLecturerList()
    }
)



function refreshLecturerList(){
    loadLecturersForDisplay()
    document.getElementById('set-lecturers-list').innerHTML = makeLecturesList()
    document.getElementsByName('lecturer-details-field').forEach(
        le=>{
            le.style.cursor = 'grab'
            //le.children[2].innerHTML = Math.floor(Math.random()*5+1)
            getLecturersCourses(le.id).then(
                courses=> {
                    console.log(courses)
                    le.children[2].innerHTML = courses.length
                }
            )
            
            console.log(le.children[2])
            le.addEventListener('click',
                function(e){
                    getLecturersCourses(le.id).then(
                        courses=> {
                            console.log("Testing",le.id,courses)
                            const exportData = {
                                lecturer:state.lecturers.find(l=>l.man_no === le.id),
                                courses:courses
                            }
                            console.log(exportData)
                            sessionStorage.setItem('reportDetails', JSON.stringify(exportData))
                            location.href = './lecturer-summary-report.html'
                        }
                    )
                }
            )
            le.addEventListener('mouseover', () => {
                le.style.border = '1px solid grey';
                le.style.borderRadius = '5%';
            });
    
            le.addEventListener('mouseout', () => {
                le.style.border = '';
            });
        }
    )
}

async function getLecturersCourses(manNo){
    try {
        let response = await fetch('/api/report/courses/'+manNo,{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            },
        })

        if(response.ok){
            let courses = await response.json()
            return courses
        }

    } catch (error) {
        
    }
}

function search(term, lecturers) {
    term = term.toLowerCase();
    return lecturers.filter(u => u.first_name.toLowerCase().startsWith(term) || u.last_name.toLowerCase().startsWith(term));
}

document.getElementById('lecturer-search-field').addEventListener('input',
    function(e){
        //console.log(e.target.value)
        let list = search(e.target.value,state.lecturers)
        console.log(list)
        state.lecturersForDisplay = list
        refreshLecturerList()
    }
)