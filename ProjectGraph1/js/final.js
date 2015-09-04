
var Graph = function() {
	this.nodeSet = {};
	this.nodes = [];
	this.edges = [];
	this.adjacency = {};

	this.nextNodeId = 0;
	this.nextEdgeId = 0;
};

var Node = function(id, data) {
	this.id = id;
	this.data = (data !== undefined) ? data : {};
};

var Edge = function(id, source, target, data) {
	this.id = id;
	this.source = source;
	this.target = target;
	this.data = (data !== undefined) ? data : {};
};

Graph.prototype.addNode = function(node) {
	if (!(node.id in this.nodeSet)) {
		this.nodes.push(node);
	}

	this.nodeSet[node.id] = node;

	return node;
};


Graph.prototype.addEdge = function(edge) {
	var exists = false;
	this.edges.forEach(function(e) {
		if (edge.id === e.id) { exists = true; }
	});

	if (!exists) {
		this.edges.push(edge);
	}

	if (!(edge.source.id in this.adjacency)) {
		this.adjacency[edge.source.id] = {};
	}
	if (!(edge.target.id in this.adjacency[edge.source.id])) {
		this.adjacency[edge.source.id][edge.target.id] = [];
	}

	exists = false;
	this.adjacency[edge.source.id][edge.target.id].forEach(function(e) {
			if (edge.id === e.id) { exists = true; }
	});

	if (!exists) {
		this.adjacency[edge.source.id][edge.target.id].push(edge);
	}
	return edge;
};

Graph.prototype.newNode = function(label, x, y) {
    var data = {label : label, x: x, y: y};
	var node = new Node(this.nextNodeId++, data);
	this.addNode(node);
	return node;
};

Graph.prototype.newEdge = function(source, target, color) {
    var data = {color: color};
	var edge = new Edge(this.nextEdgeId++, source, target, data);
	this.addEdge(edge);
	return edge;
};


Graph.prototype.getEdges = function(node1, node2) {
	if (node1.id in this.adjacency
		&& node2.id in this.adjacency[node1.id]) {
		return this.adjacency[node1.id][node2.id];
	}

	return [];
};

Graph.prototype.traverse = function() {

};

Graph.prototype.drawGraph = function(){
	var c = document.getElementById("mycanvas");
	var ctx = c.getContext("2d");
	
	for(var j = 0; j < this.edges.length; j++){
		var label = this.nodes[j].data.label;
		var x = this.nodes[j].data.x;
		var y = this.nodes[j].data.y;
		var tx = this.edges[j].target.data.x;
		var ty = this.edges[j].target.data.y;
		var label = graph.nodes[j].data.label;
		var color = this.edges[j].data.color;
		var rectx = x;
		var recty = y;

		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(tx, ty);
		ctx.lineWidth = 1;
		ctx.strokeStyle = color;
		ctx.stroke();
		
		ctx.beginPath();
		ctx.fillStyle = "red"
		ctx.strokeStyle = color
		ctx.arc(rectx, recty, 30, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		ctx.fillStyle = color
		ctx.font = "13px Arial";
		ctx.fillText(label,x,y);


	}
};

var traverse = function (startNode){
    this.startNode = startNode;
    for(g = 0; g < graph.nodes.length; g++){
        if(startNode == graph.edges[g].source.data.label)
        startNode = graph.edges[g].id;
    }
    var d = {};
    var e = [];
    
    for(var key in graph.adjacency){
    
        d[key] = Object.keys(graph.adjacency[key]);
    }
    
    this.init = function(visited, d) {
        for (var key in d) {
           var vertex = d[key];
            visited[key] = false;
        }
    };

    this.breadthFirst = function(d, startNode, visited){
        var queue = [];
    
        queue.push(startNode);
    
        visited[startNode] = true;
    
        result.push( startNode );
    
        while (queue.length > 0) {
    
           var currentVertexID = queue.shift();
    
           var currentVertex = d[currentVertexID];
           for (var key in currentVertex) {
    
           var target = currentVertex[key];
    
                if (!visited[target]) {
    
                    visited[target] = true;
    
                    queue.push(target);
    
                    result.push(target);
                }
            }
        }
    };

    var result = [];
    var visited = [];
    init(visited, d);
    breadthFirst(d, startNode, visited);    
    for(var k in result){
        e.push(graph.nodes[result[k]].data.label);
    }
    return e;
};

var graph = new Graph();


