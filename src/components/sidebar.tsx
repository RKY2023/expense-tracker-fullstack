"use client"

import { BarChart3, Calendar, Upload, Plus, Home, TrendingUp, Clock, Moon, Sun, LogOut, MapPin, FileSpreadsheet, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/store/authSlice"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const dispatch = useDispatch()
  const username = useSelector((state: any) => state.auth.username)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "daily", label: "Daily View", icon: Clock },
    { id: "monthly", label: "Monthly View", icon: Calendar },
    { id: "yearly", label: "Yearly View", icon: TrendingUp },
    { id: "add", label: "Add Expense", icon: Plus },
    { id: "upload", label: "Upload CSV", icon: Upload },
    { id: "location", label: "Location", icon: MapPin },
    { id: "bank-statement", label: "Bank Statement", icon: FileSpreadsheet },
    { id: "export-excel", label: "Export Excel", icon: FileDown },
  ]

  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Expense Tracker</h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "default" : "ghost"}
                className={cn("w-full justify-start gap-3", activeView === item.id && "bg-blue-600 text-white")}
                onClick={() => setActiveView(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {username && (
            <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
              Logged in as: <span className="font-semibold">{username}</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-full justify-start gap-3">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
