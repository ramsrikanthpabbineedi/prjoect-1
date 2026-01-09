
export interface Exercise {
  id: string;
  name: string;
  reps: number;
  sets: number;
  restTime: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  exercises: Exercise[];
  createdAt: number;
}

export interface User {
  rrr: string; // Unique user ID (DynamoDB Partition Key)
  emailId: string;
  phoneNumber?: string;
  createdAt: number;
}

export interface Alarm {
  id: string;
  userId: string;
  time: string; // HH:mm format
  label: string;
  isActive: boolean;
}
