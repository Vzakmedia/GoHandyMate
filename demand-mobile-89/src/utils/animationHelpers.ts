export interface AnimationConfig {
  duration: number;
  easing: (t: number) => number;
}

export const defaultAnimationConfig: AnimationConfig = {
  duration: 1000,
  easing: (t: number) => t * t * (3 - 2 * t) // smoothstep easing
};

export const createProgressAnimation = (
  targetValues: Record<string, number>,
  config: AnimationConfig,
  onUpdate: (values: Record<string, number>) => void,
  onComplete?: () => void
) => {
  const startTime = Date.now();
  const initialValues: Record<string, number> = {};
  
  // Initialize all values to 0
  Object.keys(targetValues).forEach(key => {
    initialValues[key] = 0;
  });
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / config.duration, 1);
    const easedProgress = config.easing(progress);
    
    const currentValues: Record<string, number> = {};
    Object.keys(targetValues).forEach(key => {
      currentValues[key] = initialValues[key] + (targetValues[key] - initialValues[key]) * easedProgress;
    });
    
    onUpdate(currentValues);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  const animationId = requestAnimationFrame(animate);
  
  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationId);
  };
};