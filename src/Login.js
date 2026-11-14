// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      
      if (data.success) {
        // 성공하면 발급받은 입장권을 브라우저 금고(localStorage)에 저장합니다!
        localStorage.setItem('teacher_token', data.token);
        navigate('/teacher'); // 선생님 대시보드로 이동
      } else {
        alert('비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      alert('서버에 연결할 수 없습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="h-14 w-14 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto shadow-md mb-4">
            🔒
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">선생님 로그인</h1>
          <p className="text-sm text-slate-500 mt-2">관리자 암호를 입력해주세요</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력 (임시: 1234)" 
              className="w-full border border-slate-300 p-3.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              required
            />
          </div>
          <button type="submit" className="w-full bg-slate-800 text-white p-3.5 rounded-lg font-bold hover:bg-slate-700 transition shadow-sm text-lg mt-2">
            입장하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
