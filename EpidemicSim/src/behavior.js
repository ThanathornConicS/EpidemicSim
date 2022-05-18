// ========= Abstract class ==========
class B_Node{

    // Enum alternative
    NodeStates = Object.freeze({
        DEFAULT : "default",
        RUNNING : "running",
        SUCCESS : "success",
        FAILURE : "failure"
    });
    
    m_nodeState = NodeStates.DEFAULT;

    // Abstract Constructor
    constructor() {
        if(this.constructor == B_Node){
            //throw new Error(" Object of Abstract Class cannot be created");
        }
    }

    // Abstract Method
    Evaluate = function(){
        throw new Error("Abstract Method has no implementation");
    }

    GetNodeState = function(){
         return m_nodeState; 
    }
}

class DT_Node{
    
    m_positive;
    m_negative;

     // Abstract Method
     Evaluate = function(){
        throw new Error("Abstract Method has no implementation");
    }
}


// ========= B_Node class ==========

class ActionNode extends B_Node{

    constructor(action) {
        this.m_action = action;
    }
    
    Evaluate = function(){
        switch (m_action){
            case NodeStates.SUCCESS:
                m_nodeState = NodeStates.SUCCESS;
                return m_nodeState;
            case NodeStates.FAILURE:
                m_nodeState = NodeStates.FAILURE;
                return m_nodeState;
            case NodeStates.RUNNING:
                m_nodeState = NodeStates.RUNNING;
                return m_nodeState;
            default:
                m_nodeState = NodeStates.FAILURE;
                return m_nodeState;
        }
    }
}

class SelectorNode extends B_Node{

    constructor(nodes) {
        this.m_childNodes = nodes;
    }

    Evaluate = function(){
        for (let i = 0; i < m_childNodes.length; i++) { 
            switch (m_childNodes[i].Evaluate()){
                case NodeStates.FAILURE:
                    continue;
                case NodeStates.SUCCESS:
                    m_nodeState = NodeStates.SUCCESS;
                    return m_nodeState;
                case NodeStates.RUNNING:
                    m_nodeState = NodeStates.RUNNING;
                    return m_nodeState;
                default:
                    continue;
            }
        }
        m_nodeState = NodeStates.FAILURE;
        return m_nodeState;
    }
}

class SequenceNode extends B_Node{

    constructor(nodes) {
        this.m_childNodes = nodes;
    }

    Evaluate = function(){
        let anyChildRunning = false;

        for (let i = 0; i < m_childNodes.length; i++) { 
            switch (m_childNodes[i].Evaluate()){
                case NodeStates.FAILURE:
                    continue;
                case NodeStates.SUCCESS:
                    m_nodeState = NodeStates.SUCCESS;
                    return m_nodeState;
                case NodeStates.RUNNING:
                    m_nodeState = NodeStates.RUNNING;
                    return m_nodeState;
                default:
                    continue;
            }
        }
        m_nodeState = anyChildRunning ? NodeStates.RUNNING : NodeStates.SUCCESS;
        return m_nodeState;
    }
}

class InverterNode extends B_Node{

    constructor(node) {
        this.m_child = node; 
    }

    Evaluate = function(){
        switch (m_child.Evaluate()){
            case NodeStates.FAILURE:
                m_nodeState = NodeStates.SUCCESS;
                return m_nodeState;
            case NodeStates.SUCCESS:
                m_nodeState = NodeStates.FAILURE;
                return m_nodeState;
            case NodeStates.RUNNING:
                m_nodeState = NodeStates.RUNNING;
                return m_nodeState;
        }
        m_nodeState = NodeStates.SUCCESS;
        return m_nodeState;
    }
}


// ========= B_Tree ==========
class UnitBehavior{

    // Start Evaluate from root node
    Evaluate = function(){
        t1Selector.Evaluate();
    }

    // Get unit reference
    selectedUnit;
    
    SelectUnit = function(unit){
        this.selectedUnit = unit;
    }

    constructor() {
        // Condition
        isDetectInfect = new ActionNode(this.IsDetectInfect);
        isArrive_Q = new ActionNode(this.IsArrive_Q);
        isMoving = new ActionNode(this.IsMoving);
        isArrive_D = new ActionNode(this.IsArrive_D);

        // Action
        wait = new ActionNode(this.Wait);
        moveTo_Q = new ActionNode(this.MoveTo_Q);
        moveTo_D = new ActionNode(this.MoveTo_D);
        assignToPlace = new ActionNode(this.AssignToPlace);

        // Tree structure

        // T2 - L
        T2List_L = [];
        T2List_L.push(isDetectInfect);
        T2List_L.push(moveTo_Q);
        t2Sequence = new SequenceNode(T2List_L);

        // T5 - R
        t5List_R = [];
        t5List_R.push(isArrive_D);
        t5List_R.push(assignToPlace);
        t5Sequence = new SequenceNode(t5List_R);

        // T4 - R
        t4List_R = [];
        t4List_R.push(t5Sequence);
        t4List_R.push(MoveTo_D);
        t4Selector = new SelectorNode(t4List_R);

        // T3 - R
        t3List_R = [];
        t3List_R.push(IsMoving);
        t3List_R.push(t4Selector);
        t3Sequence = new SequenceNode(t3List_R);

        // T2 - R
        t2List_R = [];
        t2List_R.push(t3Sequence);
        t2List_R.push(wait);
        t2Selector = new SelectorNode(t2List_R);

        // T1
        t1List = [];
        t1List.push(t2Sequence);
        t1List.push(t2Selector);
        t1Selector = new SelectorNode(t1List);
    }

    IsDetectInfect = function(){
        if(selectedUnit.m_detect){
            return NodeStates.SUCCESS;
        }else{
            return NodeStates.FAILURE;
        }
    }

    IsArrive_Q = function(){
        if(!selectedUnit.m_active){
            return NodeStates.SUCCESS;
        }else{
            return NodeStates.FAILURE;
        }
    }

    IsMoving = function(){
        if(selectedUnit.m_onTrav){
            return NodeStates.SUCCESS;
        }else{
            return NodeStates.FAILURE;
        }
    }

    IsArrive_D = function(){
        if(!selectedUnit.m_onTrav){
            return NodeStates.SUCCESS;
        }else{
            return NodeStates.FAILURE;
        }
    }

    Wait = function(){
        selectedUnit.m_counter++;
    }
    
    MoveTo_Q = function(){
        selectedUnit.m_counter++;
    }

    MoveTo_D = function(){
        selectedUnit.m_counter++;
    }
    
    AssignToPlace = function(){
        // unit funtion to assign next place
    }
}