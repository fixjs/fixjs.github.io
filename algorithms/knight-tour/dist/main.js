;(function (global) {
  'use strict';
  //chess-board html and css adapted from http://designindevelopment.com/css/css3-chess-board/

  var d3 = global.d3;
  var $ = global.jQuery;

  function KnightTour() {
    var _this = this;
    this.yLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    this.yMap = [];
    _.times(8, function(index){
      _this.yMap[index] = _this.yLabels[index];
    });
    this.points = {};

    var width = 656;
    var height = 656;

    this.drawTheBoard(width, height);    
  }

  KnightTour.prototype.drawTheBoard = function (width, height) {
    this.gridGraph = d3.select('#chess-board')
      .append('svg:svg')
      .attr('width', width) // Set width of the SVG canvas
      .attr('height', height); // Set height of the SVG canvas

    var yAxisRange = d3.range(8, height, 80);
    var xAxisRange = d3.range(8, width, 80);

    this.gridGraph.selectAll('line.vertical')
      .data(yAxisRange)
      .enter().append('svg:line')
      .attr('x1', function (d) {
        return d;
      })
      .attr('y1', 8)
      .attr('x2', function (d) {
        return d;
      })
      .attr('y2', height - 8)
      .style('stroke', 'rgb(6,120,155)')
      .style('stroke-width', 0);

    this.gridGraph.selectAll('line.horizontal')
      .data(xAxisRange)
      .enter().append('svg:line')
      .attr('x1', 8)
      .attr('y1', function (d) {
        return d;
      })
      .attr('x2', width - 8)
      .attr('y2', function (d) {
        return d;
      })
      .style('stroke', 'rgb(6,120,155)')
      .style('stroke-width', 0);

    var yAxisRangeLinear = d3.range(8, height, 8 * 70);
    var xAxisRangeLinear = d3.range(8, width, 8 * 70);

    this.yScale = d3.scale.linear()
      .domain([0, 7])
      .range(yAxisRangeLinear)
      .nice();

    this.xScale = d3.scale.linear()
      .domain([1, 8])
      .range(xAxisRangeLinear)
      .nice();
  };

  KnightTour.prototype.start = function (startingPoint) {
    var
      _this = this,
      startingXValue,
      startingYValue;

    this.points = {};

    if(!_.isString(startingPoint) || startingPoint.length !== 2 ||
      (startingXValue = this.yLabels.indexOf(startingPoint[0])) < 0 ||
      _.isNaN(startingYValue = _.parseInt(startingPoint[1])) ||
      startingYValue < 1 || startingYValue > 8){
      throw 'Invalid Starting Point';
    }
    startingXValue += 1;
    startingYValue = 8 - startingYValue;

    for (var i = 1; i < 9; i++) {
      for (var j = 0; j < 8; j++) {
        var pointId = this.yMap[j] + i.toString();
        // we'll use 0 for not-visited and 1 for already visited
        if (i == startingXValue && j == startingYValue) {
          this.points[pointId] = 1;
        } else {
          this.points[pointId] = 0;
        }
      }
    }

    var interpolationPoints = [];
    var possibleMoves = this.getPossibleMoves({ x: startingXValue, y: startingYValue });
    var availableMoves = this.getAvailableMoves(possibleMoves);
    var getBestNextMoveResult = this.getBestNextMove(availableMoves);
    var nextMove = getBestNextMoveResult.bestMove;

    //interpolationPoints.push(nextMove.interpolationPoint);
    interpolationPoints.push(nextMove.resultPoint);

    var iterations = 1;
    this.drawMove(nextMove.resultPoint, 'blue', iterations);
    this.points[this.getPointId(nextMove.resultPoint)] = 1;


    while (getBestNextMoveResult.bestMove) {
      iterations += 1;

      if (getBestNextMoveResult.nextAvailableMoves.length == 1) {
        nextMove = getBestNextMoveResult.nextAvailableMoves[0];
        this.drawMove(nextMove.resultPoint, 'black', iterations);
        this.points[this.getPointId(nextMove.resultPoint)] = 1;
        //interpolationPoints.push(nextMove.interpolationPoint);
        interpolationPoints.push(nextMove.resultPoint);
        if (iterations === 63) {
          break;
        }
      }

      getBestNextMoveResult = this.getBestNextMove(getBestNextMoveResult.nextAvailableMoves);
      nextMove = getBestNextMoveResult.bestMove;
      this.drawMove(nextMove.resultPoint, '#a80001', iterations);
      this.points[this.getPointId(nextMove.resultPoint)] = 1;
      //interpolationPoints.push(nextMove.interpolationPoint);
      interpolationPoints.push(nextMove.resultPoint);
    }

    var line = d3.svg.line()
      .x(function (d) {
        return (_this.xScale(d.x) + 40);
      })
      .y(function (d) {
        return (_this.yScale(d.y) + 40);
      })
      .interpolate('cardinal');

    var path = this.gridGraph.append('svg:path')
      .attr('d', line(interpolationPoints))
      .attr('fill', 'none')
      .attr('stroke', 'green')
      .attr('stroke-width', 1);

    var totalLength = path.node().getTotalLength();

    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(100000)
      .ease('back(20)')
      .attr('stroke-dashoffset', 0);


    this.gridGraph.on('click', function () {
      path
        .transition()
        .duration(20000)
        .ease('back(100)')
        .attr('stroke-dashoffset', totalLength);
    });
  };

  KnightTour.prototype.getPointId = function (p) {
    return this.yMap[p.y] + p.x;
  };

  KnightTour.prototype.getPossibleMoves = function (p) {
    var moves = [];
    var x = p.x;
    var y = p.y;
    var up2y = p.y + 2;
    var up1y = p.y + 1;
    var down2y = p.y - 2;
    var down1y = p.y - 1;
    var left2x = p.x - 2;
    var left1x = p.x - 1;
    var right2x = p.x + 2;
    var right1x = p.x + 1;

    var interpolationPoint = { x: x, y: up2y };
    var resultPoint = { x: right1x, y: up2y };
    if (this.isInBounds(resultPoint)) {
      moves.push({ resultPoint: resultPoint, interpolationPoint: interpolationPoint });
    }

    interpolationPoint = { x: x, y: up2y };
    resultPoint = { x: left1x, y: up2y };
    if (this.isInBounds(resultPoint)) {
      moves.push({ resultPoint: resultPoint, interpolationPoint: interpolationPoint });
    }

    interpolationPoint = { x: x, y: down2y };
    resultPoint = { x: right1x, y: down2y };
    if (this.isInBounds(resultPoint)) {
      moves.push({ resultPoint: resultPoint, interpolationPoint: interpolationPoint });
    }

    interpolationPoint = { x: x, y: down2y };
    resultPoint = { x: left1x, y: down2y };
    if (this.isInBounds(resultPoint)) {
      moves.push({ resultPoint: resultPoint, interpolationPoint: interpolationPoint });
    }

    interpolationPoint = { x: right2x, y: y };
    resultPoint = { x: right2x, y: up1y };
    if (this.isInBounds(resultPoint)) {
      moves.push({ resultPoint: resultPoint, interpolationPoint: interpolationPoint });
    }

    interpolationPoint = { x: right2x, y: y };
    resultPoint = { x: right2x, y: down1y };
    if (this.isInBounds(resultPoint)) {
      moves.push({ resultPoint: resultPoint, interpolationPoint: interpolationPoint });
    }

    interpolationPoint = { x: left2x, y: y };
    resultPoint = { x: left2x, y: up1y };
    if (this.isInBounds(resultPoint)) {
      moves.push({ resultPoint: resultPoint, interpolationPoint: interpolationPoint });
    }

    interpolationPoint = { x: left2x, y: y };
    resultPoint = { x: left2x, y: down1y };
    if (this.isInBounds(resultPoint)) {
      moves.push({ resultPoint: resultPoint, interpolationPoint: interpolationPoint });
    }

    return moves;
  };

  KnightTour.prototype.getBestNextMove = function (moves) {
    var bestMove;
    var nextAvailableMoves;
    for (var i = 0; i < moves.length; i++) {
      var m = moves[i];

      var pMoves = this.getPossibleMoves(m.resultPoint);
      if (!pMoves.length) {
        continue;
      }

      var aMoves = this.getAvailableMoves(pMoves);
      if (!aMoves.length) {
        continue;
      }

      if (!bestMove) {
        bestMove = m;
        nextAvailableMoves = aMoves;
      } else if (aMoves.length <= nextAvailableMoves.length) {
        bestMove = m;
        nextAvailableMoves = aMoves;
      }
    }

    return { bestMove: bestMove, nextAvailableMoves: nextAvailableMoves };
  };

  KnightTour.prototype.getAvailableMoves = function (moves) {
    var that = this;
    var availableMoves = [];
    moves.forEach(function (m) {
      var p = m.resultPoint;
      var pointId = that.getPointId(p);
      if (!that.points[pointId]) {
        availableMoves.push(m);
      }
    });

    return availableMoves;
  };

  KnightTour.prototype.drawMove = function (p, color, i) {
    this.gridGraph
      .append('svg:path')
      .attr('class', 'point')
      .attr('d', d3.svg.symbol().type('circle').size(150)())
      .attr('transform', 'translate(' + (this.xScale(p.x) + 40) + ',' + (this.yScale(p.y) + 40) + ')')
      .attr('fill', '#fff')
      .attr('stroke', color)
      .attr('stroke-width', 2);

    this.gridGraph.append('text')
      .attr('transform', 'translate(' + (this.xScale(p.x) + 50) + ',' + (this.yScale(p.y) + 65) + ')')
      .text(i);
  };

  KnightTour.prototype.isInBounds = function (p) {
    this.xMax = 8;
    this.xMin = 1;
    this.yMax = 7;
    this.yMin = 0;

    if (p.x >= this.xMin && p.x <= this.xMax && p.y >= this.yMin && p.y <= this.yMax) {
      return true;
    }

    return false;
  };



  $(function () {
    var startingPoint;
    function startTheTour (){
      startingPoint = this;
      var knightTour = new KnightTour();
      $(startingPoint).html('<a href="#" class="knight white">&#9816;</a>');
      knightTour.start($(this).attr('id'));
    }
    
    function stopTheTour(){
      var knightTour = new KnightTour();
      if(startingPoint){
        $(startingPoint).html('');
        startingPoint = null;
      }
      $('#chess-board').html('');
    }

    $('table.board-table').on('click', 'tr>td', startTheTour);
    $('.reset').on('click', stopTheTour);
  });
})(this);
