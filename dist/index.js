"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Get elements from the DOM
const productForm = document.getElementById('product-form');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const productImageInput = document.getElementById('product-image');
const productGrid = document.getElementById('product-grid');
// Load products from local storage
function loadProducts() {
    const productsJson = localStorage.getItem('products');
    return productsJson ? JSON.parse(productsJson) : [];
}
// Save products to local storage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}
// Render products to the UI
function renderProducts() {
    const products = loadProducts();
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.dataset.id = product.id.toString();
        productDiv.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productGrid.appendChild(productDiv);
    });
    attachEventListeners();
}
// Add a new product
function addProduct(event) {
    event.preventDefault();
    const newProduct = {
        id: Date.now(),
        name: productNameInput.value,
        price: parseFloat(productPriceInput.value),
        imageUrl: productImageInput.value
    };
    const products = loadProducts();
    products.push(newProduct);
    saveProducts(products);
    renderProducts();
    productForm.reset();
}
// Attach event listeners to buttons after rendering
function attachEventListeners() {
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const target = event.target;
            const productId = parseInt(target.dataset.id);
            addToCart(productId);
        });
    });
}
// Add product to cart
function addToCart(productId) {
    const products = loadProducts();
    const product = products.find(p => p.id === productId);
    if (product) {
        let cart = loadCart();
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 0) + 1;
        }
        else {
            const cartProduct = Object.assign(Object.assign({}, product), { quantity: 1 });
            cart.push(cartProduct);
        }
        saveCart(cart);
        updateCartCount();
    }
}
// Load cart from local storage
function loadCart() {
    const cartJson = localStorage.getItem('cart');
    return cartJson ? JSON.parse(cartJson) : [];
}
// Save cart to local storage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
// Update cart count
function updateCartCount() {
    const cart = loadCart();
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = cart.length.toString();
}
// Event listener for form submission
productForm.addEventListener('submit', addProduct);
// Initial render of products
renderProducts();
updateCartCount();
// Class to handle product operations including cart functionality
class SignupPage {
    constructor() {
        this.products = [];
        this.cart = [];
        this.productGrid = document.getElementById('product-grid');
        this.cartCountElement = document.getElementById('cart-count');
        this.addProductForm = document.getElementById('add-product-form');
        this.orderButton = document.querySelector('nav ul li:nth-child(5) a');
        this.initialize();
    }
    fetchProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('http://localhost:3001/product');
                if (!response.ok)
                    throw new Error('Failed to fetch products');
                this.products = (yield response.json());
                this.renderProducts();
            }
            catch (error) {
                console.error('Error fetching products:', error);
            }
        });
    }
    saveProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('http://localhost:3001/product', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                });
                if (!response.ok)
                    throw new Error('Failed to add product');
                const newProduct = yield response.json();
                this.products.push(newProduct);
                this.renderProducts();
            }
            catch (error) {
                console.error('Error saving product:', error);
            }
        });
    }
    renderProducts() {
        this.productGrid.innerHTML = '';
        this.products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product';
            div.dataset.id = product.id.toString();
            div.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;
            this.productGrid.appendChild(div);
        });
        this.attachEventListeners();
    }
    attachEventListeners() {
        const buttons = document.querySelectorAll('.add-to-cart');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const target = event.target;
                const productId = parseInt(target.dataset.id);
                this.addToCart(productId);
            });
        });
    }
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            const existingProductIndex = this.cart.findIndex(item => item.id === productId);
            if (existingProductIndex !== -1) {
                this.cart[existingProductIndex].quantity = (this.cart[existingProductIndex].quantity || 0) + 1;
            }
            else {
                const cartProduct = Object.assign(Object.assign({}, product), { quantity: 1 });
                this.cart.push(cartProduct);
            }
            localStorage.setItem('cart', JSON.stringify(this.cart));
            this.updateCartCount();
        }
    }
    updateCartCount() {
        this.cartCountElement.textContent = this.cart.length.toString();
    }
    initEventListeners() {
        this.addProductForm.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const name = document.getElementById('product-name').value;
            const price = parseFloat(document.getElementById('product-price').value);
            const imageUrl = document.getElementById('product-image').value;
            const product = { id: Date.now(), name, price, imageUrl };
            yield this.saveProduct(product);
            this.addProductForm.reset();
        }));
        this.productGrid.addEventListener('click', e => {
            if (e.target.classList.contains('add-to-cart')) {
                const id = parseInt(e.target.getAttribute('data-id'), 10);
                const product = this.products.find(product => product.id === id);
                if (product) {
                    this.addToCart(product.id);
                    window.location.href = './cart.html';
                }
            }
        });
        // Event listener for Order button
        this.orderButton.addEventListener('click', () => {
            window.location.href = './order.html';
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fetchProducts();
            this.updateCartCount();
            this.initEventListeners();
        });
    }
}
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const signupPage = new SignupPage();
    yield signupPage.initialize();
}));
