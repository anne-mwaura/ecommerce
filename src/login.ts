interface User {
    username: string;
    password: string;
}

class LoginForm {
    private form: HTMLFormElement;
    private usernameInput: HTMLInputElement;
    private passwordInput: HTMLInputElement;

    constructor() {
        this.form = document.querySelector('form') as HTMLFormElement;
        this.usernameInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        this.passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;

        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            this.login();
        });
    }

    private async fetchUsers(): Promise<User[]> {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return response.json();
    }

    private async login(): Promise<void> {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        try {
            const users = await this.fetchUsers();

            const user = users.find((user: User) => user.username === username && user.password === password);

            if (user) {
                // User authenticated, redirect to index.html
                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error logging in. Please try again.');
        }
    }
}

// Instantiate the LoginForm class
document.addEventListener('DOMContentLoaded', () => {
    new LoginForm();
});
