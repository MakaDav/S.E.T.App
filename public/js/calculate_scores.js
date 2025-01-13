import man_numbers from "./man_numbers.js";
import getAverageObj from "./average-obj.js";

man_numbers.forEach(
    man_no => {

        getAllLecturerAssessments(man_no).then(
            assessments => {
                let avgs = getAverageObj(assessments)
                //console.log("total assessments",assessments.length,"Averages", avgs)
                let keys = Object.keys(avgs)
                //console.log("Keys", keys)
                let scoreSum = 0
                keys.forEach(
                    ss => scoreSum+=avgs[ss]
                )
                console.log("Man number",man_no,"Responses",assessments.length,"Score", scoreSum/keys.length)
            }
        )
    }
)


async function getAllLecturerAssessments(manNo){
    try {
        const response = await fetch('/api/all/lecturer/assessments/'+manNo, {
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