



const canvas = document.getElementById('textCanvas');
const ctx = canvas.getContext('2d');
let fontSizeInput = document.getElementById('fontSize');
let fontFamilyInput = document.getElementById('fontFamily');
let undoButton = document.getElementById('undo');
let redoButton = document.getElementById('redo');
let addTextButton = document.getElementById('addTextButton');
let editTextBox = document.getElementById('editTextBox');

let textElements = []; 
let currentTextElement = null; 
let draggingTextElement = null; 
let isDragging = false;
let isEditing = false;


let history = [];
let redoStack = [];

canvas.style.width ='90%';
canvas.style.height='70%';
canvas.width  = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

function saveState() {
    const canvasState = {
        image: canvas.toDataURL(),
        textElements: JSON.parse(JSON.stringify(textElements)) 
    };
    history.push(canvasState);
    redoStack = []; 
}

function restoreState(stack) {
    if (stack.length > 0) {
        let state = stack.pop();
        let img = new Image();
        img.src = state.image;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            
            textElements = JSON.parse(JSON.stringify(state.textElements));
            drawCanvas();
        };
    }
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    textElements.forEach((textElement) => {
        ctx.font = `${textElement.size}px ${textElement.font}`;
        ctx.textAlign = "center";
        ctx.fillText(textElement.text, textElement.x, textElement.y);
    });
}


addTextButton.addEventListener('click', () => {
    const newTextElement = {
        text: "Your Text Here",
        size: parseInt(fontSizeInput.value),
        font: fontFamilyInput.value,
        x: canvas.width / 2,
        y: canvas.height / 2,
    };
    textElements.push(newTextElement);
    saveState();
    drawCanvas();
});


canvas.addEventListener('mousedown', (e) => {
    if (isEditing) return;

    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    
    textElements.forEach((textElement) => {
        const textWidth = ctx.measureText(textElement.text).width;
        if (mouseX >= textElement.x - textWidth / 2 && mouseX <= textElement.x + textWidth / 2 &&
            mouseY >= textElement.y - textElement.size && mouseY <= textElement.y) {
            draggingTextElement = textElement;
            isDragging = true;
            saveState();
        }
    });
});


canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        draggingTextElement.x = e.offsetX;
        draggingTextElement.y = e.offsetY;
        drawCanvas();
    }
});


canvas.addEventListener('mouseup', () => {
    isDragging = false;
    draggingTextElement = null;
});


canvas.addEventListener('dblclick', (e) => {
    if (isEditing) return;

    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    
    textElements.forEach((textElement) => {
        const textWidth = ctx.measureText(textElement.text).width;
        if (mouseX >= textElement.x - textWidth / 2 && mouseX <= textElement.x + textWidth / 2 &&
            mouseY >= textElement.y - textElement.size && mouseY <= textElement.y) {

            currentTextElement = textElement;
            isEditing = true;
            editTextBox.style.left = `${e.clientX}px`;
            editTextBox.style.top = `${e.clientY - textElement.size}px`;
            editTextBox.value = textElement.text;
            editTextBox.style.display = 'block';
            editTextBox.focus();
        }
    });
});


editTextBox.addEventListener('blur', () => {
    if (currentTextElement) {
        currentTextElement.text = editTextBox.value;
        currentTextElement.size = parseInt(fontSizeInput.value); 
        currentTextElement.font = fontFamilyInput.value; 
        editTextBox.style.display = 'none';
        isEditing = false;
        currentTextElement = null;
        saveState();
        drawCanvas();
    }
});


undoButton.addEventListener('click', () => {
    if (history.length > 0) {
        redoStack.push({
            image: canvas.toDataURL(),
            textElements: JSON.parse(JSON.stringify(textElements))
        }); 
        restoreState(history);
    }
});


redoButton.addEventListener('click', () => {
    if (redoStack.length > 0) {
        history.push({
            image: canvas.toDataURL(),
            textElements: JSON.parse(JSON.stringify(textElements))
        }); 
        restoreState(redoStack);
    }
});

let fontList = [
    "Arial", 
    "Times New Roman", 
    "Garamond", 
    "Verdana", 
    "Cursive", 
    "Calibri", 
    "Georgia",
    "Courier New", 
    "Lucida Console", 
    "Tahoma", 
    "Trebuchet MS", 
    "Comic Sans MS", 
    "Impact", 
    "Consolas", 
    "Palatino Linotype", 
    "Century Gothic", 
    "Arial Black", 
    "Brush Script MT", 
    "Futura", 
    "Helvetica", 
    "Georgia", 
    "Garamond", 
    "Verdana", 
    "Arial Narrow", 
    "Segoe UI", 
    "Cambria", 
    "Didot", 
    "Frank Ruhl", 
    "Lora", 
    "Merriweather", 
    "Noto Sans", 
    "Open Sans", 
    "Roboto", 
    "Source Sans Pro", 
    "Ubuntu", 
    "Avenir", 
    "PT Sans", 
    "Playfair Display", 
    "Raleway", 
    "Quicksand", 
    "Inconsolata", 
    "Oswald", 
    "Anton", 
    "Droid Sans", 
    "Exo", 
    "Karla", 
    "Work Sans", 
    "Mulish", 
    "Tisa", 
    "Zilla Slab", 
    "Poppins", 
    "Montserrat", 
    "Lato", 
    "Ubuntu", 
];

fontList.map((value) => {
    let option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    document.getElementById("fontFamily").appendChild(option);
});

saveState();