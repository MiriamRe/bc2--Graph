/**
 * Base graph class, handles containment of data points and the overarching
 * interface of all graph classes.
 *
 * @class
 * @param {Number} width
 * @param {Number} height
 * @param {*} [initialDataSource]
 */
function Graph(width, height, initialDataSource) {
	this.setDataSource(initialDataSource);
	this.initialiseCanvas(width, height);
}

/**
 * Initialises the canvas element and stores it's context object. It will also
 * set the initial width and height.
 *
 * @param {Number} width
 * @param {Number} height
 */
Graph.prototype.initialiseCanvas = function (width, height) {
	this._canvas = document.createElement('canvas');
	this._context = this._canvas.getContext('2d');
	this.setSize(width, height);
};

/**
 * Updates the current size of the graph.
 *
 * @param {Number} width
 * @param {Number} height
 */
Graph.prototype.setSize = function (width, height) {
	this._canvas.width = this._width = width;
	this._canvas.height = this._height = height;
};

/**
 * Fetches the actual canvas DOM node. This can be used to place the canvas
 * within your page.
 *
 * @return {HTMLElement}
 */
Graph.prototype.getCanvasElement = function () {
	return this._canvas;
};

/**
 * Updates the current data source. The values contained within are used to
 * render the actual graph.
 *
 * @param {*} dataSource
 */
Graph.prototype.setDataSource = function (dataSource) {
	this._dataSource = dataSource;
};

/**
 * Renders the current data source onto the canvas.
 */
Graph.prototype.renderGraph = function () {
	this.clearCanvasElement();
	this.drawDataSourceOntoCanvasElement();
};

/**
 * Clears the current canvas state.
 */
Graph.prototype.clearCanvasElement = function () {
	this._context.clearRect(0, 0, this._width, this._height);
};

/**
 * Draws the current data source onto the canvas.
 *
 * @abstract
 */
Graph.prototype.drawDataSourceOntoCanvasElement = function () {};





/**
 * Line graph, used for plotting a value over time.
 *
 * @class
 * @augments Graph
 */
function LineGraph() {
	Graph.apply(this, arguments);
}

LineGraph.prototype = Object.create(Graph.prototype);

/**
 * Updates the current data source. The values contained within are used to
 * render the actual graph.
 *
 * This will also calculate the bounds for line graph. Overrides the original
 * Graph#setDataSource method.
 *
 * @param {Object} dataSource
 */
LineGraph.prototype.setDataSource = function (dataSource) {
	Graph.prototype.setDataSource.call(this, dataSource);
	this._values = this.getDataSourceItemValues();
	this.calculateDataSourceBounds();
};

/**
 * Flattens all of the value arrays into one single array. This is much easier
 * to iterate over.
 *
 * @return {Number[][]}
 */
LineGraph.prototype.getDataSourceItemValues = function () {
	var dataSource = this._dataSource;
	var values = [];
	var key;

	for (key in dataSource) {
		if (dataSource.hasOwnProperty(key)) {
			values.push(dataSource[key].values);
		}
	}

	return values;
};

/**
 * Calculates the upper X and Y axis bounds for the current data source.
 */
LineGraph.prototype.calculateDataSourceBounds = function () {
	this._bounds = {
		x: this.getLargestDataSourceItemLength(),
		y: this.getLargestDataSourceItemValue()
	};
};

/**
 * Fetches the length of the largest (or longest) data source item. This is the
 * one with the most values within it's values array.
 *
 * @return {Number}
 */
LineGraph.prototype.getLargestDataSourceItemLength = function () {
	var values = this._values;
	var length = values.length;
	var max = 0;
	var currentLength;
	var i;

	for (i = 0; i < length; i++) {
		currentLength = values[i].length - 1;

		if (currentLength > max) {
			max = currentLength;
		}
	}

	return max;
};

/**
 * Fetches the largest value out of all the data source items.
 *
 * @return {Number}
 */
LineGraph.prototype.getLargestDataSourceItemValue = function () {
	var values = this._values;
	var length = values.length;
	var max = 0;
	var currentItem;
	var i;

	for (i = 0; i < length; i++) {
		currentItem = Math.max.apply(Math, values[i]);

		if (currentItem  > max) {
			max = currentItem;
		}
	}

	return max;
};

/**
 * Draws the current data source onto the canvas.
 */
LineGraph.prototype.drawDataSourceOntoCanvasElement = function () {
	var dataSource = this._dataSource;
	var currentItem;
	var key;

	for (key in dataSource) {
		if (dataSource.hasOwnProperty(key)) {
			currentItem = dataSource[key];
			this.plotValuesOntoCanvasElement(currentItem);
		}
	}
};

/**
 * Plots the given data source item onto the canvas.
 *
 * @param {Object} item
 */
LineGraph.prototype.plotValuesOntoCanvasElement = function (item) {
	var context = this._context;
	var points = item.values;
	var length = points.length;
	var currentPosition;
	var previousPosition;
	var i;

	var radius = 2;
	var startAngle = 0;
	var endAngle = Math.PI * 2;

	context.save();
	context.fillStyle = context.strokeStyle = item.colour;
	context.lineWidth = 2;

	for (i = 0; i < length; i++) {
		previousPosition = currentPosition;
		currentPosition = this.calculatePositionForValue(i, points[i]);

		context.beginPath();
		context.arc(currentPosition.x, currentPosition.y, radius, startAngle, endAngle, false);
		context.fill();

		if (previousPosition) {
			context.moveTo(previousPosition.x, previousPosition.y);
			context.lineTo(currentPosition.x, currentPosition.y);
			context.stroke();
		}
	}

	context.restore();
};

/**
 * Calculates the X and Y position for a given column and value (row). Returns
 * the result within an object containing an x and y pixel value.
 *
 * @param {Number} column
 * @param {Number} value
 * @return {Object}
 */
LineGraph.prototype.calculatePositionForValue = function (column, value) {
	return {
		x: this._width / this._bounds.x * column,
		y: this._height - (this._height / this._bounds.y * value)
	};
};






var teaGraph = new LineGraph(300, 200, {
	consumptionSpeed: {
		colour: '#FF0000',
		values: [
			0, 0, 0, 0, 0,
			0, 0, 0, 0.1, 0.3,
			0.8, 1, 3, 8, 16, 32
		]
	},
	temperature: {
		colour: '#0000FF',
		values: [
			80, 80, 80, 80, 80,
			79, 78, 76, 72, 60,
			55, 54, 40, 10, 0, 0
		]
	}
});
var teaGraphCanvas = teaGraph.getCanvasElement();
document.body.appendChild(teaGraphCanvas);
teaGraph.renderGraph();