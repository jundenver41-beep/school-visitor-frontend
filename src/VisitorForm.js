import React, { useState } from 'react';
import './index.css'; // Tailwind CSS 적용

function VisitorForm() {
  const [formData, setFormData] = useState({
    visitorName: '', phone: '', visitDate: '', purpose: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 백엔드(5000번 포트)로 데이터 쏘기!
      const response = await fetch('https://school-visitor-api-jundenver.onrender.com/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('방문 신청이 성공적으로 접수되었습니다!');
      } else {
        alert('신청 접수 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('에러:', error);
      alert('서버와 연결할 수 없습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-orange-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">🏫 학교 방문 신청</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">방문자 이름</label>
            <input type="text" className="w-full border border-gray-300 p-2 rounded-lg" required 
              onChange={(e) => setFormData({...formData, visitorName: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연락처 (- 없이)</label>
            <input type="text" className="w-full border border-gray-300 p-2 rounded-lg" required 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">방문 일시</label>
            <input type="datetime-local" className="w-full border border-gray-300 p-2 rounded-lg" required 
              onChange={(e) => setFormData({...formData, visitDate: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">방문 목적</label>
            <textarea className="w-full border border-gray-300 p-2 rounded-lg" required 
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}></textarea>
          </div>
          
          <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors">
            신청서 제출하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default VisitorForm;
