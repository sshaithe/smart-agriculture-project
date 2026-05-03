import React from 'react';
import LoginTemplate from '../components/atomic_design/template/LoginTemplate';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const handleLogin = (email, password) => {
    // Giriş işlemi burada yapılacak
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <section className="bg-transparent min-h-screen flex items-center justify-center">
      <LoginTemplate onClick={handleRegisterRedirect} />
    </section>
  );
};
export default SignIn;