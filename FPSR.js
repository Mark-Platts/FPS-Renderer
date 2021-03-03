//stored variables
const pi = Math.PI;
const rotAngle = pi/24;
let lastMousePos = [0,0];
const worldToCanvasScale = 1000;
const moveSpeed = 10;
const rotSpeed = 1;
const mouseRotSpeed = 0.001;
let mouseFollow = true;



//camera
let camera = {
    position: [0,-150,-2000],
    xunit: [1,0,0],
    yunit: [0,1,0],
    zunit: [0,0,1],
    eyeDist: 1
}

//Uses the camera's xunit to nudge the zunit to the right or left, gets new zunit, the calculates new xunit using z and y units.
function rightwardCamRot(camera, magnitude) {
    camera.zunit = vecUnit(vecAdd(vecScale(magnitude, camera.xunit), camera.zunit));
    camera.xunit = vecUnit(vecCross([0,1,0], camera.zunit));
}

//Uses the camera's yunit to nudge the zunit to up or down, gets new zunit, the calculates new yunit using z and x units.
function upwardCamRot(camera, magnitude) {
    camera.zunit = vecUnit(vecAdd(vecScale(magnitude, camera.yunit), camera.zunit));
    camera.yunit = vecCross(camera.zunit, camera.xunit);
}

//Uses the camera's zunit to move the camera forward or backward
function forwardCamMov(camera, magnitude) {
    camera.position = vecAdd(camera.position, vecScale(magnitude, camera.zunit));
}

//Uses the camera's xunit to move the camera right or left
function rightwardCamMov(camera, magnitude) {
    camera.position = vecAdd(camera.position, vecScale(magnitude, camera.xunit));
}

//Takes a world coordinate and returns it from the camera pov
function coordToCam(camera, coord) {
    return vecDiff(coord, camera.position);
}

function showCamUnits(camera) {
    console.log(camera.xunit);
    console.log(vecMag(camera.xunit));
    console.log(camera.yunit);
    console.log(vecMag(camera.yunit));
    console.log(camera.zunit);
    console.log(vecMag(camera.zunit));
}


//world
const object1 = {
    coords: [[100,0,0],[100,0,100],[200,0,100],[200,0,0],[100,100,0],[100,100,100],[200,100,100],[200,100,0]],
    lines: [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]]
}

const object2 = {
    coords: [[100,0,200],[100,0,300],[200,0,300],[200,0,200],[100,100,200],[100,100,300],[200,100,300],[200,100,200]],
    lines: [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]]
}

const world = [object1, object2];


//Array and vector
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



//Sizing and canvas
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





//Takes a camera and coordinate, returns where coordinate appears on the canvas according to perspective
//worldToCanvasScale makes things bigger or smaller on the canvas if necessary
//eyeDist is distance from the center of the canvas to the eye
function setPersp(camera, coords) {
    let hold = [];
    const eyeDist = camera.eyeDist;
    for (let i = 0; i < coords.length; i++){
        const camCoord = coordToCam(camera, coords[i]);
        let rastCoord = [];
        let x = vecDot(camCoord, camera.xunit);
        let y = vecDot(camCoord, camera.yunit);
        let z = vecDot(camCoord, camera.zunit);
        //console.log(z)
        rastCoord.push(x*eyeDist/z);
        rastCoord.push(y*eyeDist/z);
        hold.push(vecScale(worldToCanvasScale,rastCoord));
    }
    return hold;
}


//Takes the coord and line data and renders them to the canvas
function render(world){
    const canCenX = document.getElementById("mainCanvas").width/2;
    const canCenY = document.getElementById("mainCanvas").height/2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#FFFFFF";
    for (let i = 0; i < world.length; i++) {
        let coords = world[i].coords;
        let lines = world[i].lines;
        let finCoords = setPersp(camera, coords);
        for (let i = 0; i < lines.length; i++){
            ctx.beginPath();
            ctx.moveTo(canCenX + finCoords[lines[i][0]][0], canCenY + finCoords[lines[i][0]][1]);
            ctx.lineTo(canCenX + finCoords[lines[i][1]][0], canCenY + finCoords[lines[i][1]][1]);
            ctx.stroke();
        }
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


function mouseMove(evt) {
    if (mouseFollow){
        upwardCamRot(camera, mouseRotSpeed*evt.movementY);
        rightwardCamRot(camera, mouseRotSpeed*evt.movementX);
        render(world);
    }
}



//keypress resolve
function resolveKeyPress(e) {
    if (e.keyCode == 87){
        forwardCamMov(camera,moveSpeed);
    }
    else if (e.keyCode == 83){
        forwardCamMov(camera,-1*moveSpeed);
    }
    else if (e.keyCode == 68){
        rightwardCamMov(camera, moveSpeed);
    }
    else if (e.keyCode == 65){
        rightwardCamMov(camera, -1*moveSpeed);
    }
    else if (e.keyCode == 76){
        rightwardCamRot(camera, rotSpeed);
    }
    else if (e.keyCode == 74){
        rightwardCamRot(camera, -1*rotSpeed);
    }
    else if (e.keyCode == 73){
        upwardCamRot(camera, rotSpeed);
    }
    else if (e.keyCode == 75){
        upwardCamRot(camera, -1*rotSpeed);
    }
    else if (e.keyCode == 77){
        mouseFollow = mouseFollow ? false : true;
    }
    console.log(camera.xunit)
    console.log(vecMag(camera.xunit))
    console.log(camera.yunit)
    console.log(vecMag(camera.yunit))
    console.log(camera.zunit)
    console.log(vecMag(camera.zunit))
    render(world);
}
document.addEventListener('keydown', resolveKeyPress);

