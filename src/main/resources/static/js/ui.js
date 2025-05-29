// src/main/resources/static/js/ui.js
function showModal(title, message, onConfirm, onCancel) {
    console.log('Modal:', title, message);
    // Basic confirm for now
    if (confirm(`${title}\n${message}\n\nClick OK to confirm, Cancel to abort.`)) {
        if (onConfirm) onConfirm();
    } else {
        if (onCancel) onCancel();
    }
}

function showToast(message, type = 'info') { // type can be 'info', 'success', 'error'
    console.log('Toast:', type, message);
    // For now, just an alert. A proper toast would be non-blocking.
    alert(`Toast (${type}): ${message}`); 
}

// Example of a more dynamic toast/alert area (optional for this step, can be refined later)
// function createToastContainer() {
//     let container = document.getElementById('toast-container');
//     if (!container) {
//         container = document.createElement('div');
//         container.id = 'toast-container';
//         container.className = 'fixed top-5 right-5 space-y-2 z-50'; // Tailwind classes
//         document.body.appendChild(container);
//     }
//     return container;
// }
// function showDynamicToast(message, type = 'info') {
//     const container = createToastContainer();
//     const toast = document.createElement('div');
//     let bgColor = 'bg-blue-500';
//     if (type === 'success') bgColor = 'bg-green-500';
//     if (type === 'error') bgColor = 'bg-red-500';
//     toast.className = `${bgColor} text-white p-3 rounded shadow-lg`;
//     toast.textContent = message;
//     container.appendChild(toast);
//     setTimeout(() => {
//         toast.remove();
//     }, 3000);
// }
