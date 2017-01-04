+ function () {
  'use strict';

  function Surface(jelem, width, height) {
    this.jelem = jelem;
    this.width = width;
    this.height = height;
    this.elems = new Array();
    this.xscale = 1;
    this.yscale = 1;
    this.duration = 301;
    this.animate = true;
    // public instance functions
    // Add an element to the surface
    // jelem:  jQuery object representing the DOM element
    // x,y:    Top left corner (virtual coordinates)
    // w,h:    Width and height of the element in (virtual coordinate sizes)
    // return: An integer representing the created surface element
    this.addElem = function (jelem, x, y, w, h) {
      var elem = {
        jelem: jelem,
        x: x,
        y: y,
        w: w,
        h: h
      };
      // try to find an empty slot
      for (var i = 0; i < this.elems.length; ++i) {
        if (typeof this.elems[i] === 'undefined') {
          this.elems[i] = elem;
          return i;
        }
      }
      // couldn't find an empty slot, so add to the end
      this.elems.push(elem);
      return this.elems.length - 1;
    };
    // Remove an element from the surface
    // ielem: index of the element to be removed.  This must be a value returned by addElem
    this.removeElem = function (ielem) {
      delete this.elems[ielem];
    };
    this.image = function () {
      var str = "";
      for (var i = 0; i < this.elems.length; ++i) {
        str += i + ". ";
        str += elemImage(this, i) + "\n";
      }
      return str;
    };
    // Sets the scaling of the virtual coordinates to actual pixel positions on the screen
    // pwidth,pheight:  Pixel width and height of the surface that the virtual coordinates must be mapped to
    this.setScale = function (pwidth, pheight) {
      this.xscale = pwidth / this.width;
      this.yscale = pheight / this.height;
    };
    // Positions all the element added to the surface based on the current scaling
    this.positionAll = function () {
      for (var i = 0; i < this.elems.length; ++i) {
        if (typeof this.elems[i] === 'undefined') {
          continue;
        }
        var elem = this.elems[i];
        elem.jelem.offset({
          top: elem.y * this.yscale,
          left: elem.x * this.xscale
        });
        elem.jelem.width(elem.w * this.xscale);
        elem.jelem.height(elem.h * this.yscale);
      }
    };
    // Move an element from it's current position to a new one
    // toX, toY:  The virtual coordinates to move the element to
    // callback:    a function to be called when the move has occured.  This is relevant
    //              when the move is animated and not happening instantly
    this.moveElem = function (ielem, toX, toY, callback) {
      var ptoX = this.xscale * toX;
      var ptoY = this.yscale * toY;
      var options;
      if (typeof callback === 'undefined') {
        options = {
          duration: this.duration
        };
      } else {
        options = {
          duration: this.duration,
          complete: callback
        };
      }
      if (this.animate === true) {
        this.elems[ielem].jelem.animate({
          left: ptoX,
          top: ptoY
        }, options);
      } else {
        this.elems[ielem].jelem.offset({
          left: ptoX,
          top: ptoY
        });
      }
      this.elems[ielem].x = toX;
      this.elems[ielem].y = toY;
      if (this.animate === false && typeof callback !== 'undefined') {
        callback();
      }
    };
    this.getElem = function (ielem) {
      return this.elems[ielem];
    };
    // Change the duration of the animation of a move
    // offset:  The change to the current duration in milliseconds.  The initial duration is 300ms
    this.changeDuration = function (offset) {
      if (this.duration > -offset) {
        this.duration += offset;
      }
    };
    // private functions
    var elemImage = function (that, ielem) {
      var img = "x:" + that.elems[ielem].x + " y:" + that.elems[ielem].y + " w:" + that.elems[ielem].w + " h:" + that.elems[ielem].h;
      return img;
    };
  }

  function spyOn(obj, name, spyCallback, before) {
    if (!obj || typeof obj !== 'object') {
      return console.log('Can not spy on non objects!');
    }
    if (!obj._originals_) {
      obj._originals_ = {};
    }
    var originalFN = obj[name];
    obj._originals_[name] = originalFN;
    obj[name] = function () {
      if (before) {
        try {
          spyCallback.apply(this, arguments);
        } catch (err) {
          console.error('Error when calling spyCallback!', err);
        }
      }
      var result = originalFN.apply(this, arguments);
      if (!before) {
        try {
          spyCallback.apply(this, arguments);
        } catch (err) {
          console.error('Error when calling spyCallback!', err);
        }
      }
      return result;
    };
  }

  function spyAfter(obj, name, spyCallback) {
    return spyOn(obj, name, spyCallback, false);
  }

  function spyBefore(obj, name, spyCallback) {
    return spyOn(obj, name, spyCallback, true);
  }

  $(function () {
    var numberOfDiscs = 8;
    var colors = ['blue', 'orange', 'crimson', 'darkblue', 'darkgreen', 'indianred', 'lime', 'navy', 'salmon', 'tomato', 'yellow', 'steelblue', 'goldenrod', 'peachpuff'];
    // create the jquery object corresponding to the DOM element holding the virtual coordinate system
    var jsurface = $("#surface");
    // create the surface object.  Choosing a 30x30 coordinate system
    var surface = new Surface(jsurface, 30, 30);
    var pins = new Array(3);
    var queue = createQueue();
    var state = 'stopped';
    var discs;
    var totalMoves;
    var PINS = ['First', 'Second', 'Third'];

    function parseQueue() {
      return JSON.stringify(queue, function (key, value) {
        if (key === 'to' || key === 'from')
          return PINS[value] + ' PIN';
        return value;
      }, 2).
        replace(/\u2028/g, '\\u2028').
        replace(/\u2029/g, '\\u2029');
    }

    function printQueue(){
      $('.current-queue>pre').html(parseQueue());
    }

    function spyHandler() {
      // console.log('Moves Left:', this.length);
      totalMoves = this.length;
      $('.toh_moves>span').html(this.length);
      $('.all-moves-num').html(totalMoves);
      if(this.length === totalMoves){
        printQueue();
      }
    }

    function spyShiftHandler() {
      // console.log('Moves Left:', this.length);
      $('.toh_moves>span').html(this.length);
      printQueue();
    }

    function numberOfDiscsHasChanged(){
      $('.all-moves-n').html(numberOfDiscs);
      $('.all-moves-num').html(totalMoves);
    }

    function createQueue() {
      var result = new Array();
      totalMoves = 0;
      spyAfter(result, 'push', spyHandler);
      spyAfter(result, 'shift', spyShiftHandler);
      return result;
    }

    function reset() {
      state = 'stopped';
      removeDiscs();
      discs = createDiscs(numberOfDiscs);
      pins[0] = discs.slice(0); // create a clone of the discs array
      pins[1] = new Array();
      pins[2] = new Array();
      resizeToWindow();
      queue = undefined;
      queue = createQueue();
      moveStack(pins[0].length, 0, 2, 1); // fill up the move queue
    }

    function writeTitle() {
      $("<div>Tower Of Hanoi Implemented By Mehran Hatami (<strong>Teacher Name: Alireza Qavami</strong>)</div>").addClass("toh_title").appendTo(jsurface);
      $("<div>All Moves: <span>2^N - 1 = 2^<span class='all-moves-n'>" + numberOfDiscs + "</span> - 1 = <span class='all-moves-num'>" + totalMoves + "</span></span> - <span class='toh_moves'>Moves Left: <span>?</span></span></div>")
        .addClass("toh_all_moves").appendTo(jsurface);
    }

    function createPins() {
      // create the jQuery object correspoding to the pins and plates
      var jplate1 = $("<div></div>").addClass("plate").appendTo(jsurface);
      var jplate2 = $("<div></div>").addClass("plate").appendTo(jsurface);
      var jplate3 = $("<div></div>").addClass("plate").appendTo(jsurface);
      var jpin1 = $("<div></div>").addClass("pin").appendTo(jsurface);
      var jpin2 = $("<div></div>").addClass("pin").appendTo(jsurface);
      var jpin3 = $("<div></div>").addClass("pin").appendTo(jsurface);
      // Add the pins to the surface
      var plate1 = surface.addElem(jplate1, 1, 24, 8, 1);
      var plate2 = surface.addElem(jplate2, 11, 24, 8, 1);
      var plate3 = surface.addElem(jplate3, 21, 24, 8, 1);
      var pin1 = surface.addElem(jpin1, 4.6, 5, 0.8, 19.5);
      var pin2 = surface.addElem(jpin2, 14.6, 5, 0.8, 19.5);
      var pin3 = surface.addElem(jpin3, 24.6, 5, 0.8, 19.5);
    }

    function createDiscs(disc_count) {
      var max_width = 7;
      var min_width = 3;
      var width_step = (max_width - min_width) / (disc_count - 1);
      var x_step = width_step / 2;
      var height = 2.2; //20/disc_count;
      var width = max_width;
      var x = 1.5;
      var y = 24.5 - height;
      var discs = new Array();
      for (var i = 0; i < disc_count; ++i) {
        var disc = $("<div></div>").addClass("oval"); //.css('background-color', colors [i]);
        disc.appendTo(jsurface);
        discs.push(surface.addElem(disc, x, y, width, height));
        x = x + x_step;
        width = width - width_step;
        y = y - height / 1.5;
      }
      return discs;
    }

    function createControl(img, handler) {
      var control = $("<img>");
      control.get(0).src = img;
      control.addClass("control").appendTo(jsurface).click(handler);
      // control.bind ("mousedown touchstart", function () { $(this).addClass ("button_down"); });
      // control.bind ("mouseup touchend", function () { $(this).removeClass ("button_down"); });
      return control;
    }

    function createControls() {
      surface.addElem(createControl("images/Image_PlayStart.png", reset), 1.5, 27.5, 1.0, 1.0);
      surface.addElem(createControl("images/Image_Play.png", start), 4.5, 27.5, 1.0, 1.0);
      surface.addElem(createControl("images/Image_Stop.png", stop), 7.5, 27.5, 1.0, 1.0);
      surface.addElem(createControl("images/Image_Slow.png", slower), 13.5, 27.5, 1.0, 1.0);
      surface.addElem(createControl("images/Image_Fast.png", faster), 16.5, 27.5, 1.0, 1.0);
      surface.addElem(createControl("images/Image_AddDisk.png", add1), 23.5, 27.5, 1.0, 1.0);
      surface.addElem(createControl("images/Image_RemoveDisk.png", sub1), 26.5, 27.5, 1.0, 1.0);
    }

    function resize(width, height) {
      jsurface.width(width);
      jsurface.height(height);
      surface.setScale(width, height);
      surface.positionAll();
    }

    function resizeToWindow() {
      resize($(window).width(), $(window).height());
    }

    function moveDisc(fromPin, toPin, callback) {
      var fromPinDiscs = pins[fromPin];
      var fromTopDisc = pins[fromPin].pop();
      var xMove = (toPin - fromPin) * 10;
      var elem = surface.getElem(fromTopDisc);

      pins[toPin].push(fromTopDisc);
      surface.moveElem(fromTopDisc, elem.x, 5 - elem.h / 1.5);
      surface.moveElem(fromTopDisc, elem.x + xMove, 5 - elem.h / 1.5);
      surface.moveElem(fromTopDisc, elem.x, 23.5 - elem.h / 1.5 * (pins[toPin].length), callback);
    }

    function moveDiscQueue(fromPin, toPin) {
      queue.push({
        from: fromPin,
        to: toPin
      });
    }

    function processQueue() {
      if (queue.length > 0 && state == 'running') {
        var elem = queue.shift();
        moveDisc(elem.from, elem.to, processQueue);
      }
    }

    function moveStack(size, from, to, middle) {
      if (size === 1) {
        moveDiscQueue(from, to);
      } else {
        moveStack(size - 1, from, middle, to);
        moveDiscQueue(from, to);
        moveStack(size - 1, middle, to, from);
      }
    }

    function removeDiscs() {
      if (typeof discs !== 'undefined') {
        for (var i = 0; i < discs.length; ++i) {
          var elem = surface.getElem(discs[i]);
          elem.jelem.remove();
          surface.removeElem(discs[i]);
        }
        discs = undefined;
      }
    }

    function start() {
      if (state == 'stopped') {
        state = 'running';
        processQueue(); // get the queue going again
      }
    }

    function stop() {
      state = 'stopped';
    }

    function faster() {
      surface.changeDuration(-50);
    }

    function slower() {
      surface.changeDuration(50);
    }

    function inc(){
      numberOfDiscs += 1;
      numberOfDiscsHasChanged();
    }

    function dec(){
      numberOfDiscs -= 1;
      numberOfDiscsHasChanged();
    }

    function add1() {
      if (state == 'stopped') {
        if (numberOfDiscs < 10) {
          inc();
        }
        reset();
      }
    }

    function sub1() {
      if (state == 'stopped') {
        if (numberOfDiscs > 2) {
          dec();
        }
        reset();
      }
    }

    function initialize() {
      writeTitle();
      // Create the pins
      createPins();
      // Create the controls
      createControls();
      // Create the discs and reset them
      reset();
      // do the initial sizing and positioning
      resizeToWindow();
      // setup handler to be called when window is resized
      $(window).resize(resizeToWindow);
      $(window).bind('orientationchange', resizeToWindow);
    }
    initialize();
    processQueue();

    window.setState = function (value) {
      state = value;
    };
    window.getQueue = function () {
      return queue;
    };
    window.processQueue = processQueue;
  });
}();
