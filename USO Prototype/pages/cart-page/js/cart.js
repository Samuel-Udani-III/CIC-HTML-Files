// Cart state management
let cartItems = [
    {
        id: 1,
        name: "DTF ink / DTG or PET super color bottle 100ml any print textile",
        price: 150,
        quantity: 1,
        currency: "AED"
    },
    {
        id: 2,
        name: "Teflon Mat Heat Press, non-stick sheet, transfers sheet liner",
        price: 50,
        quantity: 1,
        currency: "AED"
    }
];

let activeVoucher = null;
const SHIPPING_FEE = 0;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    setupEventListeners();
});

function setupEventListeners() {
    // Quantity controls
    document.querySelectorAll('.quantity-controls').forEach(control => {
        const itemId = parseInt(control.closest('.table-row').dataset.itemId);
        
        control.querySelector('.increment').addEventListener('click', () => {
            updateQuantity(itemId, 1);
        });
        
        control.querySelector('.decrement').addEventListener('click', () => {
            updateQuantity(itemId, -1);
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.closest('.table-row').dataset.itemId);
            removeItem(itemId);
        });
    });

    // Voucher code
    const voucherButton = document.querySelector('.voucher-input button');
    if (voucherButton) {
        voucherButton.addEventListener('click', applyVoucher);
    }

    // Checkout button
    const checkoutButton = document.querySelector('.checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
}

function updateQuantity(itemId, change) {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity >= 1) {
            item.quantity = newQuantity;
            updateCartDisplay();
        }
    }
}

function removeItem(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    updateCartDisplay();
    updateHeaderCartCount();
}

function updateCartDisplay() {
    // Update cart items display
    const cartTable = document.querySelector('.cart-table');
    if (!cartTable) return;

    const tableRows = cartTable.querySelectorAll('.table-row');
    tableRows.forEach(row => {
        const itemId = parseInt(row.dataset.itemId);
        const item = cartItems.find(i => i.id === itemId);
        if (item) {
            row.querySelector('.quantity-controls span').textContent = item.quantity;
            row.querySelector('span:nth-child(4)').textContent = `${item.price * item.quantity} ${item.currency}`;
        }
    });

    // Update summary
    updateSummary();
}

function updateSummary() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;

    if (activeVoucher) {
        discount = calculateDiscount(subtotal);
    }

    const total = subtotal - discount + SHIPPING_FEE;

    // Update DOM
    document.querySelector('.summary-item:nth-child(2) span:last-child').textContent = `${subtotal} AED`;
    document.querySelector('.summary-item.total span:last-child').textContent = `${total} AED`;
}

function calculateDiscount(subtotal) {
    if (!activeVoucher) return 0;
    
    // Implement voucher logic here
    switch(activeVoucher.type) {
        case 'percentage':
            return subtotal * (activeVoucher.value / 100);
        case 'fixed':
            return activeVoucher.value;
        default:
            return 0;
    }
}

function applyVoucher() {
    const voucherInput = document.querySelector('.voucher-input input');
    const voucherCode = voucherInput.value.trim().toUpperCase();
    
    // Example voucher validation
    const vouchers = {
        'WELCOME10': { type: 'percentage', value: 10 },
        'SAVE20': { type: 'fixed', value: 20 }
    };

    if (vouchers[voucherCode]) {
        activeVoucher = vouchers[voucherCode];
        updateSummary();
        alert('Voucher applied successfully!');
    } else {
        alert('Invalid voucher code');
    }
}

function handleCheckout() {
    // Validate cart is not empty
    if (cartItems.length === 0) {
        alert('Your cart is empty');
        return;
    }

    // Here you would typically:
    // 1. Validate user is logged in
    // 2. Collect shipping information
    // 3. Process payment
    // 4. Create order
    
    // For now, we'll just show a success message
    alert('Proceeding to checkout...');
    // window.location.href = '/checkout'; // Uncomment when checkout page is ready
}

function updateHeaderCartCount() {
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounter = document.getElementById('cartCounter');
    if (cartCounter) {
        cartCounter.textContent = cartCount;
        cartCounter.style.display = cartCount > 0 ? 'flex' : 'none';
    }
} 