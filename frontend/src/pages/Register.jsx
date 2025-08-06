import React, { useState } from 'react';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('https://congenial-yodel-r99946p676x359p-5000.app.github.dev/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>
      <input
        className="block w-full mb-2 p-2 border rounded"
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
      />
      <input
        className="block w-full mb-2 p-2 border rounded"
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Register</button>
      {message && <p className="mt-2">{message}</p>}
    </form>
  );
};

export default Register;