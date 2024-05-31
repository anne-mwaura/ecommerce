interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity?: number; // Make quantity optional
}

class ProductPage {
    private productGrid: HTMLElement;
    private cartCountElement: HTMLElement;
    private addProductForm: HTMLFormElement;
    private orderButton: HTMLAnchorElement;
    private products: Product[] = [];
    private cart: Product[] = [];

    constructor() {
        this.productGrid = document.getElementById('product-grid')!;
        this.cartCountElement = document.getElementById('cart-count')!;
        this.addProductForm = document.getElementById('add-product-form') as HTMLFormElement;
        this.orderButton = document.querySelector('nav ul li:nth-child(5) a') as HTMLAnchorElement;
    }

    public async fetchProducts(): Promise<void> {
        try {
            const response = await fetch('http://localhost:3001/product');
            if (!response.ok) throw new Error('Failed to fetch products');
            this.products = await response.json() as Product[];
            this.renderProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    public async saveProduct(product: Product): Promise<void> {
        try {
            const response = await fetch('http://localhost:3001/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });

            if (!response.ok) throw new Error('Failed to add product');
            const newProduct = await response.json() as Product;
            this.products.push(newProduct);
            this.renderProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    }

    public async removeProduct(productId: number): Promise<void> {
        try {
            const response = await fetch(`http://localhost:3001/product/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to remove product');
            this.products = this.products.filter(product => product.id !== productId);
            this.renderProducts();
        } catch (error) {
            console.error('Error removing product:', error);
        }
    }

    private renderProducts(): void {
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
                <button class="remove-product" data-id="${product.id}">Remove</button>
            `;

            this.productGrid.appendChild(div);
        });

        this.attachEventListeners();
    }

    private attachEventListeners(): void {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const target = event.target as HTMLElement;
                const productId = parseInt(target.dataset.id!);
                this.addToCart(productId);
            });
        });

        const removeProductButtons = document.querySelectorAll('.remove-product');
        removeProductButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const target = event.target as HTMLElement;
                const productId = parseInt(target.dataset.id!);
                this.removeProduct(productId);
            });
        });
    }

    private addToCart(productId: number): void {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            const existingProductIndex = this.cart.findIndex(item => item.id === productId);
            if (existingProductIndex !== -1) {
                this.cart[existingProductIndex].quantity = (this.cart[existingProductIndex].quantity || 0) + 1;
            } else {
                const cartProduct = { ...product, quantity: 1 };
                this.cart.push(cartProduct);
            }
            localStorage.setItem('cart', JSON.stringify(this.cart));
            this.updateCartCount();
        }
    }

    private updateCartCount(): void {
        this.cartCountElement.textContent = this.cart.length.toString();
    }

    private initEventListeners(): void {
        this.addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = (document.getElementById('product-name') as HTMLInputElement).value;
            const price = parseFloat((document.getElementById('product-price') as HTMLInputElement).value);
            const imageUrl = (document.getElementById('product-image') as HTMLInputElement).value;

            const product = { id: Date.now(), name, price, imageUrl } as Product;

            await this.saveProduct(product);
            this.addProductForm.reset();
        });

        this.productGrid.addEventListener('click', e => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('add-to-cart')) {
                const id = parseInt(target.getAttribute('data-id')!, 10);
                this.addToCart(id);
                window.location.href = './cart.html';
            } else if (target.classList.contains('remove-product')) {
                const id = parseInt(target.getAttribute('data-id')!, 10);
                this.removeProduct(id);
            }
        });

        // Event listener for Order button
        this.orderButton.addEventListener('click', () => {
            window.location.href = './order.html';
        });
    }

    public async initialize(): Promise<void> {
        await this.fetchProducts();
        this.updateCartCount();
        this.initEventListeners();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const productPage = new ProductPage();
    await productPage.initialize();
});
