const form     = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.classList.remove('show');
  loginBtn.textContent = 'Signing in...';
  loginBtn.disabled = true;

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      window.location.href = 'admin-dashboard.html';
    } else {
      errorMsg.textContent = 'Invalid email or password.';
      errorMsg.classList.add('show');
      loginBtn.textContent = 'Sign In to Dashboard';
      loginBtn.disabled = false;
    }
  } catch (err) {
    errorMsg.textContent = 'Server se connect nahi ho saka.';
    errorMsg.classList.add('show');
    loginBtn.textContent = 'Sign In to Dashboard';
    loginBtn.disabled = false;
  }
});
