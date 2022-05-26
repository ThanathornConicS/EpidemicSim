// ========= B_Node Abstract class ==========
class B_Node{

    // Abstract Constructor
    constructor() {
        if(this.constructor == B_Node){
            //throw new Error(" Object of Abstract Class cannot be created");
        }

        // Enum alternative
        this.NodeStates = Object.freeze({
            DEFAULT : 0,
            RUNNING : 1,
            SUCCESS : 2,
            FAILURE : 3
        });

        this.m_nodeState = this.NodeStates.DEFAULT;
    }

    // Abstract Method
    Evaluate = function(){
        throw new Error("Abstract Method has no implementation");
    }

    GetNodeState = function(){
         return this.m_nodeState; 
    }
}

// ========= B_Node class ==========

class ActionNode extends B_Node{

    constructor(action) {
        super();
        this.m_action = action;
    }

    SetUnit(unit){
        this.selectUnit = unit;
    }
    
    Evaluate = function(){
        //console.log(this.m_action);
        switch (this.m_action(this.selectUnit)){
            case this.NodeStates.SUCCESS:
                this.m_nodeState = this.NodeStates.SUCCESS;
                return this.m_nodeState;
            case this.NodeStates.FAILURE:
                this.m_nodeState = this.NodeStates.FAILURE;
                return this.m_nodeState;
            case this.NodeStates.RUNNING:
                this.m_nodeState = this.NodeStates.RUNNING;
                return this.m_nodeState;
            default:
                this.m_nodeState = this.NodeStates.FAILURE;
                return this.m_nodeState;
        }
    }
}

class SelectorNode extends B_Node{

    constructor(nodes) {
        super();
        this.m_childNodes = nodes;
    }

    Evaluate = function(){
        for (let i = 0; i < this.m_childNodes.length; i++) { 
            //console.log(this.m_childNodes[i]);
            //console.log(this.m_childNodes[i].Evaluate());
            switch (this.m_childNodes[i].Evaluate()){
                case this.NodeStates.FAILURE:
                    continue;
                case this.NodeStates.SUCCESS:
                    this.m_nodeState = this.NodeStates.SUCCESS;
                    return this.m_nodeState;
                case this.NodeStates.RUNNING:
                    this.m_nodeState = this.NodeStates.RUNNING;
                    return this.m_nodeState;
                default:
                    continue;
            }
        }
        this.m_nodeState = this.NodeStates.FAILURE;
        return this.m_nodeState;
    }
}

class SequenceNode extends B_Node{

    constructor(nodes) {
        super();
        this.m_childNodes = nodes;
    }

    Evaluate = function(){
        let anyChildRunning = false;
        
        for (let i = 0; i < this.m_childNodes.length; i++) { 
            //console.log(this.m_childNodes[i]);
            //console.log(this.m_childNodes[i].Evaluate());
            switch (this.m_childNodes[i].Evaluate()){
                case this.NodeStates.FAILURE:
                    this.m_nodeState = this.NodeStates.FAILURE;
                    return this.m_nodeState;
                case this.NodeStates.SUCCESS:
                    continue;
                case this.NodeStates.RUNNING:
                    this.anyChildRunning = true;
                    continue;
                default:
                    m_nodeState = NodeStates.SUCCESS;
                    return m_nodeState;
            }
        }
        this.m_nodeState = anyChildRunning ? this.NodeStates.RUNNING : this.NodeStates.SUCCESS;
        return this.m_nodeState;
    }
}

class InverterNode extends B_Node{

    constructor(node) {
        super();
        this.m_child = node; 
    }

    Evaluate = function(){
        switch (this.m_child.Evaluate()){
            case this.NodeStates.FAILURE:
                this.m_nodeState = this.NodeStates.SUCCESS;
                return this.m_nodeState;
            case this.NodeStates.SUCCESS:
                this.m_nodeState = this.NodeStates.FAILURE;
                return this.m_nodeState;
            case this.NodeStates.RUNNING:
                this.m_nodeState = this.NodeStates.RUNNING;
                return this.m_nodeState;
        }
        this.m_nodeState = this.NodeStates.SUCCESS;
        return this.m_nodeState;
    }
}


// ========= B_Tree ==========
class UnitPath_Behavior{

    // Start Evaluate from root node
    Evaluate = function(unit){

        // Update unit ref
        this.isOnTravel.SetUnit(unit);
        this.isArrive.SetUnit(unit);
        this.isMoveOut.SetUnit(unit); 
        this.arriving.SetUnit(unit);
        this.movingOut.SetUnit(unit); 
        this.continue.SetUnit(unit);
        

        this.t1Selector.Evaluate();
    }

    constructor() {

        // // Condition
        // isDetectInfect = new ActionNode(this.IsDetectInfect);
        // isArrive_Q = new ActionNode(this.IsArrive_Q);
        // isMoving = new ActionNode(this.IsMoving);
        // isArrive_D = new ActionNode(this.IsArrive_D);

        // // Action
        // wait = new ActionNode(this.Wait);
        // moveTo_Q = new ActionNode(this.MoveTo_Q);
        // moveTo_D = new ActionNode(this.MoveTo_D);
        // assignToPlace = new ActionNode(this.AssignToPlace);

        // Get reference
        this.selectedUnit = new Unit();
        //this.manager_Ref = manager;
        
        // Condition
        this.isOnTravel = new ActionNode(this.IsOnTravel);
        this.isArrive = new ActionNode(this.IsArrive);
        this.isMoveOut = new ActionNode(this.IsMoveOut);

        // Action
        this.arriving = new ActionNode(this.Arriving);
        this.movingOut = new ActionNode(this.MovingOut);
        this.continue = new ActionNode(this.Continue);


        //Tree structure

        // T4 - L
        this.T4List_L = [];
        this.T4List_L.push(this.isArrive);
        this.T4List_L.push(this.arriving);
        this.t4Sequence = new SequenceNode(this.T4List_L);

        // T3 - L
        this.T3List_L = [];
        this.T3List_L.push(this.t4Sequence);
        this.T3List_L.push(this.continue);
        this.t3Selector = new SelectorNode(this.T3List_L);

        // T2 - L
        this.T2List_L = [];
        this.T2List_L.push(this.isOnTravel);
        this.T2List_L.push(this.t3Selector);
        this.t2Sequence = new SequenceNode(this.T2List_L);

        // T3 - R
        this.T3List_R = [];
        this.T3List_R.push(this.isMoveOut);
        this.T3List_R.push(this.movingOut);
        this.t3Sequence = new SequenceNode(this.T3List_R);

         // T2 - R
         this.T2List_R = [];
         this.T2List_R.push(this.t3Sequence);
         this.T2List_R.push(this.continue);
         this.t2Selector = new SelectorNode(this.T2List_R);

         // T1 - root
         this.T1List = [];
         this.T1List.push(this.t2Sequence);
         this.T1List.push(this.t2Selector);
         this.t1Selector = new SelectorNode(this.T1List);
    }
    //     // Tree structure
    //     // T2 - L
    //     T2List_L = [];
    //     T2List_L.push(isDetectInfect);
    //     T2List_L.push(moveTo_Q);
    //     t2Sequence = new SequenceNode(T2List_L);

    //     // T5 - R
    //     t5List_R = [];
    //     t5List_R.push(isArrive_D);
    //     t5List_R.push(assignToPlace);
    //     t5Sequence = new SequenceNode(t5List_R);

    //     // T4 - R
    //     t4List_R = [];
    //     t4List_R.push(t5Sequence);
    //     t4List_R.push(MoveTo_D);
    //     t4Selector = new SelectorNode(t4List_R);

    //     // T3 - R
    //     t3List_R = [];
    //     t3List_R.push(IsMoving);
    //     t3List_R.push(t4Selector);
    //     t3Sequence = new SequenceNode(t3List_R);

    //     // T2 - R
    //     t2List_R = [];
    //     t2List_R.push(t3Sequence);
    //     t2List_R.push(wait);
    //     t2Selector = new SelectorNode(t2List_R);

    //     // T1
    //     t1List = [];
    //     t1List.push(t2Sequence);
    //     t1List.push(t2Selector);
    //     t1Selector = new SelectorNode(t1List);
     
    
    // Condition Func

    IsOnTravel = function(unit){   
        //console.log("IsOnTravel Check...");
        //console.log(unit);

        // if(unit.m_onTrav){
        //     return this.NodeStates.SUCCESS;
        // }else{
        //     return this.NodeStates.FAILURE;
        // }

        let isOnTravel_DT = new IsOnTravel_DT(unit, this.NodeStates.SUCCESS, this.NodeStates.FAILURE);
        return isOnTravel_DT.Evaluate();
    }
    
    IsArrive = function(unit){
        //console.log("IsArrive Check...");

        // if(unit.m_counter >= unit.m_travDelay){
        //     return this.NodeStates.SUCCESS;
        // }else{
        //     return this.NodeStates.FAILURE;
        // }

        let isArrive_DT = new IsArrive_DT(unit, this.NodeStates.SUCCESS, this.NodeStates.FAILURE);
        return isArrive_DT.Evaluate();
    }

    IsMoveOut = function(unit){
        //console.log("IsMoveOut Check...");
        
        // if(unit.m_counter >= unit.m_stayDelay){
        //     return this.NodeStates.SUCCESS;
        // }else{
        //     return this.NodeStates.FAILURE;
        // }

        let isMoveOut_DT = new IsMoveOut_DT(unit, this.NodeStates.SUCCESS, this.NodeStates.FAILURE);
        return isMoveOut_DT.Evaluate();
    }

    // Action Func

    Arriving = function(unit){
        // assign unit to dest func() [Implement]
        //console.log("Arriving Check...");
        unit.behaviorTrigger = 1;
        unit.m_onTrav = false;
        unit.m_counter = 1;
        return this.NodeStates.SUCCESS;
    }

    MovingOut = function(unit){
         // remove unit from dest func() [Implement]
         //console.log("MovingOut Check...");
         unit.behaviorTrigger = 2;
         unit.m_onTrav = true;
         unit.m_counter = 1;
         return this.NodeStates.SUCCESS;
    }

    Continue = function(unit){
        //console.log("Continue Check...");
        unit.m_counter++;
        return this.NodeStates.SUCCESS;
    }

    // IsDetectInfect = function(){
    //     if(selectedUnit.m_detect){
    //         return NodeStates.SUCCESS;
    //     }else{
    //         return NodeStates.FAILURE;
    //     }
    // }

    // IsArrive_Q = function(){
    //     if(!selectedUnit.m_active){
    //         return NodeStates.SUCCESS;
    //     }else{
    //         return NodeStates.FAILURE;
    //     }
    // }

    // IsMoving = function(){
    //     if(selectedUnit.m_onTrav){
    //         return NodeStates.SUCCESS;
    //     }else{
    //         return NodeStates.FAILURE;
    //     }
    // }

    // IsArrive_D = function(){
    //     if(!selectedUnit.m_onTrav){
    //         return NodeStates.SUCCESS;
    //     }else{
    //         return NodeStates.FAILURE;
    //     }
    // }

    // Wait = function(){
    //     selectedUnit.m_counter++;
    // }
    
    // MoveTo_Q = function(){
    //     selectedUnit.m_counter++;
    // }

    // MoveTo_D = function(){
    //     selectedUnit.m_counter++;
    // }
    
    // AssignToPlace = function(){
    //     // unit funtion to assign next place
    // }
}


// ========= DT Abstract class ==========
class DT_Node{
    
    m_positive;
    m_negative;

     // Abstract Method
     Evaluate = function(){
        throw new Error("Abstract Method has no implementation");
    }
}

// ========= DT checking class ==========

class IsOnTravel_DT extends B_Node{

    constructor(unit, positive, negative)
    {
        super();
        this.m_unit = unit;
        this.m_positive = positive;
        this.m_negative = negative;
    }

    Evaluate = function(){
        if(this.m_unit.m_onTrav){
            return this.m_positive;
        }else{
            return this.m_negative;
        }
    }
}

class IsArrive_DT extends B_Node{

    constructor(unit, positive, negative)
    {
        super();
        this.m_unit = unit;
        this.m_positive = positive;
        this.m_negative = negative;
    }

    Evaluate = function(){
        if(this.m_unit.m_counter >= this.m_unit.m_travDelay){
            return this.m_positive;
        }else{
            return this.m_negative;
        }
    }
}

class IsMoveOut_DT extends B_Node{

    constructor(unit, positive, negative)
    {
        super();
        this.m_unit = unit;
        this.m_positive = positive;
        this.m_negative = negative;
    }
    
    Evaluate = function(){
        if(this.m_unit.m_counter >= this.m_unit.m_stayDelay){
            return this.m_positive;
        }else{
            return this.m_negative;
        }
    }

}