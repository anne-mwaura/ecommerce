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
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    form.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        try {
            const response = yield fetch('http://localhost:3000/users');
            const users = yield response.json();
            const user = users.find((user) => user.username === username && user.password === password);
            if (user) {
                // User authenticated, redirect to index.html
                window.location.href = 'index.html';
            }
            else {
                alert('Invalid username or password');
            }
        }
        catch (error) {
            console.error('Error:', error);
            alert('Error logging in. Please try again.');
        }
    }));
});
