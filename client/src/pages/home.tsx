import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, CheckSquare } from "lucide-react";
import { StatsOverview } from "@/components/stats-overview";
import { TaskForm } from "@/components/task-form";
import { TaskList } from "@/components/task-list";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-gray-50 min-h-screen font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CheckSquare className="text-blue-500 text-2xl mr-3" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Beta
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden sm:block">
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>

              {/* User Menu */}
              <div className="relative">
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">TF</span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">Task Manager</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <StatsOverview />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Form */}
          <div className="lg:col-span-1">
            <TaskForm />
          </div>

          {/* Task List */}
          <div className="lg:col-span-2">
            <TaskList />
          </div>
        </div>
      </main>
    </div>
  );
}
