interface OrderItem {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

class OrderPage {
    private orderItemsContainer: HTMLElement;
    private totalPriceElement: HTMLElement;
    private confirmOrderButton: HTMLButtonElement;

    constructor() {
        this.orderItemsContainer = document.getElementById('order-items') as HTMLElement;
        this.totalPriceElement = document.getElementById('total-price') as HTMLElement;
        this.confirmOrderButton = document.getElementById('confirm-order-button') as HTMLButtonElement;

        this.confirmOrderButton.addEventListener('click', () => this.confirmOrder());

        this.loadOrderItems();
    }

    private async fetchOrderItems(): Promise<OrderItem[]> {
        const response = await fetch('http://localhost:3000/cart');
        if (!response.ok) {
            throw new Error('Failed to fetch order items');
        }
        return response.json();
    }

    private renderOrderItems(orderItems: OrderItem[]): void {
        this.orderItemsContainer.innerHTML = '';
        let total = 0;
        orderItems.forEach(item => {
            const orderItemElement = document.createElement('div');
            orderItemElement.className = 'order-item';
            orderItemElement.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
            `;
            this.orderItemsContainer.appendChild(orderItemElement);
            total += item.price;
        });
        this.totalPriceElement.textContent = total.toFixed(2);
    }

    private async loadOrderItems(): Promise<void> {
        try {
            const orderItems = await this.fetchOrderItems();
            this.renderOrderItems(orderItems);
        } catch (error) {
            console.error('Error loading order items:', error);
        }
    }

    private async confirmOrder(): Promise<void> {
        try {
            const orderItems = await this.fetchOrderItems();
            const response = await fetch('http://localhost:3000/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderItems)
            });
            if (response.ok) {
                // Clear cart after order confirmation
                await fetch('http://localhost:3000/cart', {
                    method: 'DELETE'
                });
                alert('Order placed successfully!');
                window.location.href = 'index.html';
            } else {
                throw new Error('Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order. Please try again.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new OrderPage();
});
