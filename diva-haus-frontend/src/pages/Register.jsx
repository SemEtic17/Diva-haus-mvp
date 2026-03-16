import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { registerUser } from '../api';
import { toast } from '../components/Toaster'; 
import { useTranslation } from 'react-i18next';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error(t('auth.passwords_not_match', 'Passwords do not match')); 
    } else {
      try {
        await registerUser({ name, email, password });
        toast.success(t('auth.registration_success', 'Registration successful! Please login.'));
        navigate('/login');
      } catch (error) {
        toast.error(error.message || t('auth.registration_failed', 'Failed to register')); 
      }
    }
  };

  return (
    <div className="container mx-auto p-4 mt-10">
      <h1 className="text-2xl font-bold mb-4">{t('auth.register_title')}</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">{t('auth.name')}</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded text-gray-800"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">{t('auth.email')}</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded text-gray-800"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">{t('auth.password')}</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded text-gray-800"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">{t('auth.confirm_password')}</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded text-gray-800"
            name="password2"
            value={password2}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {t('auth.register_button')}
        </button>
      </form>
      <p className="mt-4">
        {t('auth.have_account')} <Link to="/login" className="text-blue-500">{t('auth.login_title')}</Link>
      </p>
    </div>
  );
};

export default Register;
