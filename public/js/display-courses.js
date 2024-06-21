async function displayCourses(){
    let coursesContainer = document.createElement('div')
    coursesContainer.id = 'courses-container'
    coursesContainer.innerHTML = '<span>Code </span><span> Name </span><span> Assigned Lecturers </span><span> Action </span>'
    document.getElementById('courses-list').appendChild(coursesContainer)
    showUIItem('courses-list')
}

export default displayCourses