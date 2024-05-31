interface CartItem {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

class Cart {
    private cartItemsContainer: HTMLElement;
    private orderButton: HTMLButtonElement;

    constructor() {
        this.cartItemsContainer = document.getElementById('cart-items') as HTMLElement;
        this.orderButton = document.getElementById('order-button') as HTMLButtonElement;

        this.orderButton.addEventListener('click', () => {
            this.navigateToOrderPage();
        });

        this.loadCartItems();
    }

    private async fetchCartItems(): Promise<CartItem[]> {
        const response = await fetch('http://localhost:3000/cart');
        if (!response.ok) {
            throw new Error('Failed to fetch cart items');
        }
        return response.json();
    }

    private renderCartItems(cartItems: CartItem[]): void {
        this.cartItemsContainer.innerHTML = '';
        cartItems.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
                <button data-id="${item.id}">Remove</button>
            `;
            this.cartItemsContainer.appendChild(cartItemElement);

            const removeButton = cartItemElement.querySelector('button')!;
            removeButton.addEventListener('click', async () => {
                await this.removeCartItem(item.id);
                this.loadCartItems();
            });
        });
    }

    private async removeCartItem(id: number): Promise<void> {
        const response = await fetch(`http://localhost:3000/cart/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to remove cart item');
        }
    }

    private async loadCartItems(): Promise<void> {
        try {
            const cartItems = await this.fetchCartItems();
            this.renderCartItems(cartItems);
        } catch (error) {
            console.error('Error loading cart items:', error);
        }
    }

    private navigateToOrderPage(): void {
        window.location.href = 'order.html';
    }
}

// Instantiate the Cart class
document.addEventListener('DOMContentLoaded', () => {
    new Cart();
});
