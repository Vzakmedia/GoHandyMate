
export const getPlanColors = (planType: string) => {
  switch (planType) {
    case 'featured':
      return {
        gradient: 'from-purple-600 via-pink-600 to-rose-600',
        badge: 'bg-purple-100 text-purple-700 border-purple-200',
        button: 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
      };
    case 'premium':
      return {
        gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        button: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
      };
    default:
      return {
        gradient: 'from-blue-600 via-indigo-600 to-purple-600',
        badge: 'bg-blue-100 text-blue-700 border-blue-200',
        button: 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
      };
  }
};
