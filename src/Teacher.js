import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { QRCodeCanvas } from 'qrcode.react';

function Teacher() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('대기중');
  const [showQRModal, setShowQRModal] = useState(false);
  const qrRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('teacher_token');
    if (!token) {
      alert('로그인이 필요한 페이지입니다!');
      navigate('/login');
      return;
    }
    fetchRequests();
  }, [navigate]);

  const fetchRequests = async () => {
    try {
      const response = await fetch('https://school-visitor-api-jundenver.onrender.com/api/visits');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('목록을 불러오지 못했습니다.', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if(!window.confirm(`이 방문 건을 '${newStatus}' 처리하시겠습니까?`)) return;
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    await fetch(`https://school-visitor-api-jundenver.onrender.com/api/visits/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchRequests();
  };

  // 목록에서 '삭제됨' 탭으로 이동
  const handleDelete = async (id) => {
    if (!window.confirm('이 내역을 "삭제됨" 탭으로 이동하시겠습니까?')) return;
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: '삭제됨' } : req));
    await fetch(`https://school-visitor-api-jundenver.onrender.com/api/visits/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: '삭제됨' })
    });
  };

  // 복구하기
  const handleRestore = async (id) => {
    if (!window.confirm('이 내역을 "방문완료" 상태로 복구하시겠습니까?')) return;
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: '방문완료' } : req));
    await fetch(`https://school-visitor-api-jundenver.onrender.com/api/visits/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: '방문완료' })
    });
  };

  // ⭐ 영구 삭제 함수
  const handlePermanentDelete = async (id) => {
    if (!window.confirm('영구삭제하시겠습니까?\n(삭제된 데이터는 복구할 수 없습니다.)')) return;

    // 화면에서 즉시 제거
    setRequests(prev => prev.filter(req => req.id !== id));

    try {
      await fetch(`https://school-visitor-api-jundenver.onrender.com/api/visits/${id}`, {
        method: 'DELETE'
      });
      alert('영구 삭제되었습니다.');
    } catch (error) {
      console.error('영구 삭제 실패:', error);
      fetchRequests(); // 실패 시 목록 다시 불러오기
    }
  };

  const handleLogout = () => {
    if(window.confirm('안전하게 로그아웃 하시겠습니까?')) {
      localStorage.removeItem('teacher_token');
      navigate('/login');
    }
  };

  const downloadExcel = () => {
    const excelData = requests
      .filter(req => req.status !== '삭제됨')
      .map((req) => ({
        '접수 번호': req.id, '방문자 성함': req.visitorName, '연락처': req.phone,
        '방문 일시': new Date(req.visitDate).toLocaleString(), '방문 목적': req.purpose,
        '처리 상태': req.status, '신청일': new Date(req.createdAt).toLocaleString()
      }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "방문기록");
    XLSX.writeFile(workbook, `방문기록_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "가락중학교_방문신청_QR.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const filteredRequests = requests.filter(req => {
    if (filter === '전체') return req.status !== '삭제됨';
    return req.status === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans relative">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">방문 관리 대시보드</h1>
            <p className="text-sm text-slate-500 mt-2">가락중학교 외부인 출입 통제 시스템</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">JS</div>
            <button onClick={handleLogout} className="text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200 px-4 py-2 rounded-lg transition duration-200">로그아웃</button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex gap-3 flex-wrap">
            {['대기중', '승인됨', '방문완료', '삭제됨', '전체'].map((tab) => (
              <button key={tab} onClick={() => setFilter(tab)} 
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  filter === tab 
                  ? (tab === '삭제됨' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-800 text-white shadow-md')
                  : 'bg-white text-slate-500 hover:bg-slate-200 border border-slate-200'
                }`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowQRModal(true)} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2.5 rounded-lg font-bold hover:bg-indigo-100 transition shadow-sm text-sm">📱 QR코드 생성</button>
            <button onClick={downloadExcel} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-lg font-bold hover:bg-emerald-100 transition shadow-sm text-sm">📊 엑셀 다운로드</button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div key={req.id} className={`bg-white p-6 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between md:items-center gap-6 hover:shadow-md transition-shadow relative ${req.status === '삭제됨' ? 'border-slate-200 bg-slate-50' : 'border-slate-200'}`}>
              
              <div className="absolute top-3 right-3 flex gap-2">
                {/* 방문완료/거절됨 상태에서 '삭제됨 탭'으로 이동 버튼 */}
                {(req.status === '거절됨' || req.status === '방문완료') && (
                  <button onClick={() => handleDelete(req.id)} title="삭제됨 탭으로 이동" className="w-8 h-8 flex items-center justify-center rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors">🗑️</button>
                )}
                {/* 삭제됨 탭에서의 액션 버튼들 */}
                {req.status === '삭제됨' && (
                  <>
                    <button onClick={() => handleRestore(req.id)} title="복구하기" className="w-8 h-8 flex items-center justify-center rounded-full text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">↩️</button>
                    <button onClick={() => handlePermanentDelete(req.id)} title="영구 삭제" className="w-8 h-8 flex items-center justify-center rounded-full text-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-colors">🔥</button>
                  </>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-bold text-xl text-slate-900">{req.visitorName}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    req.status === '승인됨' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                    req.status === '거절됨' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                    req.status === '방문완료' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                    'bg-slate-200 text-slate-500'
                  }`}>{req.status}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
                  <span>📞 {req.phone}</span>
                  <span>📅 {new Date(req.visitDate).toLocaleString()}</span>
                </div>
                <div className="mt-4 bg-slate-50 p-3 rounded-lg text-sm text-slate-700 border border-slate-100">
                  <span className="font-semibold text-slate-900 mr-2">방문 목적:</span> {req.purpose}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 min-w-[120px]">
                {req.status === '대기중' && (
                  <>
                    <button onClick={() => handleStatusChange(req.id, '승인됨')} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium text-sm">승인하기</button>
                    <button onClick={() => handleStatusChange(req.id, '거절됨')} className="bg-white text-rose-600 border border-rose-200 px-4 py-2 rounded-lg font-medium text-sm">거절하기</button>
                  </>
                )}
                {req.status === '승인됨' && (
                  <button onClick={() => handleStatusChange(req.id, '방문완료')} className="bg-emerald-500 text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2">✅ 체크인 처리</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR 코드 모달 생략 (동일) */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">방문 신청 QR코드</h2>
            <div className="flex justify-center mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100" ref={qrRef}>
              <QRCodeCanvas value={window.location.origin} size={200} bgColor={"#ffffff"} fgColor={"#1e293b"} level={"H"} includeMargin={true}/>
            </div>
            <div className="flex gap-2">
              <button onClick={downloadQRCode} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-lg">이미지 다운로드</button>
              <button onClick={() => setShowQRModal(false)} className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-lg">닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teacher;
