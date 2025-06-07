import { GoogleLogin } from '@react-oauth/google';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-52 h-52 sm:w-64 sm:h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-52 h-52 sm:w-64 sm:h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-52 h-52 sm:w-64 sm:h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center min-h-[80vh] px-4 py-10 sm:py-16 md:px-10 gap-8">
    
        <div className="w-full md:w-1/2 flex justify-center px-4">
          <img
            src="https://illustrations.popsy.co/amber/student-graduation.svg"
            alt="Interview illustration"
            className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain transition-transform duration-500 hover:scale-105"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center text-center px-4 sm:px-6 md:px-8 gap-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
              MockMate
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-md">
            Master your interview skills with{' '}
            <span className="font-semibold text-blue-600">AI-powered</span> mock sessions.
          </p>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
            <div className="relative scale-110 hover:scale-115 transition-transform duration-300">
              <GoogleLogin
                onSuccess={login}
                onError={() => console.log('Login Failed')}
                useOneTap={false}
                auto_select={false}
                theme="filled_blue"
                size="large"
                shape="pill"
                text="continue_with"
                prompt="select_account"
                logo_alignment="center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
