// Variables
const MAXTIME = 10;
const MAXDEST = 3;
const INF_PER = 0.50; // range 0 to 1
const REDUCE_PROTECTION = 1;

// Interpolate func()
function Lerp(start, end, t) {
    return (1 - t) * start + t * end;
}

// Random number function
function GetRandomArbitrary(min, max) 
{
    return Math.random() * (max - min) + min;
}

// Vector2 Class
function Vec2(x, y){
    this.x = x;
    this.y = y;
    
    // Operation func()
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

    this.Log = function(){
        console.log("(" + this.x + ", " + this.y + ")");
    }

    // Interpolate func()
    this.LerpTo = function(end, t){
       let result = this.Mul(new Vec2(1.0 - t, 1.0 - t)).Add(end.Mul(new Vec2(t,t)));
       return result;  
    }
}

// Render data class
function DrawData() {
    this.datPath = new Map();
    this.stateCheck = new Map();
}

// Chart data class
function ChartData() {
    this.S = [];
    this.I = [];
    this.R = [];
}

// ========= Unit class ==========
class Unit extends StateMachine{
    constructor(arg_stay, arg_trav) {
        super();
        // Unit timer
        this.m_stayDelay = arg_stay;
        this.m_travDelay = arg_trav;
        this.m_counter = 0;

        // Unit state
        this.SetState(new Susceptible);
        this.m_state = false;
        this.m_onTrav = false;

        // Unit path
        this.m_destPath = [];
        this.m_pathPos = 0;

        // Protection Value
        this.m_protectionFactor = 0.0;

        // Infected Value
        this.m_curedPercentage = 0.0;
        this.m_deathPercentage = 0.0;

        // Behavior Val
        this.m_detect = false;
        this.m_active = true;
        this.behaviorTrigger = 0;
    }

    // Func()
    GetDestID = function () {
        return this.m_destPath[this.m_pathPos];
    }

    NextPath = function () {
        return (this.m_pathPos + 1) % this.m_destPath.length;
    }
        
}

// function Unit(arg_stay, arg_trav) {
//     // Unit state
//     this.m_state = false;
//     this.m_onTrav = false;

//     // Unit path
//     this.m_destPath = [];
//     this.m_pathPos = 0;

//     // Unit timer
//     this.m_stayDelay = arg_stay;
//     this.m_travDelay = arg_trav;
//     this.m_counter = 0;

//     // Func()
//     this.GetDestID = function () {
//         return this.m_destPath[this.m_pathPos];
//     }

//     this.NextPath = function () {
//         return (this.m_pathPos + 1) % this.m_destPath.length;
//     }
// }

// ====== Destination class ======
function Dest(lnglat) {
    // Unit ID container
    this.m_susList = new Map();
    this.m_infList = new Map();

    this.m_position = lnglat;
}

// ======== Manager class ========
function Manager() {
    // Object container
    this.m_unitList = [];
    this.m_destList = [];
    // Step tracking
    this.currStep = 0;
    this.renderStep = 10; // per render update (ms)
    this.stepSol = 1 / (this.renderStep / 1000);

    // Rate of cure/death
    this.curedRate = 0.0;
    this.deathRate = 0.0;

    // DrawData container
    this.m_drawData = [];

    // Chart Stat
    this.m_chartData = new ChartData();

    // Fuzzy State Modules
    this.SuscepState = new PreInfect_Susceptible();
    this.MildState = new PreInfect_MildInfect();
    this.SevereState = new PreInfect_SevereInfect();
    
    // Behavior Tree
    this.unitPath_Behavior = new UnitPath_Behavior(this);

    this.CountStat = function(){
        let Sn = 0;
        let In = 0;
        let Rn = 0;

        for(let i = 0; i < this.m_unitList.length; i++){
            if(!this.m_unitList[i].m_active){
                Rn++;
            }else if(this.m_unitList[i].m_state){
                In++;
            }else{
                Sn++;
            }
        }

        this.m_chartData.S.push(Sn);
        this.m_chartData.I.push(In);
        this.m_chartData.R.push(Rn);

        //console.log("count: " + this.m_chartData.S + ", " + this.m_chartData.I + ", " + this.m_chartData.R);
    }

    this.GetStat = function(){
        return this.m_chartData;
    }

    this.SetCureDeathRate = function(cRate, dRate)
    {
        this.curedRate = parseFloat(cRate / 100.0); this.deathRate = parseFloat(dRate / 100.0);
    }

    // Add destination
    this.AddPlace = function(LngLat){
        this.m_destList.push(new Dest(LngLat));        
    }

    // Set step
    this.SetStep = function(step){
        this.currStep = step
    }

    // Initialize unit and destination
    this.UnitInit = function (units, dests) {

        // Initialize unit
        for (let i = 0; i < units; i++) {
            // Unit & drawdata
            this.m_unitList.push(new Unit(Math.floor(Math.random() * MAXTIME) + 1, Math.floor(Math.random() * MAXTIME) + 1));
            this.m_drawData.push(new DrawData);
            
            // Generate unit path
            for (let j = 0; j < MAXDEST; j++) {   
                this.m_unitList[i].m_destPath.push(Math.floor(Math.random() * this.m_destList.length));
            }

            // Push unit ID to it's first destination
            let first = this.m_unitList[i].GetDestID();
            this.m_destList[first].m_susList.set(i, i); 
            // console.log(i + " : " + first);
            // console.log(this.m_destList);

            // Random Protection factor for each unit
            this.m_unitList[i].m_protectionFactor = GetRandomArbitrary(0, 100);
        }

        // Initialize Fuzzy states
        this.SuscepState.InitFuzzy();
        this.MildState.InitFuzzy();
        this.SevereState.InitFuzzy();
        // console.log("Init Fuzzy... [PASS]");
    }

    // Spawn infected at selected destination
    this.SpawnInf = function (dest_num) {
        // Pick the first element of susList
        let spawn = this.m_destList[dest_num].m_susList.values().next().value;
        // Set infected state & move to infList
        this.m_unitList[spawn].m_state = true;

        // testing
        this.m_unitList[spawn].SetState(new Infected);
        //this.m_unitList[spawn].state.Evaluate();

        this.m_destList[dest_num].m_susList.delete(parseInt(spawn, 10));   
        this.m_destList[dest_num].m_infList.set(parseInt(spawn, 10), parseInt(spawn, 10));
        // Save to state check
        this.StateTrigger(spawn, this.currStep, true);
    }

    // Unit decision making 
    this.UpdateUnits = function () {
        for (let i = 0; i < this.m_unitList.length; i++) {
            // Evaluate unit behavior
            this.unitPath_Behavior.Evaluate(this.m_unitList[i]);

            // Check action trigger
            switch (this.m_unitList[i].behaviorTrigger){
                case 1: // Arriving in
                    this.m_unitList[i].behaviorTrigger = 0;
                    let nextDest = this.m_unitList[i].GetDestID();

                    // assign to est
                    if (!this.m_unitList[i].m_state) {
                        this.m_destList[nextDest].m_susList.set(parseInt(i, 10), parseInt(i, 10));
                    } else {
                        this.m_destList[nextDest].m_infList.set(parseInt(i, 10), parseInt(i, 10));
                    }
                    break;

                case 2: // Moving out
                    this.m_unitList[i].behaviorTrigger = 0;
                    let prevDest = this.m_unitList[i].GetDestID();
                    this.m_unitList[i].m_pathPos = this.m_unitList[i].NextPath();

                    // Check if next destination is different
                    if (this.m_unitList[i].GetDestID() !== prevDest) {
                        if (!this.m_unitList[i].m_state) {
                            this.m_destList[prevDest].m_susList.delete(parseInt(i, 10));
                        } else {
                            this.m_destList[prevDest].m_infList.delete(parseInt(i, 10));
                        }
                    }
                    break;

                default:
                    break;
            }

            // if(i == 0){
            //     console.log("unit[0] counter: " + this.m_unitList[i].m_counter);
            // }
            // // Unit Staying
            // if (!this.m_unitList[i].m_onTrav) {
            //     // Check state condition
            //     if (this.m_unitList[i].m_counter < this.m_unitList[i].m_stayDelay) {  
            //         this.m_unitList[i].m_counter++;                   
            //     } else {
            //         // Moving out & update next destination
            //         let prevDest = this.m_unitList[i].GetDestID();
            //         this.m_unitList[i].m_pathPos = this.m_unitList[i].NextPath();
            //         // Check if next destination is different
            //         if (this.m_unitList[i].GetDestID() !== prevDest) {
            //             if (!this.m_unitList[i].m_state) {
            //                 this.m_destList[prevDest].m_susList.delete(parseInt(i, 10));
            //             } else {
            //                 this.m_destList[prevDest].m_infList.delete(parseInt(i, 10));
            //             }
            //             // Set to travel state
            //             this.m_unitList[i].m_onTrav = true
            //         }
            //         // Reset counter
            //         this.m_unitList[i].m_counter = 1;
            //     }

            // // Unit Travelling
            // } else {
            //     // Check state condition
            //     if (this.m_unitList[i].m_counter < this.m_unitList[i].m_travDelay) {  
            //         this.m_unitList[i].m_counter++;  
            //     } else {
            //         // arriving
            //         let nextDest = this.m_unitList[i].GetDestID();
            //         if (!this.m_unitList[i].m_state) {
            //             this.m_destList[nextDest].m_susList.set(parseInt(i, 10), parseInt(i, 10));
            //         } else {
            //             this.m_destList[nextDest].m_infList.set(parseInt(i, 10), parseInt(i, 10));
            //         }
            //         // Set to stay state & reset counter
            //         this.m_unitList[i].m_onTrav = false;
            //         this.m_unitList[i].m_counter = 1;
            //     }
            // }
        }
    }

    // Infect unit by m_destList
    this.SpreadByDest = function () {
        for (let i = 0; i < this.m_destList.length; i++) {
            // Check if infected is present
            if (this.m_destList[i].m_infList.size !== 0) {
                // Randomly infect susList
                for (let [key, value] of this.m_destList[i].m_susList) 
                {
                    // Math Random Infect
                    // if (Math.random() >= INF_PER) {
                    //     let unitID = this.m_destList[i].m_susList.get(value);
                    //     // Set infected state & move to infList
                    //     this.m_unitList[unitID].m_state = true;
                    //     this.m_destList[i].m_susList.delete(parseInt(value, 10));
                    //     this.m_destList[i].m_infList.set(parseInt(value, 10), parseInt(value, 10));

                    //     // Save to state check
                    //     this.StateTrigger(unitID, this.currStep, true);
                    // }
                    
                    // Fuzzy Infect
                    let unitID = this.m_destList[i].m_susList.get(value);
                    let susValue = this.SuscepState.GetDesirability(this.m_unitList[unitID].m_protectionFactor, this.m_unitList[unitID].m_stayDelay);
                    let mildValue = this.MildState.GetDesirability(this.m_unitList[unitID].m_protectionFactor, this.m_unitList[unitID].m_stayDelay);
                    let servereValue = this.SevereState.GetDesirability(this.m_unitList[unitID].m_protectionFactor, this.m_unitList[unitID].m_stayDelay);
                    
                    let valueList = [susValue, mildValue, servereValue];
                    let maxIdx = 0; 
                    let maxVal = valueList[0];
                    console.log("List: " + valueList);
                    console.log("Prot/Expos: " + this.m_unitList[unitID].m_protectionFactor + ": " + this.m_unitList[unitID].m_stayDelay);
                    for(let i = 0; i < 3; i++)
                    {
                        if (maxVal < valueList[i])
                        {
                            maxVal = valueList[i];
                            maxIdx = i;
                            //console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
                        }
                    }
                    
                    switch (maxIdx) 
                    {
                        case 0:
                            this.m_unitList[unitID].m_protectionFactor -= REDUCE_PROTECTION * this.m_unitList[unitID].m_stayDelay;
                            if(this.m_unitList[unitID].m_protectionFactor < 0)
                                this.m_unitList[unitID].m_protectionFactor = 0.0;
                            console.log(maxIdx + " : Non");
                            break;
                        case 1:     // Mildly Infected
                            // Set infected state & move to infList
                            this.m_unitList[unitID].m_state = true;
                            this.m_unitList[unitID].m_curedPercentage = GetRandomArbitrary((this.curedRate) - 1.0, 1.0);
                            this.m_unitList[unitID].m_deathPercentage = GetRandomArbitrary((this.deathRate) - 1.0, 1.0);

                            this.m_destList[i].m_susList.delete(parseInt(value, 10));
                            this.m_destList[i].m_infList.set(parseInt(value, 10), parseInt(value, 10));

                            // Save to state check
                            this.StateTrigger(unitID, this.currStep, true);
                            console.log(maxIdx + " : Mild");
                            break;
                        case 2:     // Severely Infected
                            // Set infected state & move to infList
                            this.m_unitList[unitID].m_state = true;
                            this.m_unitList[unitID].m_curedPercentage = GetRandomArbitrary((this.curedRate) - 1.0, 1.0);
                            this.m_unitList[unitID].m_deathPercentage = GetRandomArbitrary((this.deathRate) - 1.0, 1.0);

                            this.m_destList[i].m_susList.delete(parseInt(value, 10));
                            this.m_destList[i].m_infList.set(parseInt(value, 10), parseInt(value, 10));

                            // Save to state check
                            this.StateTrigger(unitID, this.currStep, true);
                            console.log(maxIdx +" : Severe");
                            break;
                    
                        default:
                            break;
                    }
                }
            }
        }
    }

    // Save step at state change
    this.StateTrigger = function (unitID, step, state) {
        let updateFrame = step * this.stepSol;
        this.m_drawData[unitID].stateCheck.set(parseInt(updateFrame, 10), state);
    }

    // Calculate the positioning of each units
    this.RenderCalculate = function () {
        for (let i = 0; i < this.m_unitList.length; i++) {
            // Render frequncy
            let step =  this.m_unitList[i].m_travDelay * this.stepSol;
            for (let j = 0; j < this.m_unitList[i].m_destPath.length; j++) {
                // Get start & end Point
                this.m_unitList.m_pathPos = j;
                let A = this.m_unitList[i].m_destPath[j];
                let B = this.m_unitList[i].m_destPath[(j + 1) % this.m_unitList[i].m_destPath.length];
                // Get timestamp
                let period = this.m_unitList[i].m_stayDelay + this.m_unitList[i].m_stayDelay;
                let start = (this.m_unitList[i].m_stayDelay - 1) + (j * period);
                let end = start + this.m_unitList[i].m_travDelay;

                // Calculate path
                for (let k = 0; k < step; k++) {
                    let stepFrac = k / step;
                    let stepPos = this.m_destList[A].m_position.LerpTo(this.m_destList[B].m_position, stepFrac)
                    let stepTime = (start * this.stepSol) + k;

                    this.m_drawData[i].datPath.set(stepTime, stepPos);
                }
            }
        }
    }
}