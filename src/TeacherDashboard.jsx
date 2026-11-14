import React, { useState } from 'react';

export default function TeacherDashboard() {
  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, name: '김민수 학부모', relation: '1학년 3본 김민수 모', time: '11. 14 (목) 14:00', purpose: '학생 진로 및 교우관계 상담' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white shadow-md relative pb-20">
        
        {/* 상단 헤더 */}
        <header className="px-5 py-4 bg-white border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">가락중학교 방문관리</h1>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            이
          </div>
        </header>

        <main className="p-5 space-y-6">
          {/* 승인 대기 카드 (편지지 스타일 적용) */}
          <section>
            <div className="flex justify-between items-end mb-3">
              <h2 className="text-lg font-bold text-gray-800">승인 대기 <span className="text-blue-600">{pendingRequests.length}</span></h2>
            </div>
            
            {pendingRequests.map(req => (
              <div key={req.id} className="bg-amber-50 border border-amber-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                {/* 편지지 느낌의 우측 상단 패턴 장식 */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-bl-full opacity-50"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{req.name}</h3>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-md">신규요청</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{req.relation}</p>
                  <p className="text-sm text-gray-600 mb-1">⏱ {req.time}</p>
                  <div className="mt-3 p-3 bg-white/60 rounded-lg text-sm text-gray-700">
                    " {req.purpose} "
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                      거절 / 변경
                    </button>
                    <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-sm hover:bg-blue-700 transition">
                      승인하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* 오늘의 방문 리스트 */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">오늘의 방문 (1)</h2>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">이정훈 장학사</h3>
                <p className="text-sm text-gray-500 mt-0.5">강동송파교육지원청 • 15:30</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                체크인 완료
              </span>
            </div>
          </section>
        </main>

        {/* 하단 네비게이션 바 */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 text-xs text-gray-400">
          <button className="flex flex-col items-center text-blue-600"><span className="text-lg mb-1">🏠</span>홈</button>
          <button className="flex flex-col items-center"><span className="text-lg mb-1">📅</span>일정</button>
          <button className="flex flex-col items-center"><span className="text-lg mb-1">🔔</span>알림</button>
          <button className="flex flex-col items-center"><span className="text-lg mb-1">👤</span>설정</button>
        </nav>
      </div>
    </div>
  );
}