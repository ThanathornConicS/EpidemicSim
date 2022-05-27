// ========== Graph elements ==========

class GraphEdge{
    constructor(from, to, pathCost) {
        this.fromNode = from;
        this.toNode = to;

        // edge cost
        let vector = from.m_position.Sub(to.m_position);
        let cost = vector.Length();
        this.totalCost = pathCost + cost;
        
    }
}

class GraphNode{
    constructor(position) {
        this.m_position = position;
        this.neighbors = [];
        this.parent;
        this.isVisited = false;
    }
}

// ========== Graph Controller ==========
class PathFinder{
    constructor() {
        this.nodeList = [];
        this.bezierZone;
        this.start;
        this.end;
    }

    AddNode = function(node){
        this.nodeList.push(node);
    }

    SetNeighbor = function(from, to){
        this.nodeList[from].neighbors.push(this.nodeList[to]);
    }

    SetPath = function(A, B){
        this.start = this.nodeList[A];
        this.end = this.nodeList[B];
        for(let node of this.nodeList){
            node.isVisited = false;
        }
    }

    A_star = function(){
        let list = [];
        let graphEdge = new GraphEdge(this.start, this.start, 0)
        list.push(graphEdge);
        while(list.length > 0){

            // Find Least F
            let edge = 0;
            let F_least = Number.MAX_VALUE;

            // Calculate F - implement total cost
            for(let i = 0; i < list.length; i++){
                let G = list[i].totalCost;
                let vH = this.end.m_position.Sub(list[i].toNode.m_position);
                let H = vH.Length();
                let F = G + H;

                // Compare edge
                if(F < F_least){
                    F_least = F;
                    edge = i;
                }
            }

            let nextEdge = list[edge];
            list.splice(edge, 1);
            nextEdge.toNode.parent = nextEdge.fromNode;
            nextEdge.toNode.isVisited = true;
            
            //console.log("check");

            // check end path
            if (nextEdge.toNode == this.end){
                //console.log("quit");
                return;
            }

            for(let node of nextEdge.toNode.neighbors){
                if (!node.isVisited)
                    list.push(new GraphEdge(nextEdge.toNode, node, nextEdge.totalCost));
            }
        }
    }

    GetPath = function(bezierCheck){
        let pathList = []
        let child = this.end;

        if(this.start == this.end){
            //console.log("same")
            return pathList;
        }

        while(child.parent != child){
            pathList.unshift(child);
            child = child.parent;
        }
        pathList.unshift(this.start);

        // Check Bezier
        let bStart = false;
        let bEnd = false;
        
        for(let i = 0; i < pathList.length; i++){
            let bFound = false;
            for(let id of this.bezierZone){
                if(pathList[i] == this.nodeList[id]){
                    // Check entry point
                    if(!bStart){
                        bStart = true;
                        bezierCheck.push(i);
                        //console.log("bStart" + i);
                    }
                    bFound = true; 
                    break;
                }
            }

            //check exit point
            if(bStart && !bFound && !bEnd){
                bEnd = true;
                bezierCheck.push(i-1);
                //console.log("bEnd" + (i-1));
            }

        }
        
        // check last in
        if(bStart && !bEnd){
            bezierCheck.push(pathList.length - 1); 
            //console.log("bEnd" + (pathList.length - 1));
        }

        return pathList;
    }
}