
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WorkoutPlan } from '../types';

const Dashboard: React.FC = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from LocalStorage/Mock API
    const storedPlans = localStorage.getItem('gym_plans');
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans));
    } else {
      // Sample Data
      const samples: WorkoutPlan[] = [
        {
          id: '1',
          userId: 'mock-1',
          title: 'Morning Blast',
          description: 'High intensity cardio and bodyweight',
          createdAt: Date.now(),
          exercises: [
            { id: 'e1', name: 'Pushups', sets: 4, reps: 20, restTime: '45s' },
            { id: 'e2', name: 'Burpees', sets: 3, reps: 15, restTime: '60s' }
          ]
        }
      ];
      setPlans(samples);
      localStorage.setItem('gym_plans', JSON.stringify(samples));
    }
    setLoading(false);
  }, []);

  const deletePlan = (id: string) => {
    const updated = plans.filter(p => p.id !== id);
    setPlans(updated);
    localStorage.setItem('gym_plans', JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold italic tracking-tighter">Your Command Center</h1>
          <p className="text-gray-400 mt-2">Manage your training regimens and goals.</p>
        </div>
        <Link 
          to="/workout/new"
          className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-900/20 transform hover:-translate-y-1 active:scale-95"
        >
          <span className="mr-2 text-xl">+</span> New Workout Plan
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-neutral-900/50 h-64 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="group relative bg-neutral-900 border border-white/5 hover:border-orange-500/50 rounded-2xl p-6 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => deletePlan(plan.id)}
                  className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-2xl font-bold tracking-tight mb-1 group-hover:text-orange-500 transition-colors">{plan.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 h-10">{plan.description}</p>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-xs text-gray-500 font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                  {plan.exercises.length} Exercises
                </div>
                <div className="flex flex-wrap gap-2">
                  {plan.exercises.slice(0, 3).map((e, idx) => (
                    <span key={idx} className="bg-white/5 px-2 py-1 rounded text-[10px] text-gray-400">
                      {e.name}
                    </span>
                  ))}
                  {plan.exercises.length > 3 && (
                    <span className="text-[10px] text-gray-500">+{plan.exercises.length - 3} more</span>
                  )}
                </div>
              </div>

              <Link 
                to={`/workout/edit/${plan.id}`}
                className="block w-full text-center py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-semibold transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-neutral-900/50 rounded-3xl border border-dashed border-white/10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-800 text-4xl mb-6">🏋️‍♂️</div>
          <h2 className="text-2xl font-bold mb-2">No plans found</h2>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">You haven't created any custom workout plans yet. Start by creating one now.</p>
          <Link to="/workout/new" className="text-orange-500 font-bold hover:underline">Create your first plan &rarr;</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
