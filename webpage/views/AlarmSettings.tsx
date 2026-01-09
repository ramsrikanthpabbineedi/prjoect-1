
import React, { useState, useEffect } from 'react';
import { Alarm } from '../types';

const AlarmSettings: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newTime, setNewTime] = useState('');
  const [newLabel, setNewLabel] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('gym_alarms');
    if (saved) {
      setAlarms(JSON.parse(saved));
    }
  }, []);

  const addAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime) return;

    const alarm: Alarm = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'current-user',
      time: newTime,
      label: newLabel || 'Workout Reminder',
      isActive: true,
    };

    const updated = [...alarms, alarm];
    setAlarms(updated);
    localStorage.setItem('gym_alarms', JSON.stringify(updated));
    setNewTime('');
    setNewLabel('');
    
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const toggleAlarm = (id: string) => {
    const updated = alarms.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a);
    setAlarms(updated);
    localStorage.setItem('gym_alarms', JSON.stringify(updated));
  };

  const removeAlarm = (id: string) => {
    const updated = alarms.filter(a => a.id !== id);
    setAlarms(updated);
    localStorage.setItem('gym_alarms', JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-12">
        <h1 className="font-heading text-4xl font-bold tracking-tighter italic mb-4 text-orange-500">Peak Performance Reminders</h1>
        <p className="text-gray-400">Set alarms to ensure you never miss a session or a meal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="md:col-span-5">
          <form onSubmit={addAlarm} className="bg-neutral-900 p-8 rounded-2xl border border-white/5 shadow-xl sticky top-24">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Create New Alarm</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Wake-up / Workout Time</label>
                <input 
                  type="time"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-2xl font-bold focus:outline-none focus:border-orange-600 text-white invert"
                  style={{ filter: 'invert(0)' }}
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Label</label>
                <input 
                  type="text"
                  placeholder="Morning Cardio"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-600"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-orange-900/20"
              >
                Set Alarm
              </button>
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="md:col-span-7">
          <div className="space-y-4">
            {alarms.length > 0 ? alarms.map(alarm => (
              <div 
                key={alarm.id} 
                className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${
                  alarm.isActive 
                  ? 'bg-neutral-900 border-orange-500/30' 
                  : 'bg-neutral-900/40 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-6">
                  <div className={`text-4xl font-heading font-bold ${alarm.isActive ? 'text-white' : 'text-gray-500'}`}>
                    {alarm.time}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-300">{alarm.label}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">Daily Repeat</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => toggleAlarm(alarm.id)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${alarm.isActive ? 'bg-orange-600' : 'bg-neutral-800'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${alarm.isActive ? 'left-7' : 'left-1'}`}></div>
                  </button>
                  <button 
                    onClick={() => removeAlarm(alarm.id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )) : (
              <div className="bg-neutral-900/50 rounded-2xl p-12 text-center border border-dashed border-white/10">
                <p className="text-gray-500">No alarms set. Establish a routine today.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmSettings;
