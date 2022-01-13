// variables
const MAXTIME = 2;
const MAXDEST = 3;
const INF_PER = 0.50; // range 0 to 1

function DrawData()
{
    this.vendor = 0;
    this.datPath = [];
    this.datTimestamps = [];
}

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
    return (1-amt)*start+amt*end;
}


// ----------class----------
function Manager() {
    this.m_unitList = [],
    this.m_destList = [],

    // this.m_datPath = [],
    // this.m_datTimestamp = [],
    // this.m_datColor = [],

    this.m_animData = [],
    this.m_infAnimData = [],
    this.m_vendorColor = [],

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
            
            // initialize infAnimData
            this.m_infAnimData.push(new DrawData());
        }
    }

    // Spawn one infected at selected location
    this.SpawnSpot = function(dest_num){
        let spawn = this.m_destList[dest_num].m_susList.values().next().value;
        // console.log("Dest_num: " + dest_num);
        // console.log("Spawn: " + spawn);
        this.m_destList[dest_num].m_susList.delete(parseInt(spawn,10));                                                                                   
        //let spawn = this.m_destList[dest_num].m_susList.pop();   // last unit of the selected dest
        this.m_unitList[spawn].m_state = true;   // set infected state
        this.m_destList[dest_num].m_infList.set(parseInt(spawn,10), parseInt(spawn,10));        // move to infList
    }
    
    // Move unit by m_unitList
    this.MoveUnits = function(hour, day){
        for(let i = 0; i < this.m_unitList.length; i++){

            //check awake
            if(this.m_unitList[i].awakeAt == hour){
                this.m_unitList[i].isAwake = true;
            }

            if(this.m_unitList[i].isAwake == true){
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
                                // inf path & timestamp out
                                this.m_infAnimData[i].datPath.push(this.m_destList[this.m_unitList[i].m_destPath[prevPos]].m_position)
                                this.m_infAnimData[i].datTimestamps.push(hour + (day * 24))
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
                            // inf path & timestamp in
                            this.m_infAnimData[i].datPath.push(this.m_destList[this.m_unitList[i].GetDest()].m_position)
                            this.m_infAnimData[i].datTimestamps.push(hour + (day * 24))
                        }
                        this.m_unitList[i].m_counter = 0;   // reset counter
                        this.m_unitList[i].m_onTrav = false;    // is not travel
                        if(this.m_unitList[i].m_pathPos == 0){ this.m_unitList[i].isAwake = false;} // set sleep
                    }
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

    this.UpdateAnimColor = function(){
        m_vendorColor = [];     // clear
        for(let i = 0; i < manager.m_unitList.length; i++){
            let check = manager.m_unitList[i].m_state;
            manager.m_vendorColor.push(VENDOR_COLORS[Number(check)]);
        }
    }

    // init positioning
    this.InitLocation = function(renderStep){

        for(let i = 0; i < this.m_unitList.length; i++){
            //let step =  this.m_unitList[i].m_travDelay / (renderStep / 1000.0);
            //let step = 1;
            let tempDrawData = new DrawData();
            for(j = 0; j < this.m_unitList[i].m_destPath.length; j++){

                // datPath
                let A = this.m_unitList[i].m_destPath[j];
                let B = this.m_unitList[i].m_destPath[(j+1) % this.m_unitList[i].m_destPath.length];
                // datTimestamp
                let start = (this.m_unitList[i].m_stayDelay - 1) + (j * (this.m_unitList[i].m_stayDelay + this.m_unitList[i].m_stayDelay)) ;
                let end = start + this.m_unitList[i].m_travDelay;

                let tempLngLat_s = [];
                tempLngLat_s.push(this.m_destList[A].m_position.x.toFixed(5));
                tempLngLat_s.push(this.m_destList[A].m_position.y.toFixed(5));

                tempDrawData.datPath.push(tempLngLat_s); 
                tempDrawData.datTimestamps.push(start);

                let tempLngLat_e = [];
                tempLngLat_e.push(this.m_destList[B].m_position.x.toFixed(5));
                tempLngLat_e.push(this.m_destList[B].m_position.y.toFixed(5));

                tempDrawData.vendor = i;
                tempDrawData.datPath.push(tempLngLat_e); 
                tempDrawData.datTimestamps.push(end);
                
                // for(k = 0; k <= step; k++){
                //     let tempLngLat = [];
                //     let stepFrac = k/step;
                //     let Cal = this.m_destList[A].m_position.LerpTo(this.m_destList[B].m_position, stepFrac);
                    
                //     //let stepFrac = k/step;
                //     let time = Lerp(start, end, stepFrac) * 100;

                //     tempLngLat.push(Cal.x);
                //     tempLngLat.push(Cal.y);

                //     tempDrawData.datPath.push(tempLngLat); 
                //     tempDrawData.datTimestamps.push(time);
                // }
            }
            this.m_animData.push(tempDrawData);
        } 
    }
}

function Unit(arg_stay, arg_trav) {
    this.m_state = false,       
    this.m_onTrav = false,      

    this.m_destPath = []
    this.m_pathPos = 0;
    this.awakeAt = Math.floor(Math.random() * (24 /*hrs*/ - (MAXDEST * (arg_stay + arg_trav))));  // awake time
    this.isAwake = false;
    
    this.m_stayDelay = arg_stay,
    this.m_travDelay = arg_trav,
    this.m_counter = 0

    this.GetDest = function() { return this.m_destPath[this.m_pathPos]; }
}

function Dest(lnglat){
    this.m_susList = new Map();
    this.m_infList = new Map();

    this.m_position = lnglat;    
}