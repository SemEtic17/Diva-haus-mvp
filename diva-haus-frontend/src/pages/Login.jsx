import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from '../components/Toaster'; 
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
    }
  };

  return (
    <div className="container mx-auto p-4 mt-10">
      <h1 className="text-2xl font-bold mb-4">{t('auth.login_title')}</h1>
      <form onSubmit={onSubmit}>
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
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {t('auth.login_button')}
        </button>
      </form>
      <p className="mt-4">
        {t('auth.no_account')} <Link to="/register" className="text-blue-500">{t('auth.register_link')}</Link>
      </p>
    </div>
  );
};

export default Login;
