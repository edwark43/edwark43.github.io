var my = {};

function solidrevMain(typ) {
	my.version = '0.77';
	my.typ = typeof typ !== 'undefined' ? typ : 'triangle';

	w = 240;
	h = 280;

	var s = "";
	//s += '<div style="position:relative;">';
	s += '<div style="position:relative; width:' + w + 'px; min-height:' + h + 'px; border: none; border-radius: 20px; background-color: #eeeeff; margin:auto; display:block;">';
	s += '<canvas id="canvasId" style="position: absolute; width:' + w + 'px; height:' + h + 'px; left: 0; top:; border: none;"></canvas>';

	s += '<div style="position:absolute; right:8px; top:8px;">';
	s += getPlayHTML(36);
	s += '</div>';

	s += '<div id="copyrt" style="position: absolute; right:1px; bottom:0px; font: 10px Arial; color: #6600cc; ">&copy; 2018 MathsIsFun.com  v' + my.version + '</div>';

	s += '</div>';

	document.write(s);

	el = document.getElementById('canvasId');
	//el.style.border = "1px solid black";
	ratio = 2;
	el.width = w * ratio;
	el.height = h * ratio;
	el.style.width = w + "px";
	el.style.height = h + "px";
	g = el.getContext("2d");
	g.setTransform(ratio, 0, 0, ratio, 0, 0);

	this.frame = 0;

	playQ = false;

	midPt = new Pt(110, 220);
	topPt = new Pt(110, 20);

	//g.strokeStyle = 'black';
	//g.fillStyle = 'black';
	//g.beginPath();
	//g.moveTo(topPt.x, topPt.y);
	//g.lineTo(midPt.x, midPt.y);
	//

	// the arc that the shape follows
	//my.rotPts = getArcPts(midPt.x, midPt.y, 90, 40, 0, Math.PI * 2);
	//my.rotPts = rotatePts(my.rotPts, midPt.x, midPt.y, Math.asin((topPt.x - midPt.x) / (topPt.y - midPt.y)));

	my.rotPts = getArcPts(0, 0, 1, 0.4, 0, Math.PI * 2);
	//my.rotPts = rotatePts(my.rotPts, 0, 0, Math.asin((topPt.x - midPt.x) / (topPt.y - midPt.y)));
	console.log('my.rotPts', my.rotPts)

	//my.typ = 'rect' // ellipse  triangle  rect
	switch (my.typ) {
		case 'triangle':
			my.botPt = { x: midPt.x, y: 20 }
			my.topPt = { x: midPt.x, y: 220 }
			my.pts = [
				{ x: midPt.x, y: 220 },
				{ x: midPt.x, y: 20 },
				{ x: midPt.x + 90, y: 220 }
			];
			my.fillStyle = 'rgba(0,125,125,0.02)';
			my.strokeStyle = 'rgba(0,0,255,1)';
			break
		case 'rect':
			my.botPt = { x: midPt.x, y: 50 }
			my.topPt = { x: midPt.x, y: 220 }
			my.pts = [
				{ x: midPt.x, y: 220 },
				{ x: midPt.x, y: 50 },
				{ x: midPt.x + 60, y: 50 },
				{ x: midPt.x + 60, y: 220 }
			];
			my.fillStyle = 'rgba(50,50,255,0.05)';
			my.strokeStyle = 'rgba(0,0,255,1)';
			break
		case 'ellipse':
			my.botPt = { x: midPt.x, y: 100 }
			my.topPt = { x: midPt.x, y: 200 }
			my.pts = getArcPts(midPt.x, 150, 100, 50, 0, Math.PI * 2)
			my.fillStyle = 'rgba(235,235,205,0.5)';
			my.strokeStyle = 'rgba(0,0,255,0.3)';
			break
		default:
	}

	////drawPts(g, my.rotPts, true);
	//
	////g.fill();
	//g.stroke();

	animate();
}

function getPlayHTML(w) {

	var s = '';

	s += '<style type="text/css">';

	s += '.btn {display: inline-block; position: relative; width:' + w + 'px; height:' + w + 'px; margin-right:' + w * 0.2 + 'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';
	s += '.btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';
	s += '.btn:before, button:after {content: " "; position: absolute; }';
	s += '.btn:active {top:' + w * 0.05 + 'px; box-shadow: 0 ' + w * 0.02 + 'px ' + w * 0.03 + 'px rgba(0,0,0,.4); }';

	s += '.play:before {  left: ' + w * 0.36 + 'px; top: ' + w * 0.22 + 'px; width: 0; height: 0; border: ' + w * 0.3 + 'px solid transparent; border-left-width: ' + w * 0.4 + 'px; border-left-color: blue;  }';
	s += '.play:hover:before {border-left-color: yellow; }';

	s += '.pause:before, .pause:after {display: block; left: ' + w * 0.29 + 'px; top: ' + w * 0.28 + 'px; width: ' + w * 0.19 + 'px; height: ' + w * 0.47 + 'px; background-color: blue; }';
	s += '.pause:after {left: ' + w * 0.54 + 'px; }';
	s += '.pause:hover:before, .pause:hover:after {background-color: yellow; }';

	s += '</style>';

	s += '<button id="playBtn" class="btn play" onclick="togglePlay()" ></button>';

	return s;
}

function togglePlay() {
	//console.log("togglePlay", my.colNo, my.resetQ);

	var btn = 'playBtn';

	if (playQ) {
		playQ = false;
		document.getElementById(btn).classList.add("play");
		document.getElementById(btn).classList.remove("pause");
	} else {
		playQ = true;
		document.getElementById(btn).classList.add("pause");
		document.getElementById(btn).classList.remove("play");

		animate();
	}

}

function animate() {

	g.fillStyle = 'rgba(255, 255, 255, .01)';
	g.fillRect(0, 0, el.width, el.height);

	this.frame = (++this.frame) % my.rotPts.length;

	var ptNo = this.frame;
	//var farPt = my.rotPts[ptNo];
	var farPt = { x: midPt.x + 50, y: midPt.y }
	var rotPt = my.rotPts[ptNo];
	//console.log("animate",this.frame,ptNo,pt);

	g.beginPath();
	g.fillStyle = my.fillStyle
	g.strokeStyle = my.strokeStyle
	g.lineJoin = 'round';
	g.lineWidth = 3;

	for (var i = 0; i < my.pts.length; i++) {

		var pt1 = trans(my.pts[i], rotPt)
		if (i == 0) {
			g.moveTo(pt1.x, pt1.y)
		} else {
			g.lineTo(pt1.x, pt1.y)
		}
	}

	g.closePath();
	g.stroke();
	g.fill();

	g.strokeStyle = 'blue';
	g.lineWidth = 2;
	g.beginPath();

	g.moveTo(my.botPt.x, my.botPt.y);
	g.lineTo(my.topPt.x, my.topPt.y);
	g.closePath();
	g.stroke();

	if (playQ) requestAnimationFrame(animate);

}

function trans(pt, rotPt) {
	var x = midPt.x + (pt.x - midPt.x) * rotPt.x
	//var y = midPt.y + (pt.y - midPt.y) * rotPt.y
	var y = (midPt.y - 20) * rotPt.y
	//y = midPt.y

	var dx = pt.x - midPt.x;
	//var dy = pt.x - midPt.x;
	//console.log('pt',dx,pt)
	x = pt.x + dx * (rotPt.x - 1)
	y = pt.y + dx * rotPt.y

	//console.log('trans',pt.x,pt.y,dx,rotPt.x,rotPt.y, x,y)
	return { x: x, y: y }
}

function Point(x, y) {
	this.x = x;
	this.y = y;
}
Point.prototype.set = function (x, y) {
	this.x = x;
	this.y = y;
};

function getArcPts(midX, midY, radiusX, radiusY, fromAngle, toAngle) {

	var points = [];

	//console.log("getArcPts=" + fromAngle, toAngle);
	if (isNear(fromAngle, toAngle, 0.0001)) {
		//console.log("getArcPts too near");
		return points;
	}

	if (radiusX != radiusY) {
		// adjust angles for ellipse
		fromAngle = Math.atan2(Math.sin(fromAngle) * radiusX / radiusY, Math.cos(fromAngle));
		toAngle = Math.atan2(Math.sin(toAngle) * radiusX / radiusY, Math.cos(toAngle));
	}

	if (fromAngle > toAngle) {
		while (fromAngle > toAngle) { // a little bit dumb but works ... maybe could figure exactly how many times instead of loop
			fromAngle -= 2 * Math.PI;
		}
	}

	var steps = Math.max(1, parseInt((toAngle - fromAngle) * 28)); // higher values mean more pts

	//console.log("getArcPts from,to=" + fromAngle, toAngle);

	for (var i = 0; i <= steps; i++) {
		var radians = fromAngle + (toAngle - fromAngle) * (i / steps);
		var thisX = midX + (Math.cos(radians) * radiusX);
		var thisY = midY - (Math.sin(radians) * radiusY);

		points.push(new Pt(thisX, thisY));
	}

	return points;

}

function rotatePts(pts, midX, midY, rot) {
	var newPts = [];
	for (var i = 0; i < pts.length; i++) {
		var pt = pts[i];
		newPts.push(pt.add(-midX, -midY).rotate(rot).add(midX, midY));

	}
	return newPts;
}

function drawPts(g, pts, closeQ) {
	closeQ = typeof closeQ !== 'undefined' ? closeQ : false;

	for (var i = 0; i < pts.length; i++) {
		if (i == 0) {
			g.moveTo(pts[i].x, pts[i].y);
		} else {
			g.lineTo(pts[i].x, pts[i].y);
		}
	}
	if (closeQ) {
		g.lineTo(pts[0].x, pts[0].y);
	}
}

function isNear(checkVal, centralVal, limitVal) {
	if (checkVal < centralVal - limitVal)
		return false;
	if (checkVal > centralVal + limitVal)
		return false;
	return true;
}

function Pt(ix, iy) {

	this.x = ix;
	this.y = iy;
	//document.getElementById("dbg").innerHTML += "new Pt: (" + this.x + "," + this.y + ")";
	this.name = "?";
	this.rad = 12;

	// assume that point has lines in and out
	angleIn = 0;
	angleOut = 0;

}
Pt.prototype.add = function (dx, dy) {
	return new Pt(this.x + dx, this.y + dy);
};
Pt.prototype.rotate = function (angle) {
	// rotate about (0,0)
	var cosa = Math.cos(angle);
	var sina = Math.sin(angle);
	var xPos = this.x * cosa + this.y * sina;
	var yPos = -this.x * sina + this.y * cosa;
	return new Pt(xPos, yPos);
}
