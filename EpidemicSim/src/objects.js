// control the simulation
const MAXTIME = 5;
const MAXDEST = 10;

function Manager() {
    this.m_unitList = [],
    this.m_destList = [],

    this.Init = function(units, dests){
        // init destination first, unit need to know how many dest there are
        for(let i = 0; i < dests; i++){
            this.m_destList.push(new Dest());
        }
        // init unit
        for(let i = 0; i < units; i++){
            this.m_unitList.push(new Unit(Math.floor(Math.random()* MAXTIME) + 1, Math.floor(Math.random()* MAXTIME) + 1));

            let first = 0;  // var for first dest
            for(let j = 0; j < MAXDEST; j++){   // random destination
                this.m_unitList[i].m_dest.push(Math.floor(Math.random() * this.m_destList.length));
                if(j == 0){ first = this.m_unitList[i].m_dest[0]; }  
            }
            this.m_destList[first].m_susList.push(i);   // push units to their first dest
        }
    }
}

function Unit(arg_stay, arg_trav) {
    this.m_state = 0,       // boolean
    this.m_ontrav = 0,      // boolean

    this.m_dest = []
    this.pos = 0;
    
    this.m_stayDelay = arg_stay,
    this.m_travDelay = arg_trav,
    this.m_counter = 0
}

function Dest(){
    this.m_susList = [],  // list of sus in this location, position of unit in unitList[]
    this.m_infList = []   // list of inf in this location
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