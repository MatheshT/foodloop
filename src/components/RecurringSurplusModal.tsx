import React, { useState } from 'react';
import { Calendar, Clock, Plus, CheckCircle2, Trash2, Repeat, BellRing } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface RecurringSurplusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScheduleRule {
  id: string;
  name: string;
  days: string[];
  time: string;
  expectedServings: number;
  foodType: string;
  autoDispatch: boolean;
}

export const RecurringSurplusModal: React.FC<RecurringSurplusModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [schedules, setSchedules] = useState<ScheduleRule[]>([
    {
      id: 'sch-1',
      name: 'Hostel Mess Daily Lunch Surplus',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      time: '14:30',
      expectedServings: 120,
      foodType: 'Prepared Hot (Rice & Dal)',
      autoDispatch: true
    },
    {
      id: 'sch-2',
      name: 'Weekend Banquet Dinner Buffet Overflow',
      days: ['Sat', 'Sun'],
      time: '23:00',
      expectedServings: 250,
      foodType: 'Prepared Hot (Festive Catering)',
      autoDispatch: true
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('15:00');
  const [newServings, setNewServings] = useState(80);

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    soundManager.playSuccessChime();
    setSchedules([
      ...schedules,
      {
        id: `sch-${Date.now()}`,
        name: newTitle,
        days: ['Daily'],
        time: newTime,
        expectedServings: newServings,
        foodType: 'Prepared Hot',
        autoDispatch: true
      }
    ]);
    setNewTitle('');
  };

  const handleDelete = (id: string) => {
    soundManager.playNotificationTone();
    setSchedules(schedules.filter(s => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative my-6 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Automated Recurring Surplus Dispatch</h2>
              <p className="text-xs text-slate-500 font-medium">Auto-dispatch volunteer couriers for predictable kitchen routines</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Existing Schedules */}
        <div className="space-y-3 mb-5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Active Automated Schedules ({schedules.length})
          </span>

          {schedules.map((s) => (
            <div
              key={s.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900">{s.name}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                    Auto-Stage Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {s.days.join(', ')} at <strong className="text-slate-800">{s.time}</strong> • ~{s.expectedServings} servings ({s.foodType})
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(s.id)}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Schedule Form */}
        <form onSubmit={handleAddSchedule} className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-3 text-xs">
          <span className="font-extrabold text-emerald-900 block">Create Recurring Kitchen Slot</span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              required
              placeholder="Routine Name (e.g. Daily Dinner)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="md:col-span-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
            />
            <input
              type="time"
              required
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
            />
            <input
              type="number"
              placeholder="Est. Servings"
              value={newServings}
              onChange={(e) => setNewServings(parseInt(e.target.value) || 0)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Recurring Route</span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
