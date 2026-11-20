import React, { useState } from 'react';
import axios from 'axios';

function VisitorForm() {
  // 1~3학년 1~6반 리스트 자동 생성
  const targetTeachers = [];
  for (let grade = 1; grade <= 3; grade++) {
    for (let cls = 1; cls <= 6; cls++) {
      targetTeachers.push(`${grade}학년 ${cls}반 담임`);
    }
  }
  targetTeachers.push('교무실', '행정실', '기타'); // 공통 항목 추가

  const [formData, setFormData] = useState({
    targetTeacher: targetTeachers[0],
    visitDateTime: '',
    visitorName: '',
    relationship: '학부모',
    contact: '', // 캡처엔 없지만 꼭 필요한 항목이라 추가했습니다
    purpose: '학생 상담',
    details: '',
    agreePrivacy: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreePrivacy) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    // 💡 백엔드 DB를 고치지 않기 위해 기존 4개 항목으로 예쁘게 포장해서 보냅니다.
    const submitData = {
      name: `${formData.visitorName} (${formData.relationship})`,
      contact: formData.contact,
      date: formData.visitDateTime,
      purpose: `[${formData.targetTeacher}] ${formData.purpose} ${
        formData.details ? ' - ' + formData.details : ''
      }`,
    };

    try {
      // ⚠️ 주의: 아래 주소가 선생님의 Render 백엔드 주소가 맞는지 확인하세요!
      await axios.post('https://school-visitor-api-jundenver.onrender.com/api/visits', submitData);
      alert('학교 방문 신청이 성공적으로 완료되었습니다.');
      
      // 제출 후 폼 초기화
      setFormData({
        targetTeacher: targetTeachers[0],
        visitDateTime: '',
        visitorName: '',
        relationship: '학부모',
        contact: '',
        purpose: '학생 상담',
        details: '',
        agreePrivacy: false,
      });
    } catch (error) {
      console.error(error);
      alert('신청 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* 헤더 부분 */}
        <div className="bg-white px-6 py-5 border-b border-slate-100 text-center">
          <h2 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
            🏫 학교 방문 신청
          </h2>
        </div>

        {/* 폼 입력 부분 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* 1. 방문 대상 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              방문 대상 (담당 선생님)
            </label>
            <select
              name="targetTeacher"
              value={formData.targetTeacher}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              {targetTeachers.map((teacher, index) => (
                <option key={index} value={teacher}>
                  {teacher}
                </option>
              ))}
            </select>
          </div>

          {/* 2. 희망 일시 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              희망 일시
            </label>
            <input
              type="datetime-local"
              name="visitDateTime"
              value={formData.visitDateTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* 3. 방문자 성명 및 관계 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              방문자 성명 및 관계
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="visitorName"
                placeholder="예: 김민준 모"
                value={formData.visitorName}
                onChange={handleChange}
                required
                className="w-full flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <select
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                className="w-32 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shrink-0"
              >
                <option value="학부모">학부모</option>
                <option value="외부인">외부인</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>

          {/* 3-1. 연락처 (필수 추가) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              연락처 (- 없이)
            </label>
            <input
              type="tel"
              name="contact"
              placeholder="01012345678"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* 4. 방문 목적 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              방문 목적
            </label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="학생 상담">학생 상담</option>
              <option value="서류 발급">서류 발급</option>
              <option value="물품 전달">물품 전달</option>
              <option value="학교 행사">학교 행사</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 5. 상세 내용 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              상세 내용 (선택)
            </label>
            <textarea
              name="details"
              rows="3"
              placeholder="최근 진로 문제로 상담을 원합니다."
              value={formData.details}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            ></textarea>
          </div>

          {/* 6. 개인정보 동의 */}
          <div className="bg-slate-50 p-4 rounded-lg flex gap-3 items-start border border-slate-200">
            <input
              type="checkbox"
              name="agreePrivacy"
              id="agreePrivacy"
              checked={formData.agreePrivacy}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <label htmlFor="agreePrivacy" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
              <span className="font-bold text-slate-800">[필수]</span> 방문 관리를 위한 개인정보 수집 및 이용 (이름, 연락처 등)에 동의합니다. <br/>
              (보존기간: 3개월)
            </label>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 mt-2 shadow-sm"
          >
            신청서 제출하기
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default VisitorForm;
