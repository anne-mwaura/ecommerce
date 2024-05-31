interface User {
    username: string;
    email: string;
    password: string;
}

class SignupPage {
    constructor() {
        // Constructor logic here
    }

    async signUp(newUser: User): Promise<void> {
        try {
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                alert('User created successfully!');
                // Redirect to index.html after successful sign up
                window.location.href = 'index.html';
            } else {
                throw new Error('Failed to create user');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating user. Please try again.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form') as HTMLFormElement;
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const newUser: User = {
            username,
            email,
            password
        };

        const signupPage = new SignupPage();
        await signupPage.signUp(newUser);
    });
});
