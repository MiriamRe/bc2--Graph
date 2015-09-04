function Graph(v) {
    this.nodes = v;
    this.edges = 0;
    this.adjacent = [];
    for (var i = 0; i < this.nodes; i++) {
        this.adjacent[i] = [];
        
    }
    //this.addnode = addNode;
    this.addEdge = addEdge;
    this.showGraph = showGraph;
}

function addEdge(v, w) {
    this.adjacent[v].push(w);
    this.adjacent[w].push(v);
    this.edges++;
    //console.log('edges', this.adjacent);
}

function showGraph(){
    for (var i = 0; i < this.nodes; i++) {
    console.log( i + "->");
        for (var j = 0; j < this.nodes; j++) {
            if(this.adjacent[i][j] !== undefined) {
                console.log( this.adjacent[i][j] + " ");
            }
     
        }
        
        console.log( this.adjacent[i]);
    }
    
   
}



g = new Graph(5);

g.addEdge(0,1);
g.addEdge(0,2);
g.addEdge(1,3);
g.addEdge(2,4);

//console.log(g.edges)
g.showGraph();

g.addEdge(0,1);
g.addEdge(0,2);
g.addEdge(1,3);
g.addEdge(2,4);

//console.log(g.edges)
g.showGraph();