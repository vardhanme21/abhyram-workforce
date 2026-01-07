'use client';

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  Projector, 
  Plus, 
  Calendar, 
  FileText, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function HomeOverview() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Welcome Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-accent-600">
            Welcome Back, Jyoshi
          </h1>
          <p className="text-gray-500 text-lg mt-1">Here&apos;s a quick look at your workforce performance.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/timesheet">
            <Button className="h-12 px-6 shadow-lg shadow-accent-500/20 bg-accent-600 hover:bg-accent-700">
              <Plus className="w-5 h-5 mr-2" />
              New Timesheet
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Hours" 
          value="38.5" 
          unit="hrs"
          subtitle="This week"
          icon={<Clock className="w-5 h-5" />}
          trend="+2.4% from last week"
          color="blue"
        />
        <StatCard 
          title="Utilization" 
          value="94" 
          unit="%"
          subtitle="Resource health"
          icon={<BarChart3 className="w-5 h-5" />}
          trend="Optimal performance"
          color="teal"
        />
        <StatCard 
          title="Active Projects" 
          value="4" 
          unit="Projects"
          subtitle="Currently assigned"
          icon={<Projector className="w-5 h-5" />}
          trend="No overdue tasks"
          color="indigo"
        />
        <StatCard 
          title="Approvals" 
          value="2" 
          unit="Pending"
          subtitle="Manager review"
          icon={<CheckCircle2 className="w-5 h-5" />}
          trend="Waiting for final sign-off"
          color="amber"
          warning
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Areas */}
        <motion.div variants={item} className="lg:col-span-2 space-y-8">
          {/* Recent Activity */}
          <Card className="glass-card overflow-hidden border-none shadow-xl">
            <CardHeader className="bg-primary-50/50 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Weekly Timesheet Progress</CardTitle>
                  <CardDescription>Visualizing your effort across active projects</CardDescription>
                </div>
                <Link href="/dashboard/timesheet">
                  <Button variant="ghost" className="text-accent-600 hover:text-accent-700 hover:bg-accent-50/50">
                    View Full Sheet <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <ProgressItem label="Salesforce Portal Development" value={65} color="bg-accent-500" />
                <ProgressItem label="Client Audit Prep" value={20} color="bg-teal-500" />
                <ProgressItem label="Team Management & Hiring" value={10} color="bg-indigo-500" />
                <ProgressItem label="Others" value={5} color="bg-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Productivity Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg bg-white/60 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Peak Performance</h4>
                    <p className="text-sm text-gray-500">Highest productivity at 10:30 AM</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Your most intensive coding sessions happen in the morning. Consider blocking this time for deep work.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-white/60 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Burnout Risk</h4>
                    <p className="text-sm text-gray-500">Weekly limit approaching</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  You&apos;ve averaged 44 hours over the 1ast 2 weeks. Ensure you take a break this weekend.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Sidebar Actions */}
        <motion.div variants={item} className="space-y-8">
          <Card className="bg-primary-700 text-white border-none shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <LogoIcon className="w-24 h-24" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuickActionButton icon={<Calendar className="w-4 h-4" />} label="Request Time Off" />
              <QuickActionButton icon={<FileText className="w-4 h-4" />} label="Export Reports" />
              <QuickActionButton icon={<BarChart3 className="w-4 h-4" />} label="View Team Stats" />
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <ReminderItem text="Submit week 1 timesheet" time="Today, 5:00 PM" urgent />
                <ReminderItem text="Project Alpha Review" time="Tomorrow, 10:00 AM" />
                <ReminderItem text="Monthly Compliance Quiz" time="Friday" />
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: string;
  color: 'blue' | 'teal' | 'indigo' | 'amber';
  warning?: boolean;
}

function StatCard({ title, value, unit, subtitle, icon, trend, color, warning }: StatCardProps) {
  const colors: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50",
    teal: "text-teal-600 bg-teal-50",
    indigo: "text-indigo-600 bg-indigo-50",
    amber: "text-amber-600 bg-amber-50",
  };

  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white/70 backdrop-blur-md">
      <CardContent className="pt-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl ${colors[color]} group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          {warning && (
            <div className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] uppercase font-bold rounded-full animate-pulse">
              Needs Action
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            <span className="text-sm text-gray-500 font-medium">{unit}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-[11px] font-medium text-gray-600">
          {trend}
        </div>
        <div className={`absolute bottom-0 left-0 h-1 w-full ${color === 'blue' ? 'bg-blue-500' : color === 'teal' ? 'bg-teal-500' : color === 'indigo' ? 'bg-indigo-500' : 'bg-amber-500'} opacity-0 group-hover:opacity-100 transition-opacity`} />
      </CardContent>
    </Card>
  );
}

interface ProgressItemProps {
  label: string;
  value: number;
  color: string;
}

function ProgressItem({ label, value, color }: ProgressItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-500">{value}%</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${color}`} 
        />
      </div>
    </div>
  );
}

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
}

function QuickActionButton({ icon, label }: QuickActionButtonProps) {
  return (
    <Button variant="outline" className="w-full justify-start border-white/20 bg-white/10 hover:bg-white/20 text-white gap-3 border transition-all">
      {icon}
      <span>{label}</span>
    </Button>
  );
}

interface ReminderItemProps {
  text: string;
  time: string;
  urgent?: boolean;
}

function ReminderItem({ text, time, urgent }: ReminderItemProps) {
  return (
    <li className="flex gap-4 group cursor-pointer">
      <div className={`w-1 rounded-full ${urgent ? 'bg-error' : 'bg-gray-200'} group-hover:scale-y-110 transition-transform`} />
      <div className="space-y-1">
        <p className={`text-sm font-medium ${urgent ? 'text-error' : 'text-gray-900'} group-hover:text-accent-600 transition-colors`}>{text}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </li>
  );
}

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}
