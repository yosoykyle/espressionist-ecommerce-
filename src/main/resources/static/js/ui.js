// src/main/resources/static/js/ui.js

/**
 * Displays a custom modal dialog.
 * @param {string} title - The title of the modal.
 * @param {string} message - The message content of the modal.
 * @param {function} [onConfirm] - Callback function to execute when the confirm button is clicked.
 * @param {function} [onCancel] - Callback function to execute when the cancel button is clicked or modal is dismissed.
 */
function showModal(title, message, onConfirm, onCancel) {
    // Remove any existing modal first
    const existingModal = document.getElementById('customModalBackdrop');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'customModalBackdrop';
    backdrop.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-[90] p-4 transition-opacity duration-300 ease-in-out'; // z-index lower than toast

    // Create modal panel
    const panel = document.createElement('div');
    panel.id = 'customModalPanel';
    panel.className = 'bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto transform transition-all duration-300 ease-in-out scale-95 opacity-0';
    
    // Modal Title
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
    
    // Append elements
    buttonsDiv.appendChild(cancelBtn);
    buttonsDiv.appendChild(confirmBtn);
    panel.appendChild(modalTitle);
    panel.appendChild(modalMessage);
    panel.appendChild(buttonsDiv);
    backdrop.appendChild(panel);
    document.body.appendChild(backdrop);

    // Trigger fade-in and scale-up animation
    requestAnimationFrame(() => {
        backdrop.style.opacity = '1';
        panel.style.opacity = '1';
        panel.style.transform = 'scale(1)';
    });
    
    confirmBtn.focus(); // Set focus to confirm button

    // Function to close and remove modal
    const closeModal = (callback) => {
        backdrop.style.opacity = '0';
        panel.style.opacity = '0';
        panel.style.transform = 'scale(0.95)';
        setTimeout(() => {
            backdrop.remove();
            if (callback) callback();
        }, 300); // Duration of fade-out
    };

    // Event Listeners
    confirmBtn.addEventListener('click', () => closeModal(onConfirm));
    cancelBtn.addEventListener('click', () => closeModal(onCancel));
    backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) { // Only if backdrop itself is clicked
            closeModal(onCancel);
        }
    });
    
    // ESC key to close
    const handleEsc = (event) => {
        if (event.key === 'Escape') {
            closeModal(onCancel);
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}


/**
 * Displays a toast notification.
 * @param {string} message - The message to display in the toast.
 * @param {'info' | 'success' | 'error'} [type='info'] - The type of toast (info, success, error).
 * @param {number} [duration=3000] - The duration in milliseconds for the toast to be visible.
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) {
        console.error('Toast container not found! Make sure to add <div id="toast-container" class="..."></div> to your layout.');
        // Fallback to alert if container is missing
        alert(`(${type}): ${message}`);
        return;
    }

    const toast = document.createElement('div');
    toast.className = 'toast-item text-white p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform translate-x-full opacity-0 mb-2'; // Start off-screen and transparent
    toast.setAttribute('role', 'alert');
    toast.textContent = message;

    // Apply type-specific styling
    switch (type) {
        case 'success':
            toast.classList.add('bg-green-600'); // Darker green for better contrast
            break;
        case 'error':
            toast.classList.add('bg-red-600');   // Darker red
            break;
        case 'info':
        default:
            toast.classList.add('bg-blue-600');  // Darker blue
            break;
    }

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    });


    // Animate out and remove
    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('opacity-0'); // Fade out
        // Optional: Could add a slide-out effect too: toast.classList.add('translate-x-full');
        
        // Remove the element after the animation
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
        // Fallback removal if transitionend doesn't fire (e.g. if display:none is applied by other CSS)
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 500); // Should be longer than transition duration

    }, duration);
}
