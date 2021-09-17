// control the simulation
const MAXTIME = 5;
const MAXDEST = 3;
const INF_PER = 0.50; // range 0 to 1

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
                this.m_unitList[i].m_destPath.push(Math.floor(Math.random() * this.m_destList.length));
                if(j == this.m_unitList[i].m_pos){ first = this.m_unitList[i].m_destPath[this.m_unitList[i].m_pos]; }  
            }
            this.m_destList[first].m_susList.push(i);   // push units to their first dest
        }
    }

    this.SpawnSpot = function(dest_num){

        let spawn = this.m_destList[dest_num].m_susList.splice(Math.floor(Math.random() * this.m_destList[dest_num].m_susList.length), 1);
        //let spawn = this.m_destList[dest_num].m_susList.pop();   // last unit of the selected dest
        this.m_unitList[spawn].m_state = true;   // set infected state
        this.m_destList[dest_num].m_infList.push(spawn);        // move to infList
    }
    this.MoveUnits = function(){
        for(let i = 0; i < this.m_unitList.length; i++){
            if(!this.m_unitList[i].m_onTrav){   // staying
                if(this.m_unitList[i].m_counter < this.m_unitList[i].m_stayDelay){  // keep staying
                    this.m_unitList[i].m_counter++; // update                        
                }else{  // moving out
                    let prevPos = this.m_unitList[i].m_pos;
                    this.m_unitList[i].m_pos = (this.m_unitList[i].m_pos + 1) % this.m_unitList[i].m_destPath.length;  
                    
                    if(this.m_unitList[i].m_destPath[prevPos] == this.m_unitList[i].m_destPath[this.m_unitList[i].m_pos]){ //same place
                        this.m_unitList[i].m_counter = 0; // reset counter
                    }else{
                        let unit_pos;
                        if(this.m_unitList[i].m_state == false){
                            unit_pos = this.m_destList[this.m_unitList[i].m_destPath[this.m_unitList[i].m_pos]].m_susList.indexOf(i);
                            this.m_destList[this.m_unitList[i].m_destPath[this.m_unitList[i].m_pos]].m_susList.splice(unit_pos, 1);
                        }else{
                            unit_pos = this.m_destList[this.m_unitList[i].m_destPath[this.m_unitList[i].m_pos]].m_infList.indexOf(i);
                            this.m_destList[this.m_unitList[i].m_destPath[this.m_unitList[i].m_pos]].m_infList.splice(unit_pos, 1);
                        }
                        this.m_unitList[i].m_counter = 0; // reset counter
                        this.m_unitList[i].m_onTrav = true   // is on travel
                    }
                }
            }else{  // traveling
                if(this.m_unitList[i].m_counter < this.m_unitList[i].m_travDelay){  // keep staying
                    this.m_unitList[i].m_counter++; // update  
                }else{  // arriving
                    if(this.m_unitList[i].m_state == false){
                        this.m_destList[this.m_unitList[i].m_destPath[this.m_unitList[i].m_pos]].m_susList.push(i); 
                    }else{
                        this.m_destList[this.m_unitList[i].m_destPath[this.m_unitList[i].m_pos]].m_infList.push(i); 
                    }
                    // this.m_destList[this.m_unitList[i].m_destPath[pos]].push(i);    // add to dest
                    this.m_unitList[i].m_counter = 0;   // reset counter
                    this.m_unitList[i].m_onTrav = false;    // is not travel
                }
            }
        }
    }

    this.UpdateDests = function(){
        for(let i = 0; i < this.m_destList.length; i++){
            if( this.m_destList[i].m_infList.length !== 0){
                for(let j = 0; j < this.m_destList[i].m_susList.length; j++){
                    if(Math.random() >= INF_PER){
                        this.m_unitList[this.m_destList[i].m_susList[j]].m_state = true;
                        let newInf = this.m_destList[i].m_susList.splice(j, 1);
                        this.m_destList[i].m_infList.push(newInf);
                        
                    }
                }
            }
        }
    }
}

function Unit(arg_stay, arg_trav) {
    this.m_state = false,       // boolean
    this.m_onTrav = false,      // boolean

    this.m_destPath = []
    this.m_pos = 0;
    
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