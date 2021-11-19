// control the simulation
const MAXTIME = 2;
const MAXDEST = 3;
const INF_PER = 0.50; // range 0 to 1


//-------types and methods-------
function Vec2(x, y){
    this.x = x;
    this.y = y;

    this.Add = function(vec){
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }

    this.Sub = function(vec){
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }

    this.Mul = function(vec){
        return new Vec2(this.x * vec.x, this.y * vec.y);
    }

    this.Div = function(vec){
        return new Vec2(this.x / vec.x, this.y / vec.y);
    }

    this.Log = function(vec){
        console.log("(" + this.x + ", " + this.y + ")");
    }

    this.LerpTo = function(end, amount){
       let result = this.Mul(new Vec2(1.0 - amount, 1.0 - amount)).Add(end.Mul(new Vec2(amount,amount)));
    //    // fixed floating point
    //    result.x = result.x.toFixed(2);
    //    result.y = result.y.toFixed(2);
       return result;  
    }
}

function Lerp (start, end, amt){
    return (1-amt)*start+amt*end
}


// ----------class----------
function Manager() {
    this.m_unitList = [],
    this.m_destList = [],

    this.m_datPath = [],
    this.m_datTimestamp = [],
    this.m_datColor = [],

    // // initialize unit and destination
    // this.Init = function(units, dests){
    //     // init destination first, unit need to know how many dest there are
    //     for(let i = 0; i < dests; i++){
    //         this.m_destList.push(new Dest());
    //     }
    //     // init unit
    //     for(let i = 0; i < units; i++){
    //         this.m_unitList.push(new Unit(Math.floor(Math.random()* MAXTIME) + 1, Math.floor(Math.random()* MAXTIME) + 1));

    //         let first = 0;  // var for first dest
    //         for(let j = 0; j < MAXDEST; j++){   // random destination
    //             this.m_unitList[i].m_destPath.push(Math.floor(Math.random() * this.m_destList.length));
    //             if(j == this.m_unitList[i].m_pos){ first = this.m_unitList[i].m_destPath[this.m_unitList[i].m_pos]; }  
    //         }
    //         this.m_destList[first].m_susList.push(i);   // push units to their first dest
    //     }
    // }

    // // Spawn one infected at selected location
    // this.SpawnSpot = function(dest_num){

    //     let spawn = this.m_destList[dest_num].m_susList.splice(Math.floor(Math.random() * this.m_destList[dest_num].m_susList.length), 1);
    //     //let spawn = this.m_destList[dest_num].m_susList.pop();   // last unit of the selected dest
    //     this.m_unitList[spawn].m_state = true;   // set infected state
    //     this.m_destList[dest_num].m_infList.push(parseInt(spawn,10));        // move to infList
    // }
    
    // // Move unit by m_unitList
    // this.MoveUnits = function(){
    //     for(let i = 0; i < this.m_unitList.length; i++){
    //         if(!this.m_unitList[i].m_onTrav){   // staying
    //             if(this.m_unitList[i].m_counter < this.m_unitList[i].m_stayDelay){  // keep staying
    //                 this.m_unitList[i].m_counter++; // update                        
    //             }else{  // moving out
    //                 let prevPos = this.m_unitList[i].m_pos;
    //                 this.m_unitList[i].m_pos = (this.m_unitList[i].m_pos + 1) % this.m_unitList[i].m_destPath.length;
    //                 if(this.m_unitList[i].m_destPath[prevPos] !== this.m_unitList[i].m_destPath[this.m_unitList[i].m_pos]){ // different dest
    //                     if(!this.m_unitList[i].m_state){
    //                         let unit_pos = this.m_destList[this.m_unitList[i].m_destPath[prevPos]].m_susList.indexOf(i);
    //                         this.m_destList[this.m_unitList[i].m_destPath[prevPos]].m_susList.splice(unit_pos, 1);
    //                     }else{
    //                         let unit_pos = this.m_destList[this.m_unitList[i].m_destPath[prevPos]].m_infList.indexOf(parseInt(i,10));
    //                         this.m_destList[this.m_unitList[i].m_destPath[prevPos]].m_infList.splice(unit_pos, 1);
    //                     }
    //                     this.m_unitList[i].m_onTrav = true   // is on travel
    //                 }
    //                 this.m_unitList[i].m_counter = 1; // reset counter
    //             }
    //         }else{  // traveling
    //             if(this.m_unitList[i].m_counter < this.m_unitList[i].m_travDelay){  // keep staying
    //                 this.m_unitList[i].m_counter++; // update  
    //             }else{  // arriving
    //                 if(this.m_unitList[i].m_state == false){
    //                     this.m_destList[this.m_unitList[i].m_destPath[this.m_unitList[i].m_pos]].m_susList.push(i); 
    //                 }else{
    //                     this.m_destList[this.m_unitList[i].m_destPath[this.m_unitList[i].m_pos]].m_infList.push(parseInt(i)); 
    //                 }
    //                 // this.m_destList[this.m_unitList[i].m_destPath[pos]].push(i);    // add to dest
    //                 this.m_unitList[i].m_counter = 0;   // reset counter
    //                 this.m_unitList[i].m_onTrav = false;    // is not travel
    //             }
    //         }
    //     }
    // }

    // // infect unit by m_destList
    // this.UpdateDests = function(){
    //     for(let i = 0; i < this.m_destList.length; i++){
    //         if( this.m_destList[i].m_infList.length !== 0){
    //             for(let j = 0; j < this.m_destList[i].m_susList.length; j++){
    //                 if(Math.random() >= INF_PER){
    //                     this.m_unitList[this.m_destList[i].m_susList[j]].m_state = true;
    //                     let newInf = parseInt(this.m_destList[i].m_susList.splice(j, 1), 10);
    //                     this.m_destList[i].m_infList.push(newInf);
                        
    //                 }
    //             }
    //         }
    //     }
    // }


    /*---------- new function using map -----------*/

    // initialize unit and destination
    this.Init = function(units, dests){
        // init destination first, unit need to know how many dest there are
        for(let i = 0; i < dests; i++){
            this.m_destList.push(new Dest(locationLngLat[i]));
        }

        // init unit
        for(let i = 0; i < units; i++){
            this.m_unitList.push(new Unit(Math.floor(Math.random()* MAXTIME) + 1, Math.floor(Math.random()* MAXTIME) + 1));

            let first = 0;  // var for first dest
            for(let j = 0; j < MAXDEST; j++){   // random destination
                this.m_unitList[i].m_destPath.push(Math.floor(Math.random() * this.m_destList.length));
                if(j == this.m_unitList[i].m_pathPos){ first = this.m_unitList[i].GetDest(); }  
            }
            this.m_destList[first].m_susList.set(i, i);   // push units to their first dest                                                   
        }
    }

    // Spawn one infected at selected location
    this.SpawnSpot = function(dest_num){
        let spawn = this.m_destList[dest_num].m_susList.values().next().value;
        console.log("Dest_num: " + dest_num);
        console.log("Spawn: " + spawn);
        this.m_destList[dest_num].m_susList.delete(parseInt(spawn,10));                                                                                   
        //let spawn = this.m_destList[dest_num].m_susList.pop();   // last unit of the selected dest
        this.m_unitList[spawn].m_state = true;   // set infected state
        this.m_destList[dest_num].m_infList.set(parseInt(spawn,10), parseInt(spawn,10));        // move to infList
    }
    
    // Move unit by m_unitList
    this.MoveUnits = function(){
        for(let i = 0; i < this.m_unitList.length; i++){
            if(!this.m_unitList[i].m_onTrav){   // staying
                if(this.m_unitList[i].m_counter < this.m_unitList[i].m_stayDelay){  // keep staying
                    this.m_unitList[i].m_counter++; // update                        
                }else{  // moving out
                    let prevPos = this.m_unitList[i].m_pathPos;
                    this.m_unitList[i].m_pathPos = (this.m_unitList[i].m_pathPos + 1) % this.m_unitList[i].m_destPath.length;
                    if(this.m_unitList[i].m_destPath[prevPos] !== this.m_unitList[i].GetDest()){ // different dest
                        if(!this.m_unitList[i].m_state){
                            this.m_destList[this.m_unitList[i].m_destPath[prevPos]].m_susList.delete(i); 
                        }else{
                            this.m_destList[this.m_unitList[i].m_destPath[prevPos]].m_infList.delete(i);
                        }
                        this.m_unitList[i].m_onTrav = true   // is on travel
                    }
                    this.m_unitList[i].m_counter = 1; // reset counter
                }
            }else{  // traveling
                if(this.m_unitList[i].m_counter < this.m_unitList[i].m_travDelay){  // keep staying
                    this.m_unitList[i].m_counter++; // update  
                }else{  // arriving                                                                                                                                    
                    if(this.m_unitList[i].m_state == false){
                        this.m_destList[this.m_unitList[i].GetDest()].m_susList.set(parseInt(i,10),parseInt(i,10)); 
                    }else{
                        this.m_destList[this.m_unitList[i].GetDest()].m_infList.set(parseInt(i,10),parseInt(i,10)); 
                    }
                    this.m_unitList[i].m_counter = 0;   // reset counter
                    this.m_unitList[i].m_onTrav = false;    // is not travel
                }
            }
        }
    }

    // infect unit by m_destList
    this.UpdateDests = function(){
        for(let i = 0; i < this.m_destList.length; i++){
            if( this.m_destList[i].m_infList.size !== 0){
                for(let [key, value] of this.m_destList[i].m_susList){
                    if(Math.random() >= INF_PER){
                        this.m_unitList[this.m_destList[i].m_susList.get(value)].m_state = true;
                        this.m_destList[i].m_susList.delete(parseInt(value,10));
                        this.m_destList[i].m_infList.set(parseInt(value,10), parseInt(value,10));
                    }
                }
            }
        }
    }


    // positioning
    this.InitLocation = function(renderStep){

        for(let i = 0; i < this.m_unitList.length; i++){
            let step =  this.m_unitList[i].m_travDelay / (renderStep / 1000.0);
            for(j = 0; j < this.m_unitList[i].m_destPath.length; j++){

                // datPath
                let A = this.m_unitList[i].m_destPath[j];
                let B = this.m_unitList[i].m_destPath[(j+1) % this.m_unitList[i].m_destPath.length];
                for(k = 0; k <= step; k++){
                    let tempLngLat = [];
                    let stepFrac = k/step;
                    let Cal = this.m_destList[A].m_position.LerpTo(this.m_destList[B].m_position, stepFrac);
                    
                    tempLngLat.push(Cal.x);
                    tempLngLat.push(Cal.y);
                    this.m_datPath.push(tempLngLat); 

                }


                

                // datTimestamp
                let start = (this.m_unitList[i].m_stayDelay - 1) + (j * (this.m_unitList[i].m_stayDelay + this.m_unitList[i].m_stayDelay)) ;
                let end = start + this.m_unitList[i].m_travDelay;
                for(k = 0; k <= step; k++){
                    let stepFrac = k/step;
                    let time = Lerp(start, end, stepFrac);
                    this.m_datTimestamp.push(time);
                }
            }
        } 

        // console.log("datLength: " + this.m_datPath.length);

        // for(let i = 0; i < this.m_datPath.length; i++){
        //     console.log("datPath: " + this.m_datPath[i][0] + ", " + this.m_datPath[i][1]);
        // }
    
    }

    

    // this.UpdateLocation = function(renderStep){
    //     for(let i = 0; i < this.m_unitList.length; i++){
    //         if(this.m_unitList[i].m_onTrav){
    //             this.m_unitList[i].m_position.x = lerp (this.m_unitList[i].m_position.x, this.m_destList[this.m_unitList[i].GetDest()].m_position.x , renderStep * 0.001);
    //             this.m_unitList[i].m_position.y = lerp (this.m_unitList[i].m_position.y, this.m_destList[this.m_unitList[i].GetDest()].m_position.y , renderStep * 0.001);
    //         }
    //     }
    // }

}

function Unit(arg_stay, arg_trav) {
    this.m_state = false,       // boolean
    this.m_onTrav = false,      // boolean

    this.m_destPath = []
    this.m_pathPos = 0;
    
    this.m_stayDelay = arg_stay,
    this.m_travDelay = arg_trav,
    this.m_counter = 0

    //this.m_position = new Vec2(0,0);    // for visualization
    // this.m_anim = new DrawData();

    this.GetDest = function() { return this.m_destPath[this.m_pathPos]; }
    //this.GetDest = function(m_destPos) { return this.m_destPath[m_destPos]; }
}

function Dest(lnglat){

    // // using array
    // this.m_susList = [],  // list of sus in this location, position of unit in unitList[]
    // this.m_infList = []   // list of inf in this location

    // using map for optimization
    this.m_susList = new Map();
    this.m_infList = new Map();

    this.m_position = lnglat;    // for visualization
}

// test class 2
// separate sus and inf 

// var Sus = {     // susceptible
//     m_dest: [],     // array of destination that unit will take

//     m_stayDelay: 0,     // time spent in one location
//     m_travDelay: 0     // time spent travel from one place to another
// }

// var Inf = {     // infected
//     m_dest: [],     // array of destination that unit will take

//     m_stayDelay: 0,     // time spent in one location
//     m_travDelay: 0      // time spent travel from one place to another
// }

// function DrawData()
// {
//     this.datPath = [];
//     this.datTimestamp = [];
// }