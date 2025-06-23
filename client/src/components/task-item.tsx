import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Trash2 } from "lucide-react";
import type { Task } from "@shared/schema";
import { useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, parseISO, isBefore } from "date-fns";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const { toast } = useToast();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const toggleComplete = async () => {
    try {
      await updateTask.mutateAsync({
        id: task.id,
        updates: { completed: !task.completed },
      });
      toast({
        title: task.completed ? "Task marked as pending" : "Task completed!",
        description: task.completed ? "Task has been unmarked as completed." : "Great work on completing this task!",
      });
    } catch (error) {
      toast({
        title: "Error updating task",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask.mutateAsync(task.id);
        toast({
          title: "Task deleted",
          description: "The task has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error deleting task",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    
    const dueDate = parseISO(task.dueDate);
    const now = new Date();
    
    if (task.completed) {
      return "Completed";
    } else if (isBefore(dueDate, now)) {
      return "Overdue";
    } else {
      return `Due: ${formatDistanceToNow(dueDate, { addSuffix: true })}`;
    }
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <div className={`p-6 hover:bg-gray-50 transition-colors ${task.completed ? 'bg-gray-50/50' : ''}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 pt-1">
          <button
            onClick={toggleComplete}
            className={`w-5 h-5 rounded border-2 transition-colors focus:ring-2 focus:ring-offset-2 ${
              task.completed
                ? "border-emerald-500 bg-emerald-500 hover:border-emerald-600 focus:ring-emerald-500"
                : "border-gray-300 hover:border-blue-500 focus:ring-blue-500"
            }`}
            disabled={updateTask.isPending}
          >
            {task.completed && (
              <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium truncate ${
              task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-2 ml-4">
              <Badge className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              {dueDateStatus && (
                <span className="text-xs text-gray-500">{dueDateStatus}</span>
              )}
            </div>
          </div>

          {task.description && (
            <p className={`text-sm mt-1 ${
              task.completed ? 'text-gray-500 line-through' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>
                {task.completed 
                  ? `Completed: ${formatDistanceToNow(task.updatedAt, { addSuffix: true })}`
                  : `Created: ${formatDistanceToNow(task.createdAt, { addSuffix: true })}`
                }
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                disabled={deleteTask.isPending}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
