
// For better understanding purpose
let unitList = [];  // for storing all unit
let destList = [];  // for storing all dest


// test class 1
// sus and inf in single object

var Unit = {
    m_state: 0,     // determine if infected or not ( if true => infected )
    m_dest: [],     // array of destination that unit will take, store position of dest in destList[]

    m_timeStay,     // time spent in one location   [fixed for now]
    m_timeTrav     // time spent travel from one place to another   [fixed for now]
}

// test class 2
// separate sus and inf 

var Sus = {     // susceptible
    m_dest: [],     // array of destination that unit will take

    m_timeStay,     // time spent in one location
    m_timeTrav     // time spent travel from one place to another
}

var Inf = {     // infected
    m_dest: [],     // array of destination that unit will take

    m_timeStay,     // time spent in one location
    m_timeTrav      // time spent travel from one place to another
}


var Dest = {
    m_susList: [],  // list of sus in this location, position of unit in unitList[]
    m_infList: []   // list of inf in this location
}

