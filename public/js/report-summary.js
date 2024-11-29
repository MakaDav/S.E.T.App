
import makeAssessmentItemsReport from "./assessment-items.js"
import getAverageObj from "./average-obj.js"
const state = {
    lecturer:{
        man_no:7787,
        firstName:"David",
        lastName:"Zulu"
    },
    courseCodes:[
        'CSC 2901', 'CSC 2912'
    ],
    results:{}
}

function initialise(){
    const importedData = JSON.parse(sessionStorage.getItem('reportDetails'))
    console.log(importedData)
    state.lecturer =  importedData.lecturer
    state.courseCodes = importedData.courses
}
initialise()

function refresh(){
    document.getElementById('lecturer-first-name').innerHTML=state.lecturer.first_name
    document.getElementById('lecturer-last-name').innerHTML=state.lecturer.last_name
    displayLecturerCoursesList()
}

function displayLecturerCoursesList(){
    document.getElementById('lecturer-course-reports-list').append(createLecturerCoursesListItem("", 1))
    state.courseCodes.forEach(
        cc => {
            document.getElementById('lecturer-course-reports-list').append(createLecturerCoursesListItem(cc.course_code))
        }
    )
}

function createLecturerCoursesListItem(courseCode, flag){
    const lecturerCoursesListItem = document.createElement('div')
    lecturerCoursesListItem.style.display = 'flex'
    lecturerCoursesListItem.classList.add(flag? "title-label":"item-label")

    let courseCodeField = document.createElement('div')
    courseCodeField.innerHTML = flag? "Course Code": courseCode
    courseCodeField.style.width= '30%'

    let courseNameField = document.createElement('div')
    let responsesField = document.createElement('div')
    getCourseDetails(courseCode).then(
        course=>{
            courseNameField.innerHTML = flag? "Course Name":course.name
            courseNameField.style.width= '30%'
           
            responsesField.style.width= '30%'
            getAllLecturerCourseAssessments(courseCode,state.lecturer.man_no).then(
                assessments=>{
                    responsesField.innerHTML = flag? "Responses":assessments.length
                }
            )
        }
    )
    lecturerCoursesListItem.append(courseCodeField,courseNameField,responsesField)
    lecturerCoursesListItem.addEventListener('click', 
        ()=>{
            console.log({man_no:state.lecturer.man_no, course_code:courseCode})
            getAllLecturerCourseAssessments(courseCode,state.lecturer.man_no).then(
                assessments=>{
                    console.log(assessments[0])
                    const avgs = getAverageObj(assessments)
                    console.log(avgs)

                    let sum = 0
                    Object.keys(avgs).forEach(key=>{
                        sum+=avgs[key]
                    })

                    let score = sum/Object.keys(avgs).length

                    let reportHeader = '<div class="report-header results-list">'+
                                        '<div ><img class="unza-logo" src="../images/unza_logo.png" alt="Unza logo"></div>'+
                                        '<div class="unza-label">UNIVERSITY OF ZAMBIA</div>'+
                                        '<div class="dqa-label">Directorate of Quality Assurance</div>'+
                                        '<div class="set-report-banner">'+
                                        '<div class="set-label">STUDENT EVALUATION OF TEACHING</div>'+
                                        '<div class="today-date">'+Date()+'</div>'+
                                        '<div class="confidential-alert">CONFIDENTIAL</div></div>'
                                        
                    reportHeader+='<div class="report-data results-list">'+
                                    '<div class="lecturer-course-details">'+
                                    '<div class="key-value"> <div class="key">Man No</div><div class="value">'+state.lecturer.man_no+'</div></div>'+ 
                                    '<div class="key-value"> <div class="key">Name</div><div class="value">'+state.lecturer.first_name+" "+state.lecturer.last_name+'</div></div>'+
                                    '<div class="key-value"> <div class="key">Course Code</div><div class="value">'+courseCode+'</div></div>'+
                                    '<div class="key-value"> <div class="key">Course Name</div><div id="course-name" class="value">..loading</div></div>'+
                                    '<div class="key-value"> <div class="key">Responses</div><div id="course-name" class="value">'+assessments.length+'</div></div>'+
                                    '<div class="key-value"> <div class="key">Score</div><div id="course-name" class="value">'+score.toFixed(2)+'</div></div>'+
                                    '</div>'+
                                    '<div class="legend">'+
                                    '<div class="legend-header">Key</div>'+
                                    '<div class="key-value"> <div class="key">0 &le; x &lt; 0.15</div><div id="course-name" class="value">Very Poor</div></div>'+
                                    '<div class="key-value"> <div class="key">0.15&le;x&lt;0.25</div><div id="course-name" class="value">Poor</div></div>'+
                                    '<div class="key-value"> <div class="key">0.25&le;x&lt;0.35</div><div id="course-name" class="value">Satisfactory</div></div>'+
                                    '<div class="key-value"> <div class="key">0.35&le;x&lt;0.45</div><div id="course-name" class="value">Good</div></div>'+
                                    '<div class="key-value"> <div class="key">Above 0.45</div><div id="course-name" class="value">Excellent</div></div>'+

                                    '</div></div></div>'
                        
                    let reportFooter = '<div class="report-footer results-list">'+
                                    '<div class="hods-comments">HoD&apos;s Comments:'+
                                    '</div>'+
                                    '<div class="comments-line"></div>'+
                                    '<div class="comments-line"></div>'+
                                    '<div class="comments-line"></div>'+
                                    '<div class="comments-line"></div>'+
                                    '<div class="comments-line signature">'+
                                        '<div class="name-box">Name</div>'+
                                        '<div class="date-box">Date</div>'+
                                        '<div class="signature-box">Signature</div>'+
                                    '</div>'
                                    reportFooter+='<div class="deans-comments">Dean&apos;s Comments:'+
                                    '</div>'+
                                    '<div class="comments-line"></div>'+
                                    '<div class="comments-line"></div>'+
                                    '<div class="comments-line"></div>'+
                                    '<div class="comments-line"></div>'+
                                    '<div class="comments-line signature">'+
                                        '<div class="name-box">Name</div>'+
                                        '<div class="date-box">Date</div>'+
                                        '<div class="signature-box">Signature</div>'+
                                    '</div>'
                                    
                    document.getElementById("lecturer-report-init-page").style.display = 'none'
                    document.getElementById('lecturer-course-report').innerHTML = reportHeader+makeAssessmentItemsReport(avgs)+reportFooter
                    document.getElementById('report-container').removeAttribute('hidden')
                    document.getElementById('print-report').classList.add('btn')
                    document.getElementById('print-report').classList.add('btn-primary')
                    getCourseDetails(courseCode).then(
                        c=> document.getElementById('course-name').innerHTML= c.name
                    )
                }
            )
        }
    )
    return lecturerCoursesListItem
}
refresh();
async function getCourseDetails(code){
    try {
        const response = await fetch('/api/course/details/'+code, {
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        })
        if(response.ok){
            const course = await response.json()
            return course
        }else{
            return {message:""}
        }
    } catch (error) {
        
    }
}

async function getAllLecturerCourseAssessments(courseCode,manNo){
    try {
        const response = await fetch('/api/lecturer/course/assessments/'+courseCode+'/'+manNo, {
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        })
        if(response.ok){
            const assessments = await response.json()
            return assessments
        }else{
            return {message:""}
        }
    } catch (error) {
        
    }
}

function printReport() {
    const reportContent = document.getElementById('lecturer-course-report').innerHTML; // Get the report content
  
    // Open a new print window
    const printWindow = window.open('', '', 'width=800,height=600');
  
    // Write the HTML content
    printWindow.document.open();
    printWindow.document.write('<html><head><title>Print Report</title>');
  
    // Include styles from the current document
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
    styles.forEach(style => {
      printWindow.document.write(style.outerHTML);
    });
  
    printWindow.document.write('</head><body>');
    printWindow.document.write(reportContent); // Insert the report content
    printWindow.document.write('</body></html>');
    printWindow.document.close();
  
    // Wait until the content is fully loaded before printing
    printWindow.onload = function () {
      printWindow.print();
      printWindow.close();
    };
  }
  
  

  document.getElementById('print-report').addEventListener('click',printReport)
  document.getElementById('back-to-courses').addEventListener('click',
    ()=>{
        document.getElementById("lecturer-report-init-page").style.display = 'block'
        document.getElementById('report-container').setAttribute('hidden','hidden')
    }
  )
  