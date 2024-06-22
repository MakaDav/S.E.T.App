let excludedCourses = [
    'LPU 2961',
    'AGC 2041',
    
]
export default function isExcludedCourse(courseCode){
    let c = excludedCourses.find(c => {
        console.log('Received excluded course code',courseCode, c, c===courseCode)
        return c===courseCode
    })
    return c===courseCode
}