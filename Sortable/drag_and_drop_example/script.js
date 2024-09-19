
// Get the draggable element and the dropzone
const draggable = document.getElementById('draggable');
const dropzone = document.getElementById('dropzone');

// Event listeners for drag and drop functionality
draggable.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', e.target.id);
  e.target.style.opacity = '0.5';
});

draggable.addEventListener('dragend', (e) => {
  e.target.style.opacity = '1';
});

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault(); // Necessary to allow a drop
  e.target.style.backgroundColor = '#f0f0f0';
});

dropzone.addEventListener('dragleave', (e) => {
  e.target.style.backgroundColor = '';
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  const draggableId = e.dataTransfer.getData('text');
  const draggedElement = document.getElementById(draggableId);
  dropzone.appendChild(draggedElement);
  e.target.style.backgroundColor = '';
});
    