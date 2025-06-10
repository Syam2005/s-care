const CartManager = {
    getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch (e) {
            console.error('Error loading cart:', e);
            return [];
        }
    },

    saveCart(cart) {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            this.updateCartUI();
        } catch (e) {
            console.error('Error saving cart:', e);
        }
    },

    addToCart(button) {
        try {
            const productCard = button.closest('.product-card');
            if (!productCard) {
                console.error('Product card not found');
                return;
            }

            const product = {
                name: productCard.querySelector('h3').textContent,
                description: productCard.querySelector('p').textContent,
                price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '')),
                image: productCard.querySelector('img').src,
                quantity: 1
            };

            const cart = this.getCart();
            const existingItem = cart.find(item => item.name === product.name);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push(product);
            }
            
            this.saveCart(cart);
            this.showNotification('Product added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Failed to add item to cart', 'error');
        }
    },

    removeItem(index) {
        const cart = this.getCart();
        cart.splice(index, 1);
        this.saveCart(cart);
        this.showNotification('Item removed from cart');
    },

    updateQuantity(index, change) {
        const cart = this.getCart();
        if (cart[index]) {
            cart[index].quantity = Math.max(1, cart[index].quantity + change);
            this.saveCart(cart);
        }
    },

    calculateTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        });

        setTimeout(() => {
            notification.style.transform = 'translateY(-100%)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const subtotalElement = document.getElementById('subtotal');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');
        
        const cart = this.getCart();
        this.updateCartCount(cart.length);

        if (!cartItems) return; // Only proceed with detailed UI if on cart page

        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center;">Your cart is empty</p>';
            [subtotalElement, taxElement, totalElement].forEach(el => {
                if (el) el.textContent = '0.00';
            });
            return;
        }

        const fragment = document.createDocumentFragment();
        
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${item.description || ''}</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
                </div>
                <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-btn" data-index="${index}">×</button>
            `;
            fragment.appendChild(itemDiv);
        });

        cartItems.innerHTML = '';
        cartItems.appendChild(fragment);

        const subtotal = this.calculateTotal();
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2);
        if (taxElement) taxElement.textContent = tax.toFixed(2);
        if (totalElement) totalElement.textContent = total.toFixed(2);
    },

    updateCartCount(count) {
        const cartLinks = document.querySelectorAll('.cart-link');
        cartLinks.forEach(link => {
            link.textContent = `🛒 Cart (${count})`;
        });
    }
};

// Global function for onclick handlers
function addToCart(button) {
    CartManager.addToCart(button);
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    // Remove the line that clears localStorage
    // localStorage.removeItem('cart');

    // Add click event listeners to all add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.removeAttribute('onclick'); // Remove inline onclick
        button.addEventListener('click', () => CartManager.addToCart(button));
    });

    CartManager.updateCartUI();
});