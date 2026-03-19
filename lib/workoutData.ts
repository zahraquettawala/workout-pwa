export type Exercise = {
  id: string;
  name: string;
  reps?: string;
  weight?: number;
  weightUnit?: 'lbs' | 'kg';
  isBodyweight?: boolean;
  note?: string;
  durationSec?: number;
  supersetWith?: {
    id: string;
    name: string;
    reps?: string;
    weight?: number;
    weightUnit?: 'lbs' | 'kg';
    isBodyweight?: boolean;
    note?: string;
    durationSec?: number;
  };
};

export type WorkoutDay = {
  id: string;
  title: string;
  subtitle: string;
  cardio: string;
  workLabel: string;
  exercises: Exercise[];
  abs: string[];
};

export const workouts: WorkoutDay[] = [
  {
    id: 'monday',
    title: 'MONDAY',
    subtitle: 'HIIT · 50 min',
    cardio: 'Stairmaster Level 10+ OR Assault Bike (30s Hard, 30s Moderate)',
    workLabel: 'Circuit × 5 rounds',
    exercises: [
      { id: 'mon-jump-rope', name: '2 min Jump Rope or Assault Bike', isBodyweight: true, durationSec: 120 },
      { id: 'mon-pushups', name: 'Push Ups', reps: '15', isBodyweight: true },
      { id: 'mon-air-squats', name: 'Air Squats', reps: '20', isBodyweight: true },
      { id: 'mon-mtn-climbers', name: 'Mountain Climbers', reps: '80', isBodyweight: true },
    ],
    abs: [
      'Dead Bugs', 'Leg Drops', 'Flutter Kicks', 'Slow Mountain Climbers',
      'Hollow Body Hold', 'Scissor Kicks', 'Plank with Hip Dips',
      'Knee-to-Chest Tucks', 'Reverse Crunch', 'Plank Hold',
    ],
  },
  {
    id: 'tuesday',
    title: 'TUESDAY',
    subtitle: 'Push · 45 min',
    cardio: 'Running at 7+',
    workLabel: '3 sets × 12 reps',
    exercises: [
      {
        id: 'tue-shoulder-press',
        name: 'Seated Shoulder Press',
        reps: '12',
        weight: 17.5,
        weightUnit: 'lbs',
        supersetWith: { id: 'tue-tricep-ext', name: 'DB Tricep Extension', reps: '12', weight: 17.5, weightUnit: 'lbs' },
      },
      {
        id: 'tue-chest-press',
        name: 'DB Chest Press',
        reps: '12',
        weight: 20,
        weightUnit: 'lbs',
        supersetWith: { id: 'tue-lateral-raise', name: 'Lateral Raise', reps: '12', weight: 7.5, weightUnit: 'lbs' },
      },
      {
        id: 'tue-pushups',
        name: 'Push Ups',
        reps: 'AMRAP',
        isBodyweight: true,
        supersetWith: { id: 'tue-front-raise', name: 'DB Front Raise', reps: '12', weight: 7.5, weightUnit: 'lbs', note: '7.5+ lbs' },
      },
    ],
    abs: [
      'Spider Man Plank', 'Plank Shoulder Taps', 'Side Plank Dips R', 'Side Plank Dips L',
      'Cross Body Climbers', 'Heel Touches', 'Side Plank L', 'Side Plank R',
      'Russian Twists', 'Bicycles',
    ],
  },
  {
    id: 'thursday',
    title: 'THURSDAY',
    subtitle: 'Pull · 45 min',
    cardio: 'Running at 7+',
    workLabel: '3 sets × 12 reps',
    exercises: [
      {
        id: 'thu-hammer-curl',
        name: 'Hammer Curl',
        reps: '12',
        weight: 10,
        weightUnit: 'lbs',
        supersetWith: { id: 'thu-bicep-curl', name: 'Bicep Curl', reps: '12', weight: 12, weightUnit: 'lbs' },
      },
      {
        id: 'thu-db-row',
        name: 'Bench Supported DB Row',
        reps: '12 each',
        supersetWith: { id: 'thu-delt-fly', name: 'Delt Fly', reps: '12' },
      },
      {
        id: 'thu-lat-pulldown',
        name: 'Lateral Pulldown',
        reps: '12',
        weight: 60,
        weightUnit: 'lbs',
        note: '60+ lbs',
        supersetWith: { id: 'thu-straight-arm', name: 'Straight Arm Pull Down', reps: '12', weight: 30, weightUnit: 'lbs', note: '30+ lbs' },
      },
    ],
    abs: [
      'Reverse Crunches', 'Flutter Kicks', 'Out Slow Mtn Climbers', 'Scissors',
      'Plank w/ Hip Dips', 'Knee-to-Chest Tucks', 'Plank Hold',
      'Hollow Body Hold', 'Leg Drops', 'Dead Bugs',
    ],
  },
  {
    id: 'friday',
    title: 'FRIDAY',
    subtitle: 'Leg Day · 45 min',
    cardio: 'Stairmaster Level 10+',
    workLabel: 'Superset Circuit · 3 sets (10–12 reps)',
    exercises: [
      {
        id: 'fri-rev-lunge',
        name: 'Alternating Reverse Lunges',
        reps: '10–12',
        weight: 20,
        weightUnit: 'lbs',
      },
      {
        id: 'fri-rdl',
        name: 'RDL',
        reps: '10–12',
        weight: 25,
        weightUnit: 'lbs',
        supersetWith: { id: 'fri-goblet-squat', name: 'Goblet Squat', reps: '10–12', weight: 25, weightUnit: 'lbs' },
      },
      {
        id: 'fri-leg-press',
        name: 'Leg Press',
        reps: '10–12',
        weight: 140,
        weightUnit: 'lbs',
        supersetWith: { id: 'fri-calf-raise', name: 'Calf Raise (LP Machine)', reps: '10–12', weight: 90, weightUnit: 'lbs' },
      },
    ],
    abs: [
      'Bicycle Crunch', 'Russian Twist', 'Side Plank L', 'Side Plank R',
      'Heel Touches', 'Cross Body Climbers', 'Crunch L', 'Crunch R',
      'Plank Shoulder Tap', 'Spider Man Plank',
    ],
  },
  {
    id: 'weekend',
    title: 'WEEKEND',
    subtitle: 'Full Body Sculpt · 50 min',
    cardio: '15 min run, bike, or stairs',
    workLabel: 'Circuit × 5 rounds',
    exercises: [
      { id: 'wknd-jump-rope', name: '2 min Jump Rope or Assault Bike', isBodyweight: true, durationSec: 120 },
      { id: 'wknd-rev-lunge', name: 'DB Reverse Lunge', reps: '10 each leg', weight: 20, weightUnit: 'lbs' },
      { id: 'wknd-bent-rows', name: 'DB Bent Over Rows', reps: '12', weight: 20, weightUnit: 'lbs' },
      { id: 'wknd-shoulder-press', name: 'DB Shoulder Press', reps: '12', weight: 15, weightUnit: 'lbs', note: '15+ lbs' },
      { id: 'wknd-glute-bridge', name: 'DB Glute Bridge', reps: '20', weight: 31, weightUnit: 'lbs', note: '31 lbs / 14 KG KB' },
    ],
    abs: [
      'Toe Reaches', 'Weighted Sit Ups (20 lbs)', 'Plank Jacks', 'Bear Crawl Hold',
      'Starfish Crunches', 'Bird Dog L (5 lbs)', 'Bird Dog R (5 lbs)',
      'Commandos (Plank Up Downs)', 'Superman', 'V Sits',
    ],
  },
];

// Map JS day of week (0=Sun...6=Sat) to workout id
export function getTodayWorkoutId(): string {
  const day = new Date().getDay();
  const map: Record<number, string> = {
    0: 'weekend',
    1: 'monday',
    2: 'tuesday',
    3: 'rest',
    4: 'thursday',
    5: 'friday',
    6: 'weekend',
  };
  return map[day] ?? 'monday';
}
