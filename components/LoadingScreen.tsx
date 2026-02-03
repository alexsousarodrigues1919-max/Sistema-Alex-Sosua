
import React, { useState, useEffect } from 'react';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white dark:bg-[#0f172a] transition-colors duration-500">
      <div className="relative flex flex-col items-center max-w-xs w-full">
        {/* Minimalist Logo Icon */}
        <div className="w-16 h-16 bg-blue-600 rounded-2xl mb-8 flex items-center justify-center shadow-xl shadow-blue-500/20 animate-bounce">
          <div className="w-8 h-1 bg-white rounded-full"></div>
        </div>
        
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tighter uppercase mb-6">
          Sistema do <span className="text-blue-600">Escritório</span>
        </h1>
        
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-linear" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between w-full">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Carregando Módulos</span>
          <span className="text-[10px] font-black text-blue-600">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
