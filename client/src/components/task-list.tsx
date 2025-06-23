import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskItem } from "./task-item";
import { EditTaskModal } from "./edit-task-modal";
import { useTasks } from "@/hooks/use-tasks";
import type { Task } from "@shared/schema";
import { ClipboardList, Plus } from "lucide-react";

type FilterType = "all" | "pending" | "completed";
type SortType = "date" | "priority" | "title";

export function TaskList() {
  const { data: tasks, isLoading } = useTasks();
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("date");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = tasks?.filter((task) => {
    switch (filter) {
      case "completed":
        return task.completed;
      case "pending":
        return !task.completed;
      default:
        return true;
    }
  }) || [];

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sort) {
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "title":
        return a.title.localeCompare(b.title);
      case "date":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const getFilterButtonClass = (filterType: FilterType) =>
    `px-3 py-1 text-sm font-medium rounded-md transition-colors ${
      filter === filterType
        ? "bg-white text-blue-600 shadow-sm"
        : "text-gray-600 hover:text-gray-900"
    }`;

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <Skeleton className="h-6 w-20" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-32" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-6" />
                      <Skeleton className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-sm border border-gray-200">
        {/* Filter Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>

            <div className="flex items-center space-x-4">
              {/* Filter Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={getFilterButtonClass("all")}
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={getFilterButtonClass("pending")}
                  onClick={() => setFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={getFilterButtonClass("completed")}
                  onClick={() => setFilter("completed")}
                >
                  Completed
                </Button>
              </div>

              {/* Sort Dropdown */}
              <Select value={sort} onValueChange={(value: SortType) => setSort(value)}>
                <SelectTrigger className="w-40 text-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="priority">Sort by Priority</SelectItem>
                  <SelectItem value="title">Sort by Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="divide-y divide-gray-200">
          {sortedTasks.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                <ClipboardList size={96} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
              </h3>
              <p className="text-gray-500 mb-4">
                {filter === "all"
                  ? "Create your first task to get started with organizing your work."
                  : `You don't have any ${filter} tasks at the moment.`}
              </p>
              {filter === "all" && (
                <Button className="bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              )}
            </div>
          ) : (
            sortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={setEditingTask}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {sortedTasks.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{sortedTasks.length}</span> of{" "}
                <span className="font-medium">{tasks?.length || 0}</span> tasks
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={true}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={true}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <EditTaskModal
        task={editingTask}
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
      />
    </>
  );
}
