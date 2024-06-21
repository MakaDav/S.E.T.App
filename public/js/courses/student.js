async function getStudentCourses(username,password){
    
        try {
            const response = await fetch('api/all/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
    
            const studentData = await response.json();
            console.log('Fetched student data:', studentData);
            return studentData;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;  // Re-throw the error to handle it in the calling function if necessary
        }
    
}

async function getAssignedCourses(student_id){
    
    try {
        const response = await fetch('api/all/assigned/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ student_id })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }

        const assignedCourses = await response.json();
        console.log('Fetched student data:', assignedCourses);
        return assignedCourses;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;  // Re-throw the error to handle it in the calling function if necessary
    }

}


export { getStudentCourses, getAssignedCourses }