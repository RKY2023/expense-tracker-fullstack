"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, CheckCircle, AlertCircle } from "lucide-react"
import { supabase, type Category } from "@/lib/supabase"

interface AddExpenseFormProps {
  categories: Category[]
  onExpenseAdded: () => void
}

export function AddExpenseForm({ categories, onExpenseAdded }: AddExpenseFormProps) {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category_id: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.description || !formData.category_id) {
      setSubmitStatus("error")
      setSubmitMessage("Please fill in all required fields")
      return
    }

    setSubmitting(true)
    setSubmitStatus("idle")

    try {
      const { error } = await supabase.from("expenses").insert([
        {
          amount: Number.parseFloat(formData.amount),
          description: formData.description,
          category_id: Number.parseInt(formData.category_id),
          date: formData.date,
        },
      ])

      if (error) throw error

      setSubmitStatus("success")
      setSubmitMessage("Expense added successfully!")
      setFormData({
        amount: "",
        description: "",
        category_id: "",
        date: new Date().toISOString().split("T")[0],
      })
      onExpenseAdded()
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage(error instanceof Error ? error.message : "Failed to add expense")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add Expense</h1>
        <p className="text-gray-600">Record a new expense</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>New Expense</CardTitle>
            <CardDescription>Enter the details of your expense</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Enter expense description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <>
                    <Plus className="mr-2 h-4 w-4 animate-spin" />
                    Adding Expense...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </>
                )}
              </Button>

              {submitStatus !== "idle" && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    submitStatus === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {submitStatus === "success" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <span className="text-sm">{submitMessage}</span>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
