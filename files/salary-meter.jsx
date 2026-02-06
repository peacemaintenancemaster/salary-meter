import React, { useState, useEffect, useRef } from 'react';
import { Settings, Play, Zap, DollarSign, X, Check, Moon, Sun } from 'lucide-react';

const MILESTONES = [
  { price: 2000, name: '아메리카노 한 잔', icon: '☕' },
  { price: 10000, name: '뜨끈한 국밥', icon: '🍲' },
  { price: 25000, name: '치킨 한 마리', icon: '🍗' },
  { price: 50000, name: '가성비 오마카세', icon: '🍣' },
  { price: 100000, name: '결혼식 축의금', icon: '💌' },
  { price: 300000, name: '제주도 항공권', icon: '✈️' },
  { price: 1500000, name: '최신형 스마트폰', icon: '📱' },
  { price: 3000000, name: '꿈꾸던 해외여행', icon: '🌍' }
];

// Pixelated Horse Animation Component
const PixelHorse = () => {
  const [frame, setFrame] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % 4);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const frames = [
    // Frame 1
    `████████
█▓▓▓▓█
█▓█▓█
██▓██
█▓█▓█
██████
█ ██ █
█    █`,
    // Frame 2
    `████████
█▓▓▓▓█
█▓█▓█
██▓██
█▓█▓█
██████
 ██ █
█   █ `,
    // Frame 3
    `████████
█▓▓▓▓█
█▓█▓█
██▓██
█▓█▓█
██████
█  ██
 █  █ `,
    // Frame 4
    `████████
█▓▓▓▓█
█▓█▓█
██▓██
█▓█▓█
██████
█ ██ 
  █  █`
  ];

  return (
    <div className="font-mono text-[6px] leading-[6px] whitespace-pre text-green-400 opacity-80">
      {frames[frame]}
    </div>
  );
};

// LED Display Component
const LEDDisplay = ({ value, size = 'large', color = 'green' }) => {
  const colorClasses = {
    green: 'text-green-400',
    amber: 'text-amber-400',
    red: 'text-red-500'
  };
  
  const sizeClasses = {
    large: 'text-5xl md:text-6xl',
    medium: 'text-3xl md:text-4xl',
    small: 'text-xl md:text-2xl'
  };

  return (
    <div 
      className={`font-mono ${sizeClasses[size]} ${colorClasses[color]} tracking-wider filter drop-shadow-[0_0_8px_currentColor]`}
      style={{ fontVariant: 'tabular-nums' }}
    >
      {value}
    </div>
  );
};

// Main App Component
export default function SalaryMeter() {
  const [mode, setMode] = useState('taxi'); // 'taxi' or 'minimal'
  const [screen, setScreen] = useState('setup'); // 'setup', 'running', 'settlement'
  const [isRunning, setIsRunning] = useState(false);
  
  // Setup form state
  const [monthlySalary, setMonthlySalary] = useState('');
  const [payDay, setPayDay] = useState('25');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // Runtime state
  const [currentEarned, setCurrentEarned] = useState(0);
  const [monthlyEarned, setMonthlyEarned] = useState(0);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState(1);
  const [showOvertimeInput, setShowOvertimeInput] = useState(false);
  const [tempMultiplier, setTempMultiplier] = useState('1.5');
  const [showSettlement, setShowSettlement] = useState(false);
  const [showStealthBar, setShowStealthBar] = useState(false);
  
  const intervalRef = useRef(null);

  // Set default start time to current time on mount
  useEffect(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setStartTime(`${hours}:${minutes}`);
    setEndTime('18:00');
  }, []);

  // Calculate earnings per second
  const calculateEarningsPerSecond = () => {
    if (!monthlySalary) return 0;
    const monthlyAmount = parseInt(monthlySalary);
    const secondsInMonth = 30 * 24 * 60 * 60; // Approximate
    const workHoursPerDay = 8;
    const workDaysPerMonth = 22;
    const secondsWorkedPerMonth = workDaysPerMonth * workHoursPerDay * 60 * 60;
    return (monthlyAmount / secondsWorkedPerMonth) * overtimeMultiplier;
  };

  // Start the meter
  const startMeter = () => {
    if (!monthlySalary || !startTime || !endTime) return;
    
    setScreen('running');
    setIsRunning(true);
    
    const earningsPerSecond = calculateEarningsPerSecond();
    
    intervalRef.current = setInterval(() => {
      setCurrentEarned(prev => prev + earningsPerSecond);
      setMonthlyEarned(prev => prev + earningsPerSecond);
    }, 1000);
  };

  // Stop the meter
  const stopMeter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  // Settlement
  const handleSettlement = () => {
    setShowSettlement(true);
  };

  const confirmSettlement = () => {
    stopMeter();
    setCurrentEarned(0);
    setScreen('setup');
    setShowSettlement(false);
    setOvertimeMultiplier(1);
    setShowOvertimeInput(false);
  };

  const cancelSettlement = () => {
    setShowSettlement(false);
  };

  // Apply overtime
  const applyOvertime = () => {
    const multiplier = parseFloat(tempMultiplier) || 1;
    setOvertimeMultiplier(multiplier);
    setShowOvertimeInput(false);
    
    // Restart interval with new multiplier
    if (isRunning) {
      stopMeter();
      const earningsPerSecond = calculateEarningsPerSecond();
      intervalRef.current = setInterval(() => {
        setCurrentEarned(prev => prev + earningsPerSecond * multiplier);
        setMonthlyEarned(prev => prev + earningsPerSecond * multiplier);
      }, 1000);
    }
  };

  // Get current milestone info
  const getMilestoneInfo = () => {
    let currentMilestone = null;
    let nextMilestone = null;
    let progress = 0;

    for (let i = 0; i < MILESTONES.length; i++) {
      if (currentEarned >= MILESTONES[i].price) {
        currentMilestone = MILESTONES[i];
      } else {
        nextMilestone = MILESTONES[i];
        break;
      }
    }

    if (nextMilestone) {
      const prevPrice = currentMilestone ? currentMilestone.price : 0;
      progress = ((currentEarned - prevPrice) / (nextMilestone.price - prevPrice)) * 100;
    }

    // Determine display text
    let displayText = '';
    let displayIcon = '';
    
    if (!currentMilestone && nextMilestone) {
      // Before first milestone
      displayText = `${nextMilestone.name}까지 남은 금액 ${(nextMilestone.price - currentEarned).toLocaleString('ko-KR')}원`;
      displayIcon = nextMilestone.icon;
    } else if (currentMilestone && nextMilestone) {
      if (progress > 50) {
        // More than 50% to next milestone
        displayText = `${nextMilestone.name}까지 남은 금액 ${(nextMilestone.price - currentEarned).toLocaleString('ko-KR')}원`;
        displayIcon = nextMilestone.icon;
      } else {
        // Just achieved current milestone
        displayText = `${currentMilestone.name}를 벌었습니다`;
        displayIcon = currentMilestone.icon;
      }
    } else if (currentMilestone && !nextMilestone) {
      // Achieved all milestones
      displayText = `${currentMilestone.name}를 벌었습니다`;
      displayIcon = currentMilestone.icon;
    }

    return { displayText, displayIcon, progress: Math.min(progress, 100) };
  };

  const milestoneInfo = screen === 'running' ? getMilestoneInfo() : { displayText: '', displayIcon: '', progress: 0 };

  // Setup Screen
  if (screen === 'setup') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        mode === 'taxi' ? 'bg-black' : 'bg-gray-50'
      }`}>
        <div className={`w-full max-w-md ${
          mode === 'taxi' 
            ? 'bg-gradient-to-br from-gray-900 to-black border-4 border-green-500 shadow-[0_0_30px_rgba(0,255,0,0.3)]' 
            : 'bg-white rounded-2xl shadow-xl'
        } p-8`}>
          {/* Mode Toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setMode(mode === 'taxi' ? 'minimal' : 'taxi')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'taxi'
                  ? 'bg-green-500 text-black hover:bg-green-400'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {mode === 'taxi' ? '일반 모드' : '택시 모드'}
            </button>
          </div>

          {/* Title */}
          <h1 className={`text-3xl font-bold mb-8 text-center ${
            mode === 'taxi' ? 'text-green-400 font-mono' : 'text-gray-900'
          }`}>
            {mode === 'taxi' ? '🚖 월급 미터기 설정' : 'Salary Meter Setup'}
          </h1>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className={`block mb-2 text-sm font-medium ${
                mode === 'taxi' ? 'text-green-400' : 'text-gray-700'
              }`}>
                세전 월급 (만원)
              </label>
              <input
                type="number"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(e.target.value)}
                placeholder="300"
                className={`w-full px-4 py-3 rounded-lg text-lg font-mono ${
                  mode === 'taxi'
                    ? 'bg-black border-2 border-green-500 text-green-400 placeholder-green-900 focus:ring-2 focus:ring-green-400'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
                } outline-none`}
              />
            </div>

            <div>
              <label className={`block mb-2 text-sm font-medium ${
                mode === 'taxi' ? 'text-green-400' : 'text-gray-700'
              }`}>
                월급 지급일 (매달)
              </label>
              <input
                type="number"
                value={payDay}
                onChange={(e) => setPayDay(e.target.value)}
                placeholder="25"
                min="1"
                max="31"
                className={`w-full px-4 py-3 rounded-lg text-lg font-mono ${
                  mode === 'taxi'
                    ? 'bg-black border-2 border-green-500 text-green-400 placeholder-green-900 focus:ring-2 focus:ring-green-400'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
                } outline-none`}
              />
            </div>

            <div>
              <label className={`block mb-2 text-sm font-medium ${
                mode === 'taxi' ? 'text-green-400' : 'text-gray-700'
              }`}>
                출근 시간
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg text-lg font-mono ${
                  mode === 'taxi'
                    ? 'bg-black border-2 border-green-500 text-green-400 focus:ring-2 focus:ring-green-400'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
                } outline-none`}
              />
            </div>

            <div>
              <label className={`block mb-2 text-sm font-medium ${
                mode === 'taxi' ? 'text-green-400' : 'text-gray-700'
              }`}>
                퇴근 시간
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg text-lg font-mono ${
                  mode === 'taxi'
                    ? 'bg-black border-2 border-green-500 text-green-400 focus:ring-2 focus:ring-green-400'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
                } outline-none`}
              />
            </div>

            <button
              onClick={startMeter}
              disabled={!monthlySalary || !startTime || !endTime}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                mode === 'taxi'
                  ? 'bg-green-500 text-black hover:bg-green-400 disabled:bg-green-900 disabled:text-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500'
              } disabled:cursor-not-allowed`}
            >
              {mode === 'taxi' ? '미터기 켜기' : 'Start Meter'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Running Screen - Taxi Mode
  if (screen === 'running' && mode === 'taxi') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Main Meter Display */}
          <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-green-500 rounded-3xl shadow-[0_0_50px_rgba(0,255,0,0.4)] p-8 relative overflow-hidden">
            {/* Mode Toggle */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setMode('minimal')}
                className="px-3 py-1.5 bg-green-500 text-black text-xs font-bold rounded hover:bg-green-400 transition-all"
              >
                일반 모드
              </button>
            </div>

            {/* Decorative grid pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #00ff00 0px, #00ff00 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, #00ff00 0px, #00ff00 1px, transparent 1px, transparent 4px)',
              backgroundSize: '4px 4px'
            }}></div>

            {/* Top Section - Horse and Company Name */}
            <div className="relative flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-black p-3 rounded-lg border-2 border-green-500">
                  <PixelHorse />
                </div>
                <div>
                  <div className="text-amber-400 text-xs font-mono">1996</div>
                  <div className="text-green-400 text-sm font-mono">SALARY CO.</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-green-400 text-xs font-mono">0.0 km/h</div>
                <div className="text-amber-400 text-2xl font-mono font-bold">
                  {(parseInt(monthlySalary) * 10000).toLocaleString('ko-KR')}원
                </div>
                <div className="text-green-400 text-xs font-mono">0 적산</div>
              </div>
            </div>

            {/* Main Earned Amount */}
            <div className="bg-black rounded-xl p-6 mb-4 border-2 border-green-600">
              <LEDDisplay value={`₩${Math.floor(currentEarned).toLocaleString('ko-KR')}`} size="large" color="green" />
            </div>

            {/* Monthly Accumulated */}
            <div className="bg-black rounded-xl p-4 mb-4 border border-green-700">
              <div className="text-green-400 text-xs font-mono mb-1">이번 달 누적 금액</div>
              <LEDDisplay value={`₩${Math.floor(monthlyEarned).toLocaleString('ko-KR')}`} size="small" color="amber" />
            </div>

            {/* Milestone Display */}
            <div className="bg-black rounded-xl p-4 mb-6 border border-amber-600">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{milestoneInfo.displayIcon}</div>
                <div className="flex-1">
                  <div className="text-amber-400 text-sm font-mono mb-2">{milestoneInfo.displayText}</div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-amber-400 h-full transition-all duration-1000 ease-out"
                      style={{ width: `${milestoneInfo.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => setShowSettlement(false)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-3 rounded-lg transition-all border-b-4 border-yellow-700 active:border-b-0 active:mt-1 text-sm"
              >
                설정
              </button>
              <button
                onClick={() => isRunning ? stopMeter() : startMeter()}
                className={`${isRunning ? 'bg-red-500 hover:bg-red-400 border-red-700' : 'bg-green-500 hover:bg-green-400 border-green-700'} text-black font-bold py-4 px-3 rounded-lg transition-all border-b-4 active:border-b-0 active:mt-1 text-sm`}
              >
                주행
              </button>
              <button
                onClick={() => setShowOvertimeInput(!showOvertimeInput)}
                className="bg-orange-500 hover:bg-orange-400 text-black font-bold py-4 px-3 rounded-lg transition-all border-b-4 border-orange-700 active:border-b-0 active:mt-1 text-sm"
              >
                할증
              </button>
              <button
                onClick={handleSettlement}
                className="bg-blue-500 hover:bg-blue-400 text-black font-bold py-4 px-3 rounded-lg transition-all border-b-4 border-blue-700 active:border-b-0 active:mt-1 text-sm"
              >
                지불
              </button>
            </div>

            {/* Overtime Input */}
            {showOvertimeInput && (
              <div className="mt-4 bg-black rounded-xl p-4 border-2 border-orange-500">
                <label className="text-orange-400 text-xs font-mono mb-2 block">할증 비율</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={tempMultiplier}
                    onChange={(e) => setTempMultiplier(e.target.value)}
                    placeholder="1.5"
                    className="flex-1 bg-gray-900 border-2 border-orange-500 text-orange-400 px-3 py-2 rounded font-mono outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <button
                    onClick={applyOvertime}
                    className="bg-orange-500 text-black font-bold px-6 py-2 rounded hover:bg-orange-400 transition-all"
                  >
                    적용
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stealth Bar */}
          <div
            className="mt-4 transition-all duration-300 ease-out"
            onMouseEnter={() => setShowStealthBar(true)}
            onMouseLeave={() => setShowStealthBar(false)}
          >
            {!showStealthBar ? (
              <div className="w-full h-0.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(0,255,0,0.5)]"></div>
            ) : (
              <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-green-500 rounded-lg p-4 flex items-center gap-4 shadow-[0_0_30px_rgba(0,255,0,0.3)]">
                <div className="bg-black p-2 rounded border border-green-500">
                  <PixelHorse />
                </div>
                <div className="flex-1">
                  <div className="text-green-400 font-mono text-sm">현재 금액</div>
                  <div className="text-green-400 font-mono text-xl font-bold">
                    ₩{Math.floor(currentEarned).toLocaleString('ko-KR')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settlement Modal */}
        {showSettlement && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-green-500 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,255,0,0.5)]">
              <h2 className="text-green-400 text-2xl font-mono font-bold mb-6 text-center">업무 종료</h2>
              
              <div className="space-y-4 mb-8">
                <div className="bg-black rounded-lg p-4 border border-green-600">
                  <div className="text-green-400 text-xs font-mono mb-1">오늘 번 금액</div>
                  <div className="text-green-400 text-3xl font-mono font-bold">
                    ₩{Math.floor(currentEarned).toLocaleString('ko-KR')}
                  </div>
                </div>
                
                <div className="bg-black rounded-lg p-4 border border-amber-600">
                  <div className="text-amber-400 text-xs font-mono mb-1">이번 달 누적 금액</div>
                  <div className="text-amber-400 text-3xl font-mono font-bold">
                    ₩{Math.floor(monthlyEarned).toLocaleString('ko-KR')}
                  </div>
                </div>
              </div>

              <p className="text-green-400 text-center font-mono mb-8">업무를 종료하시겠습니까?</p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelSettlement}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-green-400 font-bold py-3 rounded-lg transition-all border-2 border-gray-600"
                >
                  취소
                </button>
                <button
                  onClick={confirmSettlement}
                  className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-all border-2 border-green-600"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Running Screen - Minimal Mode
  if (screen === 'running' && mode === 'minimal') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 relative">
            {/* Mode Toggle */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMode('taxi')}
                className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-all"
              >
                택시 모드
              </button>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Salary Meter</h1>

            {/* Current Earned */}
            <div className="mb-8">
              <div className="text-sm text-gray-500 mb-2">Current Earned</div>
              <div className="text-6xl font-bold text-gray-900 mb-4">
                ₩{Math.floor(currentEarned).toLocaleString('ko-KR')}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${(currentEarned / (parseInt(monthlySalary) * 10000)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Monthly Accumulated */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-sm text-gray-500 mb-1">Monthly Accumulated</div>
              <div className="text-3xl font-bold text-gray-900">
                ₩{Math.floor(monthlyEarned).toLocaleString('ko-KR')}
              </div>
            </div>

            {/* Milestone */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{milestoneInfo.displayIcon}</div>
                <div className="flex-1">
                  <div className="text-blue-900 font-medium mb-2">{milestoneInfo.displayText}</div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${milestoneInfo.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <button
                onClick={() => isRunning ? stopMeter() : startMeter()}
                className={`flex-1 ${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-3 rounded-lg transition-all`}
              >
                {isRunning ? 'Pause' : 'Resume'}
              </button>
              <button
                onClick={handleSettlement}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-all"
              >
                업무 종료
              </button>
            </div>

            {/* Overtime Control */}
            <div className="mt-4">
              <button
                onClick={() => setShowOvertimeInput(!showOvertimeInput)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showOvertimeInput ? 'Hide' : 'Show'} Overtime Settings
              </button>
              
              {showOvertimeInput && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={tempMultiplier}
                    onChange={(e) => setTempMultiplier(e.target.value)}
                    placeholder="1.5"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={applyOvertime}
                    className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Apply {tempMultiplier}x
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stealth Bar */}
          <div
            className="mt-4 transition-all duration-300"
            onMouseEnter={() => setShowStealthBar(true)}
            onMouseLeave={() => setShowStealthBar(false)}
          >
            {!showStealthBar ? (
              <div className="w-full h-0.5 bg-blue-500 rounded-full"></div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                  🏃
                </div>
                <div className="flex-1">
                  <div className="text-gray-500 text-xs">Current Amount</div>
                  <div className="text-gray-900 font-bold text-lg">
                    ₩{Math.floor(currentEarned).toLocaleString('ko-KR')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settlement Modal */}
        {showSettlement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">End Work Session</h2>
              
              <div className="space-y-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Today's Earnings</div>
                  <div className="text-3xl font-bold text-gray-900">
                    ₩{Math.floor(currentEarned).toLocaleString('ko-KR')}
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-600 mb-1">Monthly Total</div>
                  <div className="text-3xl font-bold text-blue-900">
                    ₩{Math.floor(monthlyEarned).toLocaleString('ko-KR')}
                  </div>
                </div>
              </div>

              <p className="text-center text-gray-600 mb-8">업무를 종료하시겠습니까?</p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelSettlement}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSettlement}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
