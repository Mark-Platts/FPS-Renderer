//stored variables
const pi = Math.PI;
const gR = (1 + 5**0.5)/2; //golden ratio
const gRR = 1/gR; //golden ratio reciprocal
const rotAngle = pi/24;
let wPerspExagOn = true;
const wPerspExag = 3.5;
let lastMousePos = [0,0];
let mouseFollow = true;

//storage for the dodecahedron and line data
let dodeCoords = [[1, 1, 1], [1, -1, 1], [-1, 1, 1], [-1, -1, 1], [1, 1, -1], [1, -1, -1], [-1, 1, -1], [-1, -1,- 1],
    [0, (1 + gRR), (1 - gRR**2)],[0, -(1 + gRR), (1 - gRR**2)],[0, (1 + gRR), -(1 - gRR**2)],[0, -(1 + gRR), -(1 - gRR**2)],
    [(1 + gRR), (1 - gRR**2), 0],[-(1 + gRR), (1 - gRR**2), 0],[(1 + gRR), -(1 - gRR**2), 0],[-(1 + gRR), -(1 - gRR**2), 0],
    [(1 - gRR**2), 0, (1 + gRR)],[-(1 - gRR**2), 0, (1 + gRR)],[(1 - gRR**2), 0, -(1 + gRR)],[-(1 - gRR**2), 0, -(1 + gRR)]];
const dodeLines = [[0, 8], [0, 12], [0, 16], [1, 9], [1, 14], [1, 16], [2, 8], [2, 13], [2, 17], [3, 9], [3, 15], [3, 17], [4, 10], [4, 12], [4, 18], [5, 11], [5, 14], [5, 18], [6, 10], [6, 13], [6, 19], [7, 11], [7, 15], [7, 19], [8, 10], [9, 11], [12, 14], [13, 15], [16, 17], [18, 19]];

//storage for the cube coord and line data
const cubeCoords = [[2,2,2],[-2,2,2],[2,-2,2],[2,2,-2],[-2,-2,2],[-2,2,-2],[2,-2,-2],[-2,-2,-2]];
const cubeLines = [[4,1],[1,0],[0,2],[2,4],[4,7],[2,6],[0,3],[1,5],[6,7],[7,5],[5,3],[3,6]];

//storage for the tetrahedron coord and line data
let tetraCoords = [[1,0,-1/(2**0.5)],[-1,0,-1/(2**0.5)],[0,1,1/(2**0.5)],[0,-1,1/(2**0.5)]];
const tetraLines = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];

//storage for the octahedron coord and line data
const octaCoords = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const octaLines = [[0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]];

//storage for the icosahedron coord and line data
let icosaCoords = [[gR, 1, 0], [-gR, 1, 0], [gR, -1, 0], [-gR, -1, 0], [1, 0, gR], [-1, 0, gR], [1, 0, -gR], [-1, 0, -gR], [0, gR, 1], [0, -gR, 1], [0, gR, -1], [0, -gR, -1]];
const icosaLines = [[0, 2], [0, 4], [0, 6], [0, 8], [0, 10], [1, 3], [1, 5], [1, 7], [1, 8], [1, 10], [2, 4], [2, 6], [2, 9], [2, 11], [3, 5], [3, 7], [3, 9], [3, 11], [4, 5], [4, 8], [4, 9], [5, 8], [5, 9], [6, 7], [6, 10], [6, 11], [7, 10], [7, 11], [8, 10], [9, 11]];

//storage for the hypercube coord and line data
//const hypCubeCoords = [[1,-1,1,1], [1,1,1,1], [-1,1,1,1], [-1,-1,1,1], [1,-1,-1,1], [1,1,-1,1], [-1,1,-1,1], [-1,-1,-1,1], [1,-1,1,-1], [1,1,1,-1], [-1,1,1,-1], [-1,-1,1,-1], [1,-1,-1,-1], [1,1,-1,-1], [-1,1,-1,-1], [-1,-1,-1,-1]];
const hypCubeCoords = [[2,-2,2,2], [2,2,2,2], [-2,2,2,2], [-2,-2,2,2], [2,-2,-2,2], [2,2,-2,2], [-2,2,-2,2], [-2,-2,-2,2], [2,-2,2,-2], [2,2,2,-2], [-2,2,2,-2], [-2,-2,2,-2], [2,-2,-2,-2], [2,2,-2,-2], [-2,2,-2,-2], [-2,-2,-2,-2]];
const hypCubeLines = [[0, 1], [0, 3], [0, 4], [0, 8], [1, 2], [1, 5], [1, 9], [2, 3], [2, 6], [2, 10], [3, 7], [3, 11], [4, 5], [4, 7], [4, 12], [5, 6], [5, 13], [6, 7], [6, 14], [7, 15], [8, 9], [8, 11], [8, 12], [9, 10], [9, 13], [10, 11], [10, 14], [11, 15], [12, 13], [12, 15], [13, 14], [14, 15]];

//storage for the hTetra coord and line data
//let hTetraCoords = [[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,2],[gR,gR,gR,gR]];
//let hTetraCoords = [[10**(-0.5),6**(-0.5),3**(-0.5),1],[10**(-0.5),6**(-0.5),3**(-0.5),-1],[10**(-0.5),6**(-0.5),-2*(3**(-0.5)),0],[10**(-0.5),-1*(3/2)**0.5,0,0],[-2*(2/5)**0.5,0,0,0]];
let hTetraCoords = [[1,1,1,-1*(5**(-0.5))],[1,-1,-1,-1*(5**(-0.5))],[-1,1,-1,-1*(5**(-0.5))],[-1,-1,1,-1*(5**(-0.5))],[0,0,0,4*(5**(-0.5))]];
const hTetraLines = [[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]];

//storage for the hypercube coord and line data
let hOctaCoords = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1],[-1,0,0,0],[0,-1,0,0],[0,0,-1,0],[0,0,0,-1]];
const hOctaLines = [[0, 1], [0, 2], [0, 3], [0, 5], [0, 6], [0, 7], [1, 2], [1, 3], [1, 4], [1, 6], [1, 7], [2, 3], [2, 4], [2, 5], [2, 7], [3, 4], [3, 5], [3, 6], [4, 5], [4, 6], [4, 7], [5, 6], [5, 7], [6, 7]];

let coords = [[2,2,2],[-2,2,2],[2,-2,2],[2,2,-2],[-2,-2,2],[-2,2,-2],[2,-2,-2],[-2,-2,-2]];
let lines = [[4,1],[1,0],[0,2],[2,4],[4,7],[2,6],[0,3],[1,5],[6,7],[7,5],[5,3],[3,6]];


let perspectiveEnabled = true; //This will decide whether or not to use perspective during rendering

function perspectiveChange() {
    if (perspectiveEnabled == false) {
        perspectiveEnabled = true;
        document.getElementById("perspectiveChange").innerHTML = 'Perspective (P) ON';
    }
    else if (perspectiveEnabled == true) {
        perspectiveEnabled = false;
        document.getElementById("perspectiveChange").innerHTML = 'Perspective (P) OFF';
    }
    render(coords);
}

function wPerspExagOnOff() {
    if (wPerspExagOn == false) {
        wPerspExagOn = true;
        document.getElementById("wPerspExagOnOff").innerHTML = 'Exaggerate 4D Perspective (X) ON';
    }
    else if (wPerspExagOn == true) {
        wPerspExagOn = false;
        document.getElementById("wPerspExagOnOff").innerHTML = 'Exaggerate 4D Perspective (X) OFF';
    }
    render(coords);
}

function mouseFollowOnOff() {
    if (mouseFollow == false) {
        mouseFollow = true;
        document.getElementById("mouseFollowOnOff").innerHTML = 'Mouse Follow (M) ON';
    }
    else if (mouseFollow == true) {
        mouseFollow = false;
        document.getElementById("mouseFollowOnOff").innerHTML = 'Mouse Follow (M) OFF';
    }
    render(coords);
}

let followEnabled = true; //This will let the shape keep facing the mouse curser

function followChange() {
    if (followEnabled == false) {
        followEnabled = true;
    }
    else if (followEnabled == true) {
        followEnabled = false;
    }
    render(coords);
}

//selects the cube as the working shape
function cubeSelect() {
    coords = arrCopy(cubeCoords);
    lines = arrCopy(cubeLines);
    render(coords);
}

//selects the tetrahedron as the working shape
function tetraSelect() {
    coords = arrCopy(tetraCoords);
    lines = arrCopy(tetraLines);
    render(coords);
}

//selects the dodecahedron as the working shape
function dodeSelect() {
    coords = arrCopy(dodeCoords);
    lines = arrCopy(dodeLines);
    render(coords);
}

//selects the octahedron as the working shape
function octaSelect() {
    coords = arrCopy(octaCoords);
    lines = arrCopy(octaLines);
    render(coords);
}

//selects the icosahedron as the working shape
function icosaSelect() {
    coords = arrCopy(icosaCoords);
    lines = arrCopy(icosaLines);
    render(coords);
}

//selects the hypercube as the working shape
function hypCubeSelect() {
    coords = arrCopy(hypCubeCoords);
    lines = arrCopy(hypCubeLines);
    render(coords);
}

//selects the hypercube as the working shape
function hTetraSelect() {
    coords = arrCopy(hTetraCoords);
    lines = arrCopy(hTetraLines);
    render(coords);
}

//selects the hypercube as the working shape
function hOctaSelect() {
    coords = arrCopy(hOctaCoords);
    lines = arrCopy(hOctaLines);
    render(coords);
}

//selects the hyper diamond as the working shape
function hDiamondSelect() {
    coords = arrCopy(hDiamondCoords);
    lines = arrCopy(hDiamondLines);
    render(coords);
}

//selects the hexacosichoron as the working shape
function hDodeSelect() {
    coords = arrCopy(hDodeCoords);
    lines = arrCopy(hDodeLines);
    render(coords);
}

//selects the heconicosichoron as the working shape
function hIcoSelect() {
    coords = arrCopy(hIcoCoords);
    lines = arrCopy(hIcoLines);
    render(coords);
}

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

//creates the distData: an array of arrays of the form [coord1 number, coord2 number, distance between then]
function everyDist(coords) {
    let holdEnd = [];
    for (let i = 0; i < coords.length; i++) {
        for (let j = 0; j < coords.length; j++) {
            if (i < j) {
                let hold = [];
                hold.push(i);
                hold.push(j);
                hold.push(vecDist(coords[i], coords[j]));
                holdEnd.push(hold);
            }
        }
    }
    return holdEnd;
}

//Takes the distData and returns the shortest length
function findShortestLen(distData) {
    let test = 10**100;
    for (let i = 0; i < distData.length; i++) {
        if (distData[i][2] < test) {
            test = distData[i][2];
        }
    }
    return test;
}

//Takes coordinates and returns which coordinate numbers should join (lineData)
function coordsToLines(coords) {
    let distData = everyDist(coords);
    let smallestDist = findShortestLen(distData);
    let holdEnd = [];
    for (let i = 0; i < distData.length; i++) {
        if (distData[i][2].toFixed(5) == smallestDist.toFixed(5)) {
            let hold = [];
            hold.push(distData[i][0]);
            hold.push(distData[i][1]);
            holdEnd.push(hold);
        }
    }
    return holdEnd;
}

//returns the cross product of two vectors
function vecCross(vec1, vec2) {
    return [vec1[1]*vec2[2]-vec1[2]*vec2[1], vec1[2]*vec2[0]-vec1[0]*vec2[2], vec1[0]*vec2[1]-vec1[1]*vec2[0]];
}

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


function biggestMag(coords) {
    let hold = 0;
    for (let i = 0; i < coords.length; i++) {
        if (vecMag(coords[i]) > hold) {
            hold = vecMag(coords[i]);
        }
    }
    return hold;
}

//Takes coorda and rotates them in the yz-plane
function rotYZ(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let y = coords[i][1];
        let z = coords[i][2];
        coords[i][1] = y*Math.cos(theta) - z*Math.sin(theta);
        coords[i][2] = y*Math.sin(theta) + z*Math.cos(theta);
    }
}
function doRotYZ() {
    rotYZ(coords, rotAngle);
    render(coords);
}
function undoRotYZ() {
    rotYZ(coords, -1*rotAngle);
    render(coords);
}

//Takes coorda and rotates them in the xz-plane
function rotXZ(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let x = coords[i][0];
        let z = coords[i][2];
        coords[i][0] = x*Math.cos(theta) - z*Math.sin(theta);
        coords[i][2] = x*Math.sin(theta) + z*Math.cos(theta);
    }
}
function doRotXZ() {
    rotXZ(coords, rotAngle);
    render(coords);
}
function undoRotXZ() {
    rotXZ(coords, -1*rotAngle);
    render(coords);
}

//Takes coorda and rotates them in the xz-plane
function rotXY(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let x = coords[i][0];
        let y = coords[i][1];
        coords[i][0] = x*Math.cos(theta) - y*Math.sin(theta);
        coords[i][1] = x*Math.sin(theta) + y*Math.cos(theta);
    }
}
function doRotXY() {
    rotXY(coords, rotAngle);
    render(coords);
}
function undoRotXY() {
    rotXY(coords, -1*rotAngle);
    render(coords);
}

//Takes coords and rotates them in the xw-plane
function rotXW(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let x = coords[i][0];
        let w = coords[i][3];
        coords[i][0] = x*Math.cos(theta) - w*Math.sin(theta);
        coords[i][3] = x*Math.sin(theta) + w*Math.cos(theta);
    }
}
function doRotXW() {
    if (coords[0].length == 4) {
        rotXW(coords, rotAngle);
        render(coords);
    }
}
function undoRotXW() {
    if (coords[0].length == 4) {
        rotXW(coords, -1*rotAngle);
        render(coords);
    }
}

//Takes coords and rotates them in the yw-plane
function rotYW(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let y = coords[i][1];
        let w = coords[i][3];
        coords[i][1] = y*Math.cos(theta) - w*Math.sin(theta);
        coords[i][3] = y*Math.sin(theta) + w*Math.cos(theta);
    }
}
function doRotYW() {
    if (coords[0].length == 4) {
        rotYW(coords, rotAngle);
        render(coords);
    }
}
function undoRotYW() {
    if (coords[0].length == 4) {
        rotYW(coords, -1*rotAngle);
        render(coords);
    }
}

//Takes coords and rotates them in the yw-plane
function rotZW(coords, theta) {
    for (let i = 0; i < coords.length; i++){
        let z = coords[i][2];
        let w = coords[i][3];
        coords[i][2] = z*Math.cos(theta) - w*Math.sin(theta);
        coords[i][3] = z*Math.sin(theta) + w*Math.cos(theta);
    }
}
function doRotZW() {
    if (coords[0].length == 4) {
        rotZW(coords, rotAngle);
        render(coords);
    }
}
function undoRotZW() {
    if (coords[0].length == 4) {
        rotZW(coords, -1*rotAngle);
        render(coords);
    }
}

//Takes the coords and scales it to fit the canvas
function scaleCoords(coords, scalePerc) {
    //console.log(coords)
    let hold = arrCopy(coords);
    //console.log(hold)
    let hbm = biggestMag(hold);
    //console.log(hbm)
    const canHeight = document.getElementById("mainCanvas").height;
    const canWidth = document.getElementById("mainCanvas").width;
    const smallerDim = (canHeight < canWidth) ? canHeight : canWidth;
    //console.log(smallerDim)
    const scale = (scalePerc*smallerDim/2)/hbm;
    //console.log(scale)
        for (let i = 0; i < hold.length; i++){
            hold[i] = vecScale(scale, hold[i]);
        }
    //console.log(hold)
    return hold;
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



//generators for more complicated hypershapes

//Takes an array and returns an array of all possible sign mixtures for the original array
function arrSignMix(arr) {
    let hold = [];
    hold.push(arr);
    const order = arr.length;
    for (let i = 1; i < 2**order; i++) {
        let mix = i.toString(2);
        console.log(mix)
        let arr2 = arrCopy(arr);
        for (let j = mix.length-1; j >= 0; j--) {
            arr2[mix.length-1-j] *= -2*parseInt(mix[j])+1;
        }
        console.log(arr2)
        hold.push(arr2);
    }
    return hold;
}

//Takes a variable and array, puts the variable in each place of the array
function allInsert(v, arr) {
    let hold = [];
    for (let i = 0; i < (arr.length + 1); i++) {
        arr2 = arrCopy(arr);
        arr2.splice(i, 0, v);
        hold.push(arr2)
    }
    return hold;
}

//Takers a variable and does allInsert to arrays within an array
function arrAllInsert(v, arr) {
    let hold = [];
    for (let i = 0; i < (arr.length); i++) {
        hold = hold.concat(allInsert(v, arr[i]));
    }
    return hold;
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

//Removed duplicates from an array of arrays
function arrRemDups(arr) {
    let arrC = arrCopy(arr);
    let hold = [];
    while (arrC.length > 0) {
        let testVal = arrC.shift();
        let doCopy = true;
        for (let i = 0; i < (arrC.length); i++) {
            if (arrEqual(testVal, arrC[i])) {
                doCopy = false;
            }
        }
        if (doCopy == true) {
            hold.push(testVal)
        }
    }
    return hold;
}

//permuter
function permute(arr) {
    let arrC = arrCopy(arr);
    let hold = [];
    hold = allInsert(arrC.shift(), hold);
    for (let i = 0; i < (arrC.length); i++) {
        hold = arrAllInsert(arrC[i], hold);
    }
    return arrRemDups(hold);
}

//store for even permutations of a 4D array
const evenPerms4 = [[0,1,2,3],[0,2,3,1],[0,3,1,2],[1,0,3,2],[1,2,0,3],[1,3,2,0],[2,0,1,3],[2,1,3,0],[2,3,0,1],[3,0,2,1],[3,1,0,2],[3,2,1,0]];

//Takes a 4D array and returns all even permutations
function evenPerm4D(arr) {
    let hold = [];
    for (let i = 0; i < (evenPerms4.length); i++) {
        let arrHold = [0,0,0,0];
        arrHold[0] = arr[evenPerms4[i][0]];
        arrHold[1] = arr[evenPerms4[i][1]];
        arrHold[2] = arr[evenPerms4[i][2]];
        arrHold[3] = arr[evenPerms4[i][3]];
        hold.push(arrHold);
    }
    return arrRemDups(hold);
}

//24-cell (hyper diamond) generation
const hDiaM = arrRemDups(arrSignMix([1,1,0,0]));
let hDiamondCoords = [];
for (let i = 0; i < (hDiaM.length); i++) {
    hDiamondCoords = hDiamondCoords.concat(permute(hDiaM[i]));
}
hDiamondCoords = arrRemDups(hDiamondCoords);
const hDiamondLines = coordsToLines(hDiamondCoords);


//600-cell (hexacosichoron) generation
const hDodeM1 = arrRemDups(arrSignMix([0,0,0,1]));
let hDodeP1 = [];
for (let i = 0; i < (hDodeM1.length); i++) {
    hDodeP1 = hDodeP1.concat(permute(hDodeM1[i]));
}
const hDodeM2 = arrRemDups(arrSignMix([0.5,0.5,0.5,0.5]));

const hDodeM3 = arrRemDups(arrSignMix([gR/2,1/2,1/(2*gR),0]));
let hDodeP3 = [];
for (let i = 0; i < (hDodeM3.length); i++) {
    hDodeP3 = hDodeP3.concat(evenPerm4D(hDodeM3[i]));
}

let hDodeCoords = [];
hDodeCoords = hDodeCoords.concat(hDodeP1, hDodeM2, hDodeP3);
hDodeCoords = arrRemDups(hDodeCoords);
const hDodeLines = coordsToLines(hDodeCoords);

//120-cell (hecatonicosachoron)
const hIcoM1 = arrRemDups(arrSignMix([0,0,2,2]));
let hIcoP1 = [];
for (let i = 0; i < (hIcoM1.length); i++) {
    hIcoP1 = hIcoP1.concat(permute(hIcoM1[i]));
}

const hIcoM2 = arrRemDups(arrSignMix([1,1,1,5**0.5]));
let hIcoP2 = [];
for (let i = 0; i < (hIcoM2.length); i++) {
    hIcoP2 = hIcoP2.concat(permute(hIcoM2[i]));
}

const hIcoM3 = arrRemDups(arrSignMix([gR**(-2),gR,gR,gR]));
let hIcoP3 = [];
for (let i = 0; i < (hIcoM3.length); i++) {
    hIcoP3 = hIcoP3.concat(permute(hIcoM3[i]));
}

const hIcoM4 = arrRemDups(arrSignMix([gR**(-1),gR**(-1),gR**(-1),gR**2]));
let hIcoP4 = [];
for (let i = 0; i < (hIcoM4.length); i++) {
    hIcoP4 = hIcoP4.concat(permute(hIcoM4[i]));
}

const hIcoM5 = arrRemDups(arrSignMix([0,gR**(-2),1,gR**2]));
let hIcoP5 = [];
for (let i = 0; i < (hIcoM5.length); i++) {
    hIcoP5 = hIcoP5.concat(evenPerm4D(hIcoM5[i]));
}

const hIcoM6 = arrRemDups(arrSignMix([0,gR**(-1),gR,5**0.5]));
let hIcoP6 = [];
for (let i = 0; i < (hIcoM6.length); i++) {
    hIcoP6 = hIcoP6.concat(evenPerm4D(hIcoM6[i]));
}

const hIcoM7 = arrRemDups(arrSignMix([gR**(-1),1,gR,2]));
let hIcoP7 = [];
for (let i = 0; i < (hIcoM7.length); i++) {
    hIcoP7 = hIcoP7.concat(evenPerm4D(hIcoM7[i]));
}

let hIcoCoords = [];
hIcoCoords = hIcoCoords.concat(hIcoP1, hIcoP2, hIcoP3, hIcoP4, hIcoP5, hIcoP6, hIcoP7);
hIcoCoords = arrRemDups(hIcoCoords);
const hIcoLines = coordsToLines(hIcoCoords);

//pre-rotations to make shapes nicer to display
rotYZ(tetraCoords, pi/3);
rotYZ(dodeCoords, -1*pi/6);
rotYZ(icosaCoords, -1*pi/8);
rotXY(hTetraCoords, -1*pi/4);
rotYZ(hTetraCoords, 7.5*pi/24);