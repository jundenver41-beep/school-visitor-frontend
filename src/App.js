// src/App.js (전체 코드 교체)
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VisitorForm from './VisitorForm';
import Teacher from './Teacher';
import Login from './Login'; // ✅ 로그인 파일 불러오기

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VisitorForm />} />
        <Route path="/login" element={<Login />} /> {/* ✅ 주소 추가 */}
        <Route path="/teacher" element={<Teacher />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
