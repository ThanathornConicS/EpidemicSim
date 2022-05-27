// ========== Graph elements ==========

class GraphEdge{
    constructor(from, to, pathCost) {
        this.fromNode = from;
        this.toNode = to;

        // edge cost
        let vector = from.position - to.position;
        let cost = vector.Length();
        this.totalCost = pathCost + cost;
    }
}

class GraphNode{
    constructor(position) {
        this.m_position = position;
        this.neighbors = [];
        this.parent = new GraphNode();
        this.isVisited = false;
    }
}

// ========== Graph Controller ==========
class PathFinder{
    constructor() {
        this.nodeList = [];
        this.start = new GraphNode();
        this.end = new GraphNode();
        this.isPathReady = false;
    }

    AddNode = function(node){
        nodeList.push(node);
    }

    SetPath = function(A, B){
        this.start = A;
        this.end = B;
        
        // reset when recieve new path
        this.isPathReady = false;
    }

    A_star = function(){
        let list = [];
        list.push(new GraphEdge(start, start));

        while(list.length > 0){

            // Find Least F
            let edge = 0;
            let F_least = Number.MAX_VALUE;

            // Calculate F - implement total cost
            for(let i = 0; i < list.length; i++){
                let G = list[i].totalCost;
                let vH = end.m_position - list[i].toNode.m_position;
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

            // check end path
            if (nextEdge.toNode == end){
                isPathReady = true;
                return;
            }

            for(let node of nextEdge.toNode.neighbors){
                if (!node.isVisited)
                    list.push(new GraphEdge(nextEdge.toNode, node));
            }
        }
    }
}