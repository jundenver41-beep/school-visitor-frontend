import React, { useState } from 'react';

export default function VisitorApplication() {
  const [formData, setFormData] = useState({
    name: '', target: '', date: '', purpose: '', consent: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('방문 신청이 완료되었습니다. 담임선생님 승인 후 문자가 발송됩니다.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white shadow-md p-5 pb-10">
        
        <header className="mb-6 mt-4">
          <h1 className="text-2xl font-bold text-gray-900">방문 신청</h1>
          <p className="text-gray-500 text-sm mt-1">가락중학교 방문을 위해 아래 정보를 입력해주세요.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 방문자 정보 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">방문자 성명 및 소속</label>
            <input 
              type="text" 
              placeholder="예: 1학년 3반 홍길동 학부모"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          {/* 방문 대상 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">방문 대상 (교직원/부서)</label>
            <select className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">선택해주세요</option>
              <option value="1-1">1학년 1반 담임선생님</option>
              <option value="1-2">1학년 2반 담임선생님</option>
              <option value="admin">행정실</option>
            </select>
          </div>

          {/* 방문 일시 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">희망 방문 일시</label>
            <input 
              type="datetime-local" 
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">* 선생님의 수업 스케줄에 따라 시간 조정이 요청될 수 있습니다.</p>
          </div>

          {/* 방문 목적 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">방문 목적</label>
            <textarea 
              rows="4"
              placeholder="방문하시는 목적을 간략히 적어주세요."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              required
            ></textarea>
          </div>

          {/* 개인정보 동의 (둥근 박스 처리) */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl mt-4">
            <label className="flex items-start gap-3">
              <input 
                type="checkbox" 
                className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <span className="text-sm text-gray-600 leading-relaxed">
                <strong className="text-gray-800 block mb-1">[필수] 개인정보 수집 및 이용 동의</strong>
                출입 관리 및 보안을 위해 이름, 연락처를 수집합니다. 수집된 정보는 방문일로부터 3개월 후 지체없이 파기됩니다.
              </span>
            </label>
          </div>

          {/* 제출 버튼 */}
          <button 
            type="submit"
            className="w-full py-4 mt-6 bg-gray-900 text-white font-bold text-lg rounded-xl shadow-md hover:bg-gray-800 transition"
          >
            신청서 제출하기
          </button>
        </form>
      </div>
    </div>
  );
}
