// control the simulation

function Manager() {
    this.m_unitList = [],
    this.m_destList = []
}

// test class 1
// sus and inf in single object

// var Unit = {
//     m_state: 0,     // determine if infected or not ( if true => infected )
//     m_dest: [],     // array of destination that unit will take, store position of dest in destList[]

//     m_stayDelay: 0,     // time spent in one location   [fixed for now]
//     m_travDelay: 0     // time spent travel from one place to another   [fixed for now]
// }

function Unit(arg_stay, arg_trav) {
    this.m_state = 0,

    this.m_dest = []
    this.pos = 0;

    this.m_stayDelay = arg_stay,
    this.m_travDelay = arg_trav,

    this.InitDest = function(dest_n, dest_max){
        for(let i = 0; i < dest_max; i++){
            this.m_dest.push(Math.floor(Math.random() * dest_n));
        }
    }

    this.Update = function(){
        
    }
  }

// test class 2
// separate sus and inf 

var Sus = {     // susceptible
    m_dest: [],     // array of destination that unit will take

    m_stayDelay: 0,     // time spent in one location
    m_travDelay: 0     // time spent travel from one place to another
}

var Inf = {     // infected
    m_dest: [],     // array of destination that unit will take

    m_stayDelay: 0,     // time spent in one location
    m_travDelay: 0      // time spent travel from one place to another
}


var Dest = {
    m_susList: [],  // list of sus in this location, position of unit in unitList[]
    m_infList: []   // list of inf in this location
}

