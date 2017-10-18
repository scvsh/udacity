const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const submit = document.getElementById('submit');
const colorpicker = document.getElementById('colorPicker');
const widthpicker = document.getElementById('input_width');
const heightpicker = document.getElementById('input_height');

// Create event listener for the button.
//
submit.addEventListener('click', makeGrid);

// Create line grid and event listener for the canvas.

function createLines() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	canvas.addEventListener('click', function(event) {
		addPixel();
	});


	for (let x = 0.5; x < widthpicker.value + 1; x += 10) {
		context.moveTo(x, 0);
		context.lineTo(x, heightpicker.value);
	}

	for (let y = 0.5; y < heightpicker.value + 1; y += 10) {
		context.moveTo(0, y);
		context.lineTo(widthpicker.value, y);
	}

	context.strokeStyle = '#eee';
	context.stroke();
}

// Add single rectangle.

function addPixel() {
	let color = colorpicker.value,
		elemLeft = canvas.offsetLeft,
		elemTop = canvas.offsetTop,
		x = event.pageX - elemLeft,
		y = event.pageY - elemTop;

	context.fillStyle = color;
	context.fillRect(x - x % 10, y - y % 10, 10, 10);

}

// Create canvas for painting.

function makeGrid() {
	canvas.width = +widthpicker.value + 1;
	canvas.height = +heightpicker.value + 1;
	createLines();
}
