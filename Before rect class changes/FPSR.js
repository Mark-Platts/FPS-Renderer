//stored variables
const pi = Math.PI;
const rotAngle = pi/24;
let lastMousePos = [0,0];
const worldToCanvasScale = 1000;
let moveSpeed = 10;
const rotSpeed = 1;
const mouseRotSpeed = 0.002;
let mouseFollow = false;



//camera
let camera = {
    position: [0,-150,-2000],
    xunit: [1,0,0],
    yunit: [0,1,0],
    zunit: [0,0,1],
    eyeDist: 1,
    noClip: false
}

//Uses the camera's xunit to nudge the zunit to the right or left, gets new zunit, the calculates new xunit using z and y units.
function rightwardCamRot(camera, magnitude) {
    camera.zunit = vecUnit(vecAdd(vecScale(magnitude, camera.xunit), camera.zunit));
    camera.xunit = vecUnit(vecCross([0,1,0], camera.zunit));
}

//Uses the camera's yunit to nudge the zunit to up or down, gets new zunit, the calculates new yunit using z and x units.
function upwardCamRot(camera, magnitude) {
    const newZunit = vecUnit(vecAdd(vecScale(magnitude, camera.yunit), camera.zunit));
    const newYunit = vecCross(camera.zunit, camera.xunit);
    const horizonAngle = Math.acos(vecDot([0,1,0],newYunit));
    camera.zunit = newZunit;
    camera.yunit = newYunit;
}

//Uses the camera's zunit to move the camera forward or backward
function forwardCamMov(camera, magnitude) {
    if (camera.noClip) {
        camera.position = vecAdd(camera.position, vecScale(magnitude, camera.zunit));
    }
    else {
        const z = vecCross(camera.xunit, [0,1,0]);
        camera.position = vecAdd(camera.position, vecScale(magnitude, z));
    }
}

//Uses the camera's xunit to move the camera right or left
function rightwardCamMov(camera, magnitude) {
    camera.position = vecAdd(camera.position, vecScale(magnitude, camera.xunit));
}

//noClip on or off, reverts y-position when off
function noClipOnOff(camera) {
    if (camera.noClip) {
        camera.noClip = false;
        camera.position[1] = -150;
    }
    else {
        camera.noClip = true;
    }
}

//changes the movement speed between a walk and run
function movRunOnOff() {
    if (moveSpeed == 10) {
        moveSpeed = 30;
    }
    else if (moveSpeed != 10) {
        moveSpeed = 10;
    }
}

//Anonymous on off function
function argOnOff(arg) {
    if (arg) {
        arg = false;
    }
    else {
        arg = true;
    }
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

class rectoid {
    constructor(position, width, height, depth) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.vertices = [
            [position[0] - width/2, position[1] - height/2, position[2] - depth/2],
            [position[0] - width/2, position[1] - height/2, position[2] + depth/2],
            [position[0] + width/2, position[1] - height/2, position[2] + depth/2],
            [position[0] + width/2, position[1] - height/2, position[2] - depth/2],
            [position[0] - width/2, position[1] + height/2, position[2] - depth/2],
            [position[0] - width/2, position[1] + height/2, position[2] + depth/2],
            [position[0] + width/2, position[1] + height/2, position[2] + depth/2],
            [position[0] + width/2, position[1] + height/2, position[2] - depth/2]];
        this.lineData = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    }
    lineCoords() {
        let holdEnd = [];
        for (let i = 0; i < this.lineData.length; i++) {
            let hold = [];
            hold.push(this.vertices[this.lineData[i][0]]);
            hold.push(this.vertices[this.lineData[i][1]]);
            holdEnd.push(hold);
        }
        return holdEnd;
    }
}

let testRect = new rectoid([0,0,0], 10, 20 ,30);

const Nworld = [testRect];

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
    render(world)
}
window.addEventListener('resize', windowResize);


//Takes a camera and single coordinate, returns where coordinate appears on the canvas according to perspective
//worldToCanvasScale makes things bigger or smaller on the canvas if necessary
//eyeDist is distance from the center of the canvas to the eye
function NsetPersp(camera, coord) {
    const eyeDist = camera.eyeDist;
    const camCoord = coordToCam(camera, coord);
        let rastCoord = [];
        let x = vecDot(camCoord, camera.xunit);
        let y = vecDot(camCoord, camera.yunit);
        let z = vecDot(camCoord, camera.zunit);
        rastCoord.push(x*eyeDist/z);
        rastCoord.push(y*eyeDist/z);
    return rastCoord;
}

//Takes rect data and renders it to the canvas in perspective
function Nrender(world){
    const canCenX = document.getElementById("mainCanvas").width/2;
    const canCenY = document.getElementById("mainCanvas").height/2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#FFFFFF";
    for (let i = 0; i < world.length; i++) {
        let coords = world[i].lineCoords();
        //let finCoords = setPersp(camera, coords);
        for (let i = 0; i < coords.length; i++){
            const initialVertex = setPersp(camera, coords[i][0]);
            const finalVertex = setPersp(camera, coords[i][1]);
            ctx.beginPath();
            ctx.moveTo(canCenX + initialVertex[0], canCenY + initialVertex[1]);
            ctx.lineTo(canCenX + finalVertex[0], canCenY + finalVertex[1]);
            ctx.stroke();
        }
    }
}

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
        canvas.requestPointerLock();
        if (!mouseFollow) {
            mouseFollow = true;
        }
    }
    else if (e.keyCode == 27){
        if (mouseFollow) {
            mouseFollow = false;
        }
    }
    else if (e.keyCode == 86){
        noClipOnOff(camera);
    }
    else if (e.keyCode == 82){
        movRunOnOff();
    }
    render(world);
}
document.addEventListener('keydown', resolveKeyPress);


//pointer lock experiments
