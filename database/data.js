let students = [
    {
        comp_no:'2023007666',
        first_name:'David', 
        last_name:'Zulu', 
        courses:[
            {id:'1001', code:'CSC 2901',title:'Discrete Structures'},
            {id:'1002', code:'CSC 2000',title:'Computer Programming'},
            {id:'1003', code:'CSC 2011',title:'Computer Architecture'},
            {id:'1004', code:'CSC 2021',title:'Databases Fundamentals'},
        ]
    },
    {
        comp_no:'2022007111',
        first_name:'Michael', 
        last_name:'Mvula', 
        courses:[
            {id:'2001', code:'CSC 3011',title:'Algorithms amd Complexity'},
            {id:'2002', code:'CSC 3600',title:'Software Engineering'},
            {id:'2003', code:'CSC 3141',title:'Object-Oriented Analysis and Design'},
            {id:'2004', code:'CSC 3142',title:'Artificial Intelligence'},
        ]
    },
    {
        comp_no:'2023121110',
        first_name:'Given', 
        last_name:'Vincent', 
        courses:[
            {id:'1001', code:'CSC 2901',title:'Discrete Structures'},
            {id:'1002', code:'CSC 2000',title:'Computer Programming'},
            {id:'1003', code:'CSC 2011',title:'Computer Architecture'},
            {id:'1004', code:'CSC 2021',title:'Databases Fundamentals'},
        ]
    },
]
let lecturers = [
            {
                man_no:'7001',
                first_name:'Monde',
                last_name:'Kalumbilo',
            },
            {
                man_no:'1022',
                first_name:'Mayumbo',
                last_name:'Nyirenda',
            },
            {
                man_no:'7787',
                first_name:'David',
                last_name:'Zulu',
            },
            {
                man_no:'7011',
                first_name:'Martin',
                last_name:'Phiri',
            },
            {
                man_no:'1033',
                first_name:'Jackson',
                last_name:'Phiri',
            },
            
        ]

module.exports ={
    students, lecturers
}
