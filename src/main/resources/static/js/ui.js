// src/main/resources/static/js/ui.js

/**
 * Displays a custom modal dialog.
 * @param {string} title - The title of the modal.
 * @param {string} message - The message content of the modal.
 * @param {function} [onConfirm] - Callback function to execute when the confirm button is clicked.
 * @param {function} [onCancel] - Callback function to execute when the cancel button is clicked or modal is dismissed.
 */
function showModal(title, message, onConfirm, onCancel) {
    // Remove any existing modal first to prevent duplicates.
    const existingModal = document.getElementById('customModalBackdrop');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal backdrop: Covers the entire screen with a semi-transparent background.
    const backdrop = document.createElement('div');
    backdrop.id = 'customModalBackdrop';
    // Tailwind classes for styling: fixed position, full screen, background color/opacity, flex centering.
    // z-[90] ensures it's above most content but below toasts (z-[100]).
    // transition-opacity and duration-300 for fade-in effect.
    backdrop.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-[90] p-4 transition-opacity duration-300 ease-in-out';

    // Create modal panel: The main dialog box.
    const panel = document.createElement('div');
    panel.id = 'customModalPanel';
    // Tailwind classes: white background, rounded corners, shadow, padding, responsive width, centered.
    // transform, transition-all, duration-300, scale-95, opacity-0 for entry animation (popup and fade-in).
    panel.className = 'bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto transform transition-all duration-300 ease-in-out scale-95 opacity-0';
    
    // Modal Title element
    const modalTitle = document.createElement('h3');
    modalTitle.id = 'customModalTitle';
    modalTitle.className = 'text-xl font-semibold mb-4 text-gray-800';
    modalTitle.textContent = title;

    // Modal Message
    const modalMessage = document.createElement('p');
    modalMessage.id = 'customModalMessage';
    modalMessage.className = 'mb-6 text-gray-700';
    modalMessage.textContent = message;

    // Buttons container
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'flex justify-end space-x-3';

    // Cancel Button
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'customModalCancelBtn';
    cancelBtn.className = 'px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400';
    cancelBtn.textContent = 'Cancel';

    // Confirm Button
    const confirmBtn = document.createElement('button');
    confirmBtn.id = 'customModalConfirmBtn';
    confirmBtn.className = 'px-4 py-2 bg-[#F56401] text-white rounded-md hover:bg-orange-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-400';
    confirmBtn.textContent = 'Confirm';
    
    // Assemble the modal structure
    buttonsDiv.appendChild(cancelBtn);
    buttonsDiv.appendChild(confirmBtn);
    panel.appendChild(modalTitle);
    panel.appendChild(modalMessage);
    panel.appendChild(buttonsDiv);
    backdrop.appendChild(panel);
    document.body.appendChild(backdrop); // Add the modal to the page

    // Trigger fade-in and scale-up animation for the modal panel using requestAnimationFrame for smoother rendering.
    requestAnimationFrame(() => {
        backdrop.style.opacity = '1'; // Fade in backdrop
        panel.style.opacity = '1';    // Fade in panel
        panel.style.transform = 'scale(1)'; // Scale panel to full size
    });
    
    // Automatically focus the confirm button for better accessibility and user experience.
    confirmBtn.focus();

    // Defines how the modal is closed and removed, including animations.
    const closeModal = (callback) => {
        // Start fade-out and scale-down animation
        backdrop.style.opacity = '0';
        panel.style.opacity = '0';
        panel.style.transform = 'scale(0.95)';
        // Remove the modal from DOM after the animation (300ms)
        setTimeout(() => {
            backdrop.remove();
            if (callback) callback(); // Execute the provided callback (onConfirm or onCancel)
        }, 300); 
    };

    // Attach event listeners to buttons
    confirmBtn.addEventListener('click', () => closeModal(onConfirm));
    cancelBtn.addEventListener('click', () => closeModal(onCancel));
    // Allow closing the modal by clicking on the backdrop (outside the panel)
    backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) { 
            closeModal(onCancel);
        }
    });
    
    // Allow closing the modal by pressing the Escape key
    const handleEsc = (event) => {
        if (event.key === 'Escape') {
            closeModal(onCancel);
            document.removeEventListener('keydown', handleEsc); // Clean up listener after use
        }
    };
    document.addEventListener('keydown', handleEsc); // Add listener for ESC key
}


/**
 * Displays a toast notification.
 * @param {string} message - The message to display in the toast.
 * @param {'info' | 'success' | 'error'} [type='info'] - The type of toast (info, success, error).
 * @param {number} [duration=3000] - The duration in milliseconds for the toast to be visible.
 */
function showToast(message, type = 'info', duration = 3000) {
    // Get the toast container element. Toasts will be appended here.
    const container = document.getElementById('toast-container');
    // If container doesn't exist, log an error and fallback to a simple alert.
    if (!container) {
        console.error('Toast container not found! Make sure to add <div id="toast-container" class="..."></div> to your layout.');
        alert(`(${type}): ${message}`); // Fallback notification
        return;
    }

    // Create the toast element
    const toast = document.createElement('div');
    // Base styling for the toast: common appearance and initial animation state (off-screen and transparent).
    toast.className = 'toast-item text-white p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform translate-x-full opacity-0 mb-2'; 
    toast.setAttribute('role', 'alert'); // Accessibility attribute
    toast.textContent = message; // Set the toast message

    // Apply type-specific background colors for different toast types.
    switch (type) {
        case 'success':
            toast.classList.add('bg-green-600'); 
            break;
        case 'error':
            toast.classList.add('bg-red-600');   
            break;
        case 'info':
        default:
            toast.classList.add('bg-blue-600');  
            break;
    }

    // Add the toast to the container.
    container.appendChild(toast);

    // Animate the toast into view.
    // requestAnimationFrame ensures the initial (off-screen) state is rendered before starting the transition.
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0'); // Remove initial off-screen/transparent classes
        toast.classList.add('translate-x-0', 'opacity-100');     // Add classes to slide in and fade in
    });


    // Set a timeout to automatically remove the toast after the specified duration.
    setTimeout(() => {
        // Start fade-out animation.
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('opacity-0'); 
        // Optional: Could add a slide-out effect too: toast.classList.add('translate-x-full');
        
        // Remove the toast element from the DOM after its fade-out transition completes.
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
        // Fallback removal: If 'transitionend' doesn't fire for some reason (e.g., CSS conflict),
        // remove the toast after a slightly longer delay than the transition.
        setTimeout(() => {
            if (toast.parentElement) { // Check if it hasn't been removed already
                toast.remove();
            }
        }, 500); // This duration should be greater than the CSS transition duration (300ms).

    }, duration);
}
