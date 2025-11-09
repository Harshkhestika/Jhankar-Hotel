// Room prices
const roomPrices = {
    single: 2500,
    double: 4000,
    triple: 5500,
    dormitory: 1200
};

// Room names for display
const roomNames = {
    single: 'Single Bed Room',
    double: 'Double Bed Room',
    triple: 'Triple Bed Room',
    dormitory: 'Dormitory Bed'
};

// Initialize booking data
let bookingData = {
    rooms: {
        single: { quantity: 0, total: 0 },
        double: { quantity: 0, total: 0 },
        triple: { quantity: 0, total: 0 },
        dormitory: { quantity: 0, total: 0 }
    },
    dates: {
        checkIn: '',
        checkOut: '',
        nights: 0
    },
    totals: {
        roomTotal: 0,
        tax: 0,
        grandTotal: 0
    }
};

// DOM elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const scrollTopBtn = document.getElementById('scrollTop');
const stepIndicators = document.querySelectorAll('.step');
const stepContents = document.querySelectorAll('.step-content');
const roomQuantityInputs = document.querySelectorAll('.room-quantity');
const paymentMethods = document.querySelectorAll('.payment-method');
const nextToGuestBtn = document.getElementById('next-to-guest');
const backToRoomsBtn = document.getElementById('back-to-rooms');
const nextToReviewBtn = document.getElementById('next-to-review');
const backToGuestBtn = document.getElementById('back-to-guest');
const confirmBookingBtn = document.getElementById('confirm-booking');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');

// Set minimum date for check-in to today
const today = new Date().toISOString().split('T')[0];
checkInInput.min = today;

// Update check-out min date when check-in changes
checkInInput.addEventListener('change', function() {
    checkOutInput.min = this.value;
    if (checkOutInput.value && checkOutInput.value < this.value) {
        checkOutInput.value = '';
    }
    calculateNights();
    updateRoomTotals();
});

checkOutInput.addEventListener('change', function() {
    calculateNights();
    updateRoomTotals();
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', function() {
    mobileMenu.classList.toggle('hidden');
});

// Scroll to top button
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.remove('hidden');
    } else {
        scrollTopBtn.classList.add('hidden');
    }
});

scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Step navigation
function goToStep(stepNumber) {
    // Update step indicators
    stepIndicators.forEach(step => {
        const stepNum = parseInt(step.getAttribute('data-step'));
        step.classList.remove('active', 'completed');
        
        if (stepNum < stepNumber) {
            step.classList.add('completed');
        } else if (stepNum === stepNumber) {
            step.classList.add('active');
        }
    });
    
    // Update step contents
    stepContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `step-${stepNumber}`) {
            content.classList.add('active');
        }
    });
    
    // Scroll to top of step content
    document.getElementById(`step-${stepNumber}`).scrollIntoView({ behavior: 'smooth' });
}

nextToGuestBtn.addEventListener('click', function() {
    // Validate room selection
    const hasRooms = Object.values(bookingData.rooms).some(room => room.quantity > 0);
    if (!hasRooms) {
        alert('Please select at least one room to continue.');
        return;
    }
    
    // Validate dates
    if (!bookingData.dates.checkIn || !bookingData.dates.checkOut) {
        alert('Please select check-in and check-out dates.');
        return;
    }
    
    goToStep(2);
});

backToRoomsBtn.addEventListener('click', function() {
    goToStep(1);
});

nextToReviewBtn.addEventListener('click', function() {
    // Validate guest information
    const guestForm = document.querySelector('#step-2 form');
    if (guestForm) {
        const requiredFields = guestForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('border-red-500');
            } else {
                field.classList.remove('border-red-500');
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields.');
            return;
        }
    }
    
    goToStep(3);
    updateReviewSection();
});

backToGuestBtn.addEventListener('click', function() {
    goToStep(2);
});

// Room quantity controls
document.querySelectorAll('.increase-room').forEach(button => {
    button.addEventListener('click', function() {
        const roomType = this.getAttribute('data-room');
        const input = document.querySelector(`.room-quantity[data-room="${roomType}"]`);
        const max = parseInt(input.getAttribute('max'));
        
        if (parseInt(input.value) < max) {
            input.value = parseInt(input.value) + 1;
            updateRoomQuantity(roomType, parseInt(input.value));
        }
    });
});

document.querySelectorAll('.decrease-room').forEach(button => {
    button.addEventListener('click', function() {
        const roomType = this.getAttribute('data-room');
        const input = document.querySelector(`.room-quantity[data-room="${roomType}"]`);
        
        if (parseInt(input.value) > 0) {
            input.value = parseInt(input.value) - 1;
            updateRoomQuantity(roomType, parseInt(input.value));
        }
    });
});

// Payment method selection
paymentMethods.forEach(method => {
    method.addEventListener('click', function() {
        paymentMethods.forEach(m => {
            m.classList.remove('border-amber-600', 'bg-amber-50');
            m.classList.add('border-gray-300');
        });
        this.classList.remove('border-gray-300');
        this.classList.add('border-amber-600', 'bg-amber-50');
    });
});

// Update room quantity and totals
function updateRoomQuantity(roomType, quantity) {
    bookingData.rooms[roomType].quantity = quantity;
    bookingData.rooms[roomType].total = quantity * roomPrices[roomType] * bookingData.dates.nights;
    
    // Update individual room total display
    document.getElementById(`${roomType}-total`).textContent = bookingData.rooms[roomType].total.toLocaleString();
    
    updateRoomTotals();
}

// Calculate nights between check-in and check-out
function calculateNights() {
    if (checkInInput.value && checkOutInput.value) {
        const checkIn = new Date(checkInInput.value);
        const checkOut = new Date(checkOutInput.value);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (nights > 0) {
            bookingData.dates.nights = nights;
            bookingData.dates.checkIn = checkInInput.value;
            bookingData.dates.checkOut = checkOutInput.value;
            
            // Update all room totals with new nights value
            Object.keys(bookingData.rooms).forEach(roomType => {
                bookingData.rooms[roomType].total = bookingData.rooms[roomType].quantity * roomPrices[roomType] * nights;
                document.getElementById(`${roomType}-total`).textContent = bookingData.rooms[roomType].total.toLocaleString();
            });
            
            updateRoomTotals();
        } else {
            bookingData.dates.nights = 0;
            alert('Check-out date must be after check-in date.');
        }
    }
}

// Update room totals and summary
function updateRoomTotals() {
    let roomTotal = 0;
    let roomSummaryHTML = '';
    
    Object.keys(bookingData.rooms).forEach(roomType => {
        if (bookingData.rooms[roomType].quantity > 0) {
            roomTotal += bookingData.rooms[roomType].total;
            roomSummaryHTML += `
                <tr>
                    <td class="py-2">${roomNames[roomType]}</td>
                    <td class="py-2 text-center">${bookingData.rooms[roomType].quantity}</td>
                    <td class="py-2 text-right">₹${roomPrices[roomType].toLocaleString()}</td>
                    <td class="py-2 text-right">₹${bookingData.rooms[roomType].total.toLocaleString()}</td>
                </tr>
            `;
        }
    });
    
    if (roomSummaryHTML === '') {
        roomSummaryHTML = '<tr><td colspan="4" class="py-4 text-center text-gray-500">No rooms selected</td></tr>';
    }
    
    document.getElementById('room-summary').innerHTML = roomSummaryHTML;
    document.getElementById('room-total').textContent = roomTotal.toLocaleString();
    
    bookingData.totals.roomTotal = roomTotal;
    updateGrandTotal();
}

// Update grand total
function updateGrandTotal() {
    const roomTotal = bookingData.totals.roomTotal;
    const tax = roomTotal * 0.18; // 18% tax
    const grandTotal = roomTotal + tax;
    
    bookingData.totals.tax = tax;
    bookingData.totals.grandTotal = grandTotal;
    
    document.getElementById('final-amount').textContent = grandTotal.toLocaleString();
}

// Update review section
function updateReviewSection() {
    // Update stay dates
    if (bookingData.dates.checkIn && bookingData.dates.checkOut) {
        document.getElementById('review-stay-dates').textContent = 
            `Check-in: ${formatDate(bookingData.dates.checkIn)} | Check-out: ${formatDate(bookingData.dates.checkOut)}`;
        document.getElementById('review-nights').textContent = `Nights: ${bookingData.dates.nights}`;
    }
    
    // Update rooms
    let roomsHTML = '';
    Object.keys(bookingData.rooms).forEach(roomType => {
        if (bookingData.rooms[roomType].quantity > 0) {
            roomsHTML += `
                <div class="flex justify-between mb-1">
                    <span>${roomNames[roomType]} x ${bookingData.rooms[roomType].quantity}</span>
                    <span>₹${bookingData.rooms[roomType].total.toLocaleString()}</span>
                </div>
            `;
        }
    });
    document.getElementById('review-rooms').innerHTML = roomsHTML || '<p class="text-gray-500">No rooms selected</p>';
    
    // Update totals
    document.getElementById('review-room-total').textContent = bookingData.totals.roomTotal.toLocaleString();
    document.getElementById('review-tax').textContent = bookingData.totals.tax.toLocaleString();
    document.getElementById('review-grand-total').textContent = bookingData.totals.grandTotal.toLocaleString();
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Confirm booking
confirmBookingBtn.addEventListener('click', function() {
    // Validate payment information
    const cardNumber = document.querySelector('#step-3 input[placeholder="1234 5678 9012 3456"]');
    const expiryDate = document.querySelector('#step-3 input[placeholder="MM/YY"]');
    const cvv = document.querySelector('#step-3 input[placeholder="123"]');
    
    if (!cardNumber.value || !expiryDate.value || !cvv.value) {
        alert('Please fill in all payment details.');
        return;
    }
    
    // In a real application, you would process payment here
    const bookingId = generateBookingId();
    alert(`Thank you for your booking! Your reservation has been confirmed.\nBooking ID: ${bookingId}`);
    
    // Reset form and go to step 1
    resetBookingForm();
    goToStep(1);
});

// Generate random booking ID
function generateBookingId() {
    return 'AH' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Reset booking form
function resetBookingForm() {
    // Reset room quantities
    roomQuantityInputs.forEach(input => {
        input.value = 0;
        const roomType = input.getAttribute('data-room');
        updateRoomQuantity(roomType, 0);
    });
    
    // Reset dates
    checkInInput.value = '';
    checkOutInput.value = '';
    bookingData.dates = {
        checkIn: '',
        checkOut: '',
        nights: 0
    };
    
    // Reset guest form
    const guestForm = document.querySelector('#step-2');
    if (guestForm) {
        const inputs = guestForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('border-red-500');
        });
    }
    
    // Reset payment method
    paymentMethods.forEach(method => {
        method.classList.remove('border-amber-600', 'bg-amber-50');
        method.classList.add('border-gray-300');
    });
    
    // Reset payment form
    const paymentForm = document.querySelector('#step-3');
    if (paymentForm) {
        const inputs = paymentForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default check-in
    checkInInput.value = today;
    
    // Set tomorrow's date as default check-out
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    checkOutInput.value = tomorrow.toISOString().split('T')[0];
    
    // Calculate initial nights
    calculateNights();
});