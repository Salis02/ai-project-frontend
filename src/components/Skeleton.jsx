// src/components/Skeleton.jsx
export const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const baseClass = 'animate-pulse bg-gray-300 dark:bg-gray-700';
  const variantClass = variant === 'circular' ? 'rounded-full' : 'rounded';
  
  return <div className={`${baseClass} ${variantClass} ${className}`} />;
};

export const SkeletonCard = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton variant="circular" className="w-6 h-6" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg col-span-2">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
};