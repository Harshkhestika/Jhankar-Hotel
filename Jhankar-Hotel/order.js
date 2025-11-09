// Food prices
const foodPrices = {
    'breakfast-continental': 450,
    'breakfast-indian': 350,
    'breakfast-english': 550,
    'lunch-veg-thali': 600,
    'lunch-nonveg-thali': 800,
    'lunch-rajasthani': 750,
    'dinner-veg-buffet': 700,
    'dinner-nonveg-buffet': 900,
    'dinner-bbq': 1200
};

// Food names for display
const foodNames = {
    'breakfast-continental': 'Continental Breakfast',
    'breakfast-indian': 'Indian Breakfast',
    'breakfast-english': 'English Breakfast',
    'lunch-veg-thali': 'Vegetarian Thali',
    'lunch-nonveg-thali': 'Non-Vegetarian Thali',
    'lunch-rajasthani': 'Rajasthani Special',
    'dinner-veg-buffet': 'Vegetarian Buffet',
    'dinner-nonveg-buffet': 'Non-Vegetarian Buffet',
    'dinner-bbq': 'BBQ Night Special'
};

// Initialize order data
let orderData = {
    roomNumber: '',
    guestName: '',
    specialInstructions: '',
    items: {},
    totals: {
        foodTotal: 0,
        serviceCharge: 0,
        grandTotal: 0
    }
};

// DOM elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const scrollTopBtn = document.getElementById('scrollTop');
const foodCategoryHeaders = document.querySelectorAll('.food-category-header');
const foodQuantityInputs = document.querySelectorAll('.food-quantity');
const placeOrderBtn = document.getElementById('place-order');
const roomNumberInput = document.getElementById('roomNumber');
const guestNameInput = document.getElementById('guestName');
const specialInstructionsInput = document.getElementById('specialInstructions');

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

// Food category toggle
foodCategoryHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const category = this.parentElement;
        category.classList.toggle('active');
        
        const icon = this.querySelector('i');
        if (category.classList.contains('active')) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    });
});

// Food quantity controls
document.querySelectorAll('.increase-food').forEach(button => {
    button.addEventListener('click', function() {
        const foodId = this.getAttribute('data-food');
        const input = document.querySelector(`.food-quantity[data-food="${foodId}"]`);
        
        input.value = parseInt(input.value) + 1;
        updateFoodQuantity(foodId, parseInt(input.value));
    });
});

document.querySelectorAll('.decrease-food').forEach(button => {
    button.addEventListener('click', function() {
        const foodId = this.getAttribute('data-food');
        const input = document.querySelector(`.food-quantity[data-food="${foodId}"]`);
        
        if (parseInt(input.value) > 0) {
            input.value = parseInt(input.value) - 1;
            updateFoodQuantity(foodId, parseInt(input.value));
        }
    });
});

// Update food quantity and totals
function updateFoodQuantity(foodId, quantity) {
    if (quantity === 0) {
        delete orderData.items[foodId];
    } else {
        orderData.items[foodId] = {
            quantity: quantity,
            total: quantity * foodPrices[foodId]
        };
    }
    
    updateFoodTotals();
}

// Update food totals and summary
function updateFoodTotals() {
    let foodTotal = 0;
    let foodSummaryHTML = '';
    
    Object.keys(orderData.items).forEach(foodId => {
        if (orderData.items[foodId].quantity > 0) {
            foodTotal += orderData.items[foodId].total;
            foodSummaryHTML += `
                <tr>
                    <td class="py-2">${foodNames[foodId]}</td>
                    <td class="py-2 text-center">${orderData.items[foodId].quantity}</td>
                    <td class="py-2 text-right">₹${foodPrices[foodId].toLocaleString()}</td>
                    <td class="py-2 text-right">₹${orderData.items[foodId].total.toLocaleString()}</td>
                </tr>
            `;
        }
    });
    
    if (foodSummaryHTML === '') {
        foodSummaryHTML = '<tr><td colspan="4" class="py-4 text-center text-gray-500">No items selected</td></tr>';
    }
    
    document.getElementById('food-summary').innerHTML = foodSummaryHTML;
    document.getElementById('food-total').textContent = foodTotal.toLocaleString();
    
    // Calculate service charge (5%)
    const serviceCharge = foodTotal * 0.05;
    const grandTotal = foodTotal + serviceCharge;
    
    document.getElementById('service-charge').textContent = serviceCharge.toLocaleString();
    document.getElementById('grand-total').textContent = grandTotal.toLocaleString();
    
    orderData.totals.foodTotal = foodTotal;
    orderData.totals.serviceCharge = serviceCharge;
    orderData.totals.grandTotal = grandTotal;
}

// Place order
placeOrderBtn.addEventListener('click', function() {
    // Validate room number and guest name
    if (!roomNumberInput.value.trim()) {
        alert('Please enter your room number.');
        roomNumberInput.focus();
        return;
    }
    
    if (!guestNameInput.value.trim()) {
        alert('Please enter your name.');
        guestNameInput.focus();
        return;
    }
    
    // Validate that at least one item is selected
    if (Object.keys(orderData.items).length === 0) {
        alert('Please select at least one food item.');
        return;
    }
    
    // Update order data
    orderData.roomNumber = roomNumberInput.value.trim();
    orderData.guestName = guestNameInput.value.trim();
    orderData.specialInstructions = specialInstructionsInput.value.trim();
    
    // Show confirmation
    showOrderConfirmation();
});

// Show order confirmation
function showOrderConfirmation() {
    const orderId = generateOrderId();
    const estimatedTime = Math.floor(Math.random() * 30) + 20; // 20-50 minutes
    
    const confirmationHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div class="text-center">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check text-green-600 text-2xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h3>
                    <p class="text-gray-600 mb-4">Your food order has been placed successfully.</p>
                    
                    <div class="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                        <div class="flex justify-between mb-2">
                            <span class="font-semibold">Order ID:</span>
                            <span class="text-amber-600">${orderId}</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span class="font-semibold">Room Number:</span>
                            <span>${orderData.roomNumber}</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span class="font-semibold">Guest Name:</span>
                            <span>${orderData.guestName}</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span class="font-semibold">Estimated Delivery:</span>
                            <span>${estimatedTime} minutes</span>
                        </div>
                        <div class="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
                            <span>Total Amount:</span>
                            <span class="text-amber-600">₹${orderData.totals.grandTotal.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <p class="text-sm text-gray-500 mb-4">
                        <i class="fas fa-info-circle mr-1"></i>
                        Your order will be delivered to room ${orderData.roomNumber}. Amount will be charged to your room bill.
                    </p>
                    
                    <button id="close-confirmation" class="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition">
                        Continue Ordering
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', confirmationHTML);
    
    // Add event listener to close button
    document.getElementById('close-confirmation').addEventListener('click', function() {
        document.querySelector('.fixed.inset-0').remove();
    });
}

// Generate random order ID
function generateOrderId() {
    return 'FOOD' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Open first food category by default
    if (foodCategoryHeaders.length > 0) {
        foodCategoryHeaders[0].click();
    }
    
    // Add input validation
    roomNumberInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});