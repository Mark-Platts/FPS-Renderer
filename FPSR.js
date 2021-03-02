//stored variables
const pi = Math.PI;
const rotAngle = pi/24;
let lastMousePos = [0,0];
const worldToCanvasScale = 1;


//camera
{
let camera = {
    xpos: 0,
    ypos: 150,
    zpos: 0,
    xunit: [1,0,0],
    yunit: [0,1,0],
    zunit: [0,0,1],
    eyeDist: 1
}



function showCamUnits(camera) {
    console.log(camera.xunit);
    console.log(camera.yunit);
    console.log(camera.zunit);
}
}

//world
{
const worldCoords = [[100,0,0],[100,0,100],[200,0,100],[200,0,0],[100,100,0],[100,100,100],[200,100,100],[200,100,0]];
const worldLines = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
}

//Array and vector
{
//returns a copy of an array
function arrCopy(arr){
    let hold = [];
    for (let i = 0; i < arr.length; i++){
        if (Array.isArray(arr[i])) {
            hold2 = [];
            for (let j = 0; j < arr[i].length; j++) {
                hold2.push(arr[i][j]);
            }
            hold.push(hold2);
        }
        else {
            hold.push(arr[i]);
        }
    }
    return hold;
}

//Add two vectors
function vecAdd(vec1, vec2) {
    let hold = [];
    for (let i = 0; i < vec1.length; i++){
        hold.push(vec1[i] + vec2[i]);
    }
    return hold;
}

//Returns dot product of two vectors
function vecDot(vec1, vec2) {
    let hold = 0;
    for (let i = 0; i < vec1.length; i++){
        hold += vec1[i]*vec2[i];
    }
    return hold;
}

//returns vector magnitude
function vecMag(vec) {
    let hold = 0;
    for (let i = 0; i < vec.length; i++){
        hold += vec[i]**2;
    }
    return (hold)**0.5;
}

//finds the difference between two vectors vec1 - vec2
function vecDiff(vec1, vec2) {
    let hold = [];
    for (let i = 0; i < vec1.length; i++){
        hold.push(vec1[i] - vec2[i]);
    }
    return hold;
}

//finds the distance between two vectors
function vecDist(vec1, vec2) {
    return vecMag(vecDiff(vec1, vec2));
}

//scalar multiply a vector
function vecScale(scale, vec) {
    let hold = [];
    for (let i = 0; i < vec.length; i++){
        hold.push(scale*vec[i]);
    }
    return hold;
}

//returns the cross product of two vectors
function vecCross(vec1, vec2) {
    return [vec1[1]*vec2[2]-vec1[2]*vec2[1], vec1[2]*vec2[0]-vec1[0]*vec2[2], vec1[0]*vec2[1]-vec1[1]*vec2[0]];
}

//returns a unit vector in same direction as input vector
function vecUnit(vec){
    return vecScale(1/vecMag(vec), vec);
}

//Tests whether two arrays contain the same values and order
function arrEqual(arr1, arr2) {
    let hold = true;
    for (let i = 0; i < (arr1.length); i++) {
        if (arr1[i] != arr2[i]) {
            hold = false;
            break;
        }
    }
    return hold;
}

}

//Sizing and canvas
{
//returns array with [innerHeight, innerWidth]
function getViewSizes() {
    winHeight = window.innerHeight;
    winWidth = window.innerWidth;
}

//creates canvas and scales to the best fit
function scaleCanvas() {
    const scale = 1;
    document.getElementById("mainCanvas").height = scale*window.innerHeight;
    document.getElementById("mainCanvas").width = scale*window.innerWidth;
}

//function that does everything that needs to be done after a window resize
function windowResize() {
    scaleCanvas()
    render(coords)
}
window.addEventListener('resize', windowResize);
}




//checks for perspective and returns new scaled coordinates
//canDist is the distance from (0,0,0) to the center of the canvas
//eyeDist is distance from the center of the canvas to the eye
//the number*w exaggerates the 4D perspective
function setPersp(coords, canDist, eyeDist) {
    let hold = [];
    if (perspectiveEnabled == false) {
        for (let i = 0; i < coords.length; i++){
            hold.push(coords[i]);
        }
    }
    else if (perspectiveEnabled == true) {
        for (let i = 0; i < coords.length; i++){
            let rastCoord = [];
            let x = coords[i][0];
            let y = coords[i][1];
            let z = coords[i][2];
            let tz = (canDist - z)/(canDist + eyeDist - z);
            let tw = 0;
            if (coords[i].length == 4 && wPerspExagOn == true) {
                w = coords[i][3]
                tw = (canDist - wPerspExag*w)/(canDist + eyeDist - wPerspExag*w);
            } else if (coords[i].length == 4 && wPerspExagOn == false) {
                w = coords[i][3]
                tw = (canDist - w)/(canDist + eyeDist - w);
            }
            rastCoord.push(x*(1-tz-tw));
            rastCoord.push(y*(1-tz-tw));
            hold.push(rastCoord);
        }
    }
    return hold;
}


//Takes the coord and line data and renders them to the canvas
function render(coords){
    const canCenX = document.getElementById("mainCanvas").width/2;
    const canCenY = document.getElementById("mainCanvas").height/2;
    //resizes coords so that they will fit the canvas nicely
    let scaledCoords;
    if (coords[0].length == 3) {
        scaledCoords = scaleCoords(coords, 3); //was 4
    }
    else if (coords[0].length == 4) {
        scaledCoords = scaleCoords(coords, 2); //was 1.5
    }
    if (perspectiveEnabled == false) {
        scaledCoords = scaleCoords(coords, 0.95);
    }
    const bm = biggestMag(scaledCoords);
    const eyeDist = 1.5*bm;
    const canDist = 4*bm;
    let finCoords = setPersp(scaledCoords, canDist, eyeDist); //returns coords with possible perspective altering
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#FFFFFF";
    for (let i = 0; i < lines.length; i++){
        ctx.beginPath();
        ctx.moveTo(canCenX + finCoords[lines[i][0]][0], canCenY + finCoords[lines[i][0]][1]);
        ctx.lineTo(canCenX + finCoords[lines[i][1]][0], canCenY + finCoords[lines[i][1]][1]);
        ctx.stroke();
    }
}

//Takes the coord and line data and renders them to the canvas
function trender(coords){
    const canCenX = document.getElementById("mainCanvas").width/2;
    const canCenY = document.getElementById("mainCanvas").height/2;
    const bm = biggestMag(coords);
    const eyeDist = bm;
    const canDist = 4*bm;
    let perspCoords = setPersp(coords, canDist, eyeDist); //returns coords with possible perspective altering
    let finCoords = scaleCoords(perspCoords, 0.95); //resizes coords so that they will fit the canvas nicely
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#FFFFFF";
    for (let i = 0; i < lines.length; i++){
        ctx.beginPath();
        ctx.moveTo(canCenX + finCoords[lines[i][0]][0], canCenY + finCoords[lines[i][0]][1]);
        ctx.lineTo(canCenX + finCoords[lines[i][1]][0], canCenY + finCoords[lines[i][1]][1]);
        ctx.stroke();
    }
}


//Takes a point on the canvas, returns new set of unit vectors, scale can change how big the canvas is relative to the shape (needs implementing)
function turnUnits(px, py, canDist, scale) {
    const pVec = [scale*px, scale*py, canDist]; //vector of mouse pointer (scale will go here if needs be)
    const pMag = vecMag(pVec); //Finds magnitude
    const kuVec = vecScale((1/pMag), pVec); //Turns pVec into a unit vector. This is the same as the k unit vector due to the rotation point being (0,0,0)
    const kjCross = vecCross(kuVec, [0,1,0]);
    //const kjCross = vecCross([0,1,0], kuVec);
    const kjcMag = vecMag(kjCross);
    const iuVec = vecScale((-1/kjcMag), kjCross);
    const juVec = vecCross(kuVec, iuVec);
    //const juVec = vecCross(iuVec, kuVec);
    return [iuVec, juVec, kuVec];
}

//Takes a coordinate and a set of unit vectors, rebuilds in the new basis
function turnCoord(coord, units) {
    const nx = vecScale(coord[0], units[0]);
    const ny = vecScale(coord[1], units[1]);
    const nz = vecScale(coord[2], units[2]);
    let hold = vecAdd(vecAdd(nx, ny), nz);
    if (coord.length == 4) {
        hold.push(coord[3]);
        return hold;
    }
    else {
        return hold;
    }
}

function turnPoints(coords, px, py, canDist) {
    if (mouseFollow) {
        const units = turnUnits(px, py, canDist, 1/100);
        let hold = arrCopy(coords);
        for (let i = 0; i < hold.length; i++){
            hold[i] = turnCoord(hold[i], units)
        }
        render(hold)
    }
}

function testMouseFollow(canvas, coords, evt) {
    const bm = biggestMag(coords);
    const canDist = 2*bm;
    const mp = getMousePos(canvas, evt);
    lastMousePos = mp;
    const canCenX = document.getElementById("mainCanvas").width/2;
    const canCenY = document.getElementById("mainCanvas").height/2;
    turnPoints(coords, mp[0] , mp[1] , canDist);
}

//returns object with mouse position
function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return [evt.clientX - rect.left, evt.clientY - rect.top];
      }

function mouseMove(evt) {
    const bm = biggestMag(coords);
    const canDist = 2*bm;
    const mp = getMousePos(canvas, evt);
    lastMousePos = mp;
    const canCenX = document.getElementById("mainCanvas").width/2;
    const canCenY = document.getElementById("mainCanvas").height/2;
    turnPoints(coords, mp[0]-canCenX, mp[1]-canCenY, canDist);
}

function simulatedMouseMove(lastMousePos) {
    const bm = biggestMag(coords);
    const canDist = 2*bm;
    const mp = lastMousePos
    const canCenX = document.getElementById("mainCanvas").width/2;
    const canCenY = document.getElementById("mainCanvas").height/2;
    turnPoints(coords, mp[0]-canCenX, mp[1]-canCenY, canDist);
}

//keypress resolve
{
function resolveKeyPress(e) {
    if (e.keyCode == 69){
        doRotXY();
    }
    else if (e.keyCode == 81){
        undoRotXY();
    }
    else if (e.keyCode == 87){
        doRotYZ();
    }
    else if (e.keyCode == 83){
        undoRotYZ();
    }
    else if (e.keyCode == 65){
        doRotXZ();
    }
    else if (e.keyCode == 68){
        undoRotXZ();
    }
    else if (e.keyCode == 74){
        doRotXW();
    }
    else if (e.keyCode == 76){
        undoRotXW();
    }
    else if (e.keyCode == 73){
        doRotYW();
    }
    else if (e.keyCode == 75){
        undoRotYW();
    }
    else if (e.keyCode == 85){
        doRotZW();
    }
    else if (e.keyCode == 79){
        undoRotZW();
    }
    else if (e.keyCode == 80){
        perspectiveChange();
    }
    else if (e.keyCode == 88){
        wPerspExagOnOff();
    }
    else if (e.keyCode == 77){
        mouseFollowOnOff();
    }

    simulatedMouseMove(lastMousePos);
}
document.addEventListener('keydown', resolveKeyPress);
}

