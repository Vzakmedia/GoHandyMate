
import { TaskCard } from "@/components/TaskCard";

interface ProviderJobsSectionProps {
  mockTasks: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    location: string;
    timeAgo: string;
    taskerCount: number;
    urgency: string;
  }>;
}

export const ProviderJobsSection = ({ mockTasks }: ProviderJobsSectionProps) => {
  return (
    <div className="space-y-4">
      {mockTasks.slice(0, 2).map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
