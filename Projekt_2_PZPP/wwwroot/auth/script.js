const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const authForm = document.getElementById('authForm');
const emailGroup = document.getElementById('emailGroup');
const submitBtn = document.getElementById('submitBtn');
const messageDiv = document.getElementById('message');

let isLogin = true;

loginTab.addEventListener('click', () => {
    isLogin = true;
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    emailGroup.style.display = 'none';
    submitBtn.textContent = 'Log in';
    messageDiv.textContent = '';
});

registerTab.addEventListener('click', () => {
    isLogin = false;
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    emailGroup.style.display = 'block';
    submitBtn.textContent = 'Register';
    messageDiv.textContent = '';
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value.trim();

    const payload = {
        username,
        password,
        ...(isLogin ? {} : { email }),
    };

    const endpoint = isLogin ? '/api/user/login' : '/api/user/register';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            messageDiv.style.color = 'red';
            messageDiv.textContent = data.message || (isLogin ? 'Login failed.' : 'Registration failed.');
            return;
        }

        messageDiv.style.color = 'green';
        messageDiv.textContent = isLogin ? 'Logged in successfully!' : 'Registered successfully!';

        if (isLogin) {
        
            localStorage.setItem('token', data.token);

          
            const base64Payload = data.token.split('.')[1];
            const payloadJson = atob(base64Payload);
            const payloadData = JSON.parse(payloadJson);

         
            localStorage.setItem('userId', payloadData.nameid || payloadData.sub);
            localStorage.setItem('username', payloadData.unique_name || payloadData.name);


            setTimeout(() => {
                window.location.href = '/home/index.html';
            }, 1000);
        } else {
            setTimeout(() => {
                window.location.href = '/auth/index.html';
            }, 1000);
        }
    } catch (err) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Something went wrong. Please try again.';
    }
});
