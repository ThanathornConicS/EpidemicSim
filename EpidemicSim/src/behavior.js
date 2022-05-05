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