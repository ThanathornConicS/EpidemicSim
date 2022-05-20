// ========= Abstract class ==========
class State{
    // Abstract Constructor
    constructor() {
        if(this.constructor == State){
            //throw new Error(" Object of Abstract Class cannot be created");
        }
    }
    // Abstract Method
    Evaluate = function(){
        throw new Error("Abstract Method has no implementation");
    }
}

class StateMachine{
    // Abstract Constructor
    constructor() {
        if(this.constructor == StateMachine){
            //throw new Error(" Object of Abstract Class cannot be created");
        }
    }

    // Members
    state = new State;
    SetState = function(state){
        this.state = state;
    }
}

// ========= State class ==========
class Susceptible extends State{

    constructor()
    {
        super();
    }

    Evaluate = function(){
        console.log( );
    }
} 

class Infected extends State{

    constructor()
    {
        super();
    }

    Evaluate = function(){
        console.log("I am a Infected");
    }
} 

class Recovered extends State{

    constructor()
    {
        super();
    }

    Evaluate = function(){
        console.log("I am a Recovered");
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