const assessmentItems = ['Punctuality of the lecturer',
    'Attendance at scheduled sessions',
    'Explanation of course objectives',
    'Explanation of course structure',
    'Ability to explain new concepts',
    'Knowledge of the subject matter',
    'Clarity of communication',
    'Ability to arouse interest',
    'Use of teaching aids and media',
    'Organisation of teaching materials',
    'Use of examples and illustrations',
    'Encouragement of participation',
    'Consideration of different views',
    'Dealing with questions',
    'Coverage of course outline',
    'Fairness in grading',
    'Timely feedback on assessments',
    'Accessibility for consultations']

function makeAssessmentItemsReport(results){
    let list = '<div class="results-list">'+
                '<div class="results-list-item list-header"><div class="row-no">#</div><div class="assessment-item-label">Assessment Item</div> '+
               '<div class="assessment-item-score">Score</div>'+
               '<div class="comment">Comment</div></div> '
    let i = 0
    let overallScore = 0
    for(let key in results){
        list+='<div class="results-list-item"><div class="row-no">'+(1+i)+'</div><div class="assessment-item-label">'+assessmentItems[i++]+'</div> '+
              '<div class="assessment-item-score">'+results[key].toFixed(2)+'</div>'+
              '<div class="comment">'+getComment(results[key]/10)+'</div></div> '
        overallScore+=results[key]
    }
    
    list+="<div class='results-list-item overall'>"+
            "<div class='row-no'></div><div class='overall-score-label assessment-item-label'>Overall Score</div>"+
            "<div class='overall-score assessment-item-score'>"+ (overallScore/(i)).toFixed(2)+'</div>'+
            '<div class = "comment">'+getComment((overallScore/(i))/10)+'</div></div>'
    list+='</div>'
    return list
}

function getComment(score){
    if(score>=0.45){
        return 'Excellent'
    }else{
        if(score>=0.35){
            return 'Good'
        }else{
            if(score>=0.25){
                return 'Satisfactory'
            }else{
                if(score>=0.15){
                    return 'Poor'
                }else{
                    return 'Very Poor'
                }
        
            }
    
        }

    }
}

export default makeAssessmentItemsReport