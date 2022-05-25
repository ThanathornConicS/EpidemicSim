// ========= Abstract class ==========
class State{
    // Abstract Constructor
    constructor() 
    {
        if(this.constructor == State)
            throw new Error(" Object of Abstract Class cannot be created");
        
    }
    // Abstract Method
    OnExecute = function(){
        throw new Error("Abstract Method has no implementation");
    }
    OnEnter = function(){
        throw new Error("Abstract Method has no implementation");
    }
    OnExit = function(){
        throw new Error("Abstract Method has no implementation");
    }
}

class StateMachine{
    // Abstract Constructor
    constructor() 
    {
        if(this.constructor == StateMachine)
            throw new Error(" Object of Abstract Class cannot be created");
        
        // Members
        this.currentState = null;
    }

    SetState(state)
    {
        if(this.currentState != null)
        {   
            this.currentState.OnExit();
        }

        this.currentState = state;
        this.currentState.OnEnter();
    }
    GetState = function()
    {
        return this.currentState;
    }
}

// ========= State class ==========
class Susceptible extends State
{
    constructor()
    {
        super();
    }

    OnEnter = function(){
        console.log("Im Okay!");
    }
    OnExecute = function(){
        console.log("Im still doing Okay!");
    }
    OnExit = function(){
        console.log("Oh no...");
    }
} 

class Infected extends State
{

    constructor()
    {
        super();
    }

    OnEnter = function(){
        console.log("-_-");
    }
    OnExecute = function(){
        console.log("I am infected");
    }
    OnExit = function(){
        console.log("Hope that I will survive");
    }
}

class Recovered extends State
{

    constructor()
    {
        super();
    }
    
    OnEnter = function(){
        console.log("Im cured!");
    }
    OnExecute = function(){
        console.log("Still good");
    }
    OnExit = function(){
        console.log("NOT AGAIN!!");
    }
}


class Removed extends State
{

    constructor()
    {
        super();
    }

    OnEnter = function(){
        console.log("Am I dead?");
    }
    OnExecute = function(){
        console.log("Yep I am dead");
    }
    OnExit = function(){
        console.log("----");
    }
}

// class Agent extends StateMachine{
//     constructor(input) {
//         super();
//         this.SetState(new Infected);
//         this.state.Evaluate();
//         console.log("Input: " + input);
//     }
// }

// let testSubject = new Agent;