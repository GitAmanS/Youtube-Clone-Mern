import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser } from '../redux/authActions';

// Reusable Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

const SignInRegister = ({ isOpen, onClose }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleFileChange = (e) => setProfilePic(e.target.files[0]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    if (!isSignIn) {
      formData.append('username', username);
      if (profilePic) formData.append('avatar', profilePic);
    }

    if (isSignIn) {
      dispatch(loginUser({ email, password }));
      onClose()
    } else {
      dispatch(registerUser(formData));
      onClose()
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-4">{isSignIn ? 'Sign In' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isSignIn && (
          <>
            <input
              type="text"
              placeholder="Username"
              className="w-full border p-2 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="file"
              accept="image/*"
              className="w-full border p-2 rounded"
              onChange={handleFileChange}
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-red-500 text-white p-2 rounded">
          {isSignIn ? 'Sign In' : 'Register'}
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        {isSignIn ? (
          <>
            Don’t have an account?{' '}
            <button
              onClick={() => setIsSignIn(false)}
              className="text-blue-500 hover:underline"
            >
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setIsSignIn(true)}
              className="text-blue-500 hover:underline"
            >
              Sign In
            </button>
          </>
        )}
      </p>
      {auth.error && <p className="text-red-500 text-center mt-2">{auth.error}</p>}
    </Modal>
  );
};

export default SignInRegister;