
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WorkoutPlan, Exercise } from '../types';

const WorkoutEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      const storedPlans = localStorage.getItem('gym_plans');
      if (storedPlans) {
        const plans = JSON.parse(storedPlans) as WorkoutPlan[];
        const target = plans.find(p => p.id === id);
        if (target) {
          setTitle(target.title);
          setDescription(target.description);
          setExercises(target.exercises);
          setIsEditing(true);
        }
      }
    } else {
      // Start with one empty exercise
      addExercise();
    }
  }, [id]);

  const addExercise = () => {
    const newEx: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      sets: 3,
      reps: 10,
      restTime: '60s'
    };
    setExercises([...exercises, newEx]);
  };

  const removeExercise = (exId: string) => {
    setExercises(exercises.filter(e => e.id !== exId));
  };

  const updateExercise = (exId: string, field: keyof Exercise, value: any) => {
    setExercises(exercises.map(e => e.id === exId ? { ...e, [field]: value } : e));
  };

  const handleSave = () => {
    if (!title) return alert('Please provide a title');
    
    const storedPlans = JSON.parse(localStorage.getItem('gym_plans') || '[]');
    const newPlan: WorkoutPlan = {
      id: id || Math.random().toString(36).substr(2, 9),
      userId: 'current-user',
      title,
      description,
      exercises: exercises.filter(e => e.name.trim() !== ''),
      createdAt: Date.now()
    };

    let updated;
    if (isEditing) {
      updated = storedPlans.map((p: WorkoutPlan) => p.id === id ? newPlan : p);
    } else {
      updated = [newPlan, ...storedPlans];
    }

    localStorage.setItem('gym_plans', JSON.stringify(updated));
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center space-x-4 mb-8">
        <button 
          onClick={() => navigate('/')}
          className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-heading text-4xl font-bold tracking-tighter italic">
          {isEditing ? 'Hone Your Plan' : 'Draft New Routine'}
        </h1>
      </div>

      <div className="space-y-8">
        <section className="bg-neutral-900 p-8 rounded-2xl border border-white/5">
          <h2 className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-6">General Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Plan Title</label>
              <input 
                type="text"
                placeholder="e.g., Push Day A, Yoga Flow, Endurance Run"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:border-orange-600"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description (Optional)</label>
              <textarea 
                rows={2}
                placeholder="What is the main goal of this session?"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-600 resize-none"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="bg-neutral-900 p-8 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs uppercase tracking-widest text-orange-500 font-bold">Exercises & Sets</h2>
            <button 
              onClick={addExercise}
              className="text-xs bg-orange-600/10 text-orange-500 hover:bg-orange-600 hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all"
            >
              + ADD EXERCISE
            </button>
          </div>

          <div className="space-y-4">
            {exercises.map((ex, index) => (
              <div key={ex.id} className="relative bg-black/40 border border-white/5 p-6 rounded-xl group">
                <button 
                  onClick={() => removeExercise(ex.id)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-5">
                    <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">Exercise Name</label>
                    <input 
                      type="text"
                      className="w-full bg-black/60 border border-white/5 rounded-lg px-3 py-2 text-sm focus:border-orange-600 outline-none"
                      value={ex.name}
                      onChange={e => updateExercise(ex.id, 'name', e.target.value)}
                      placeholder="Bench Press"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">Sets</label>
                    <input 
                      type="number"
                      className="w-full bg-black/60 border border-white/5 rounded-lg px-3 py-2 text-sm focus:border-orange-600 outline-none"
                      value={ex.sets}
                      onChange={e => updateExercise(ex.id, 'sets', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">Reps</label>
                    <input 
                      type="number"
                      className="w-full bg-black/60 border border-white/5 rounded-lg px-3 py-2 text-sm focus:border-orange-600 outline-none"
                      value={ex.reps}
                      onChange={e => updateExercise(ex.id, 'reps', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] uppercase font-bold text-gray-600 mb-1">Rest Time</label>
                    <input 
                      type="text"
                      className="w-full bg-black/60 border border-white/5 rounded-lg px-3 py-2 text-sm focus:border-orange-600 outline-none"
                      value={ex.restTime}
                      onChange={e => updateExercise(ex.id, 'restTime', e.target.value)}
                      placeholder="90s"
                    />
                  </div>
                </div>
              </div>
            ))}

            {exercises.length === 0 && (
              <div className="text-center py-10 text-gray-500 text-sm">
                No exercises added. Click "Add Exercise" above.
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end pt-6">
          <button 
            onClick={handleSave}
            className="px-12 py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors shadow-xl"
          >
            {isEditing ? 'UPDATE PLAN' : 'SAVE ROUTINE'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutEditor;
