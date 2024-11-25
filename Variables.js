// Initializes global variables for later usage

const tracker = document.getElementById("tracker");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const fps = 30;
const timeMultiplier = 1/fps;

const moveSpeed = 200; // Objects move this many pixels a second
const distPerFrame = moveSpeed/fps; // How many pixels do obstacles move per frame

const obstacleTypes = ["block", "spike"]; // Just a reminder to update when adding new objects - files that need to be updated upon adding new objects include (levelmanager, obstacles)