"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { supabase, type Category } from "@/lib/supabase"

interface CSVUploadProps {
  onUploadComplete: () => void
  categories: Category[]
}

export function CSVUpload({ onUploadComplete, categories }: CSVUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [uploadMessage, setUploadMessage] = useState("")
  const [preview, setPreview] = useState<any[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      previewCSV(selectedFile)
    } else {
      alert("Please select a valid CSV file")
    }
  }

  const previewCSV = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim())
      const rows = lines.slice(1, 6).map((line) => {
        const values = line.split(",").map((v) => v.trim())
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] || ""
          return obj
        }, {} as any)
      })
      setPreview(rows)
    }
    reader.readAsText(file)
  }

  const findCategoryId = (categoryName: string): number => {
    const category = categories.find((cat) => cat.name.toLowerCase() === categoryName.toLowerCase())
    return category?.id || categories.find((cat) => cat.name === "Other")?.id || 1
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadStatus("idle")

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result as string
        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

        // Expected headers: amount, description, category, date
        const requiredHeaders = ["amount", "description", "category", "date"]
        const missingHeaders = requiredHeaders.filter((header) => !headers.some((h) => h.includes(header)))

        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
        }

        const expenses = []
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim())
          const row = headers.reduce((obj, header, index) => {
            obj[header] = values[index] || ""
            return obj
          }, {} as any)

          // Find the correct column names
          const amountCol = headers.find((h) => h.includes("amount")) || "amount"
          const descCol = headers.find((h) => h.includes("description")) || "description"
          const categoryCol = headers.find((h) => h.includes("category")) || "category"
          const dateCol = headers.find((h) => h.includes("date")) || "date"

          const amount = Number.parseFloat(row[amountCol])
          const description = row[descCol]
          const categoryName = row[categoryCol]
          const date = row[dateCol]

          if (!isNaN(amount) && description && date) {
            expenses.push({
              amount,
              description,
              category_id: findCategoryId(categoryName),
              date: new Date(date).toISOString().split("T")[0],
            })
          }
        }

        if (expenses.length === 0) {
          throw new Error("No valid expense records found in the CSV file")
        }

        const { error } = await supabase.from("expenses").insert(expenses)

        if (error) throw error

        setUploadStatus("success")
        setUploadMessage(`Successfully uploaded ${expenses.length} expenses`)
        onUploadComplete()
        setFile(null)
        setPreview([])
      }
      reader.readAsText(file)
    } catch (error) {
      setUploadStatus("error")
      setUploadMessage(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload CSV</h1>
        <p className="text-gray-600">Import your expenses from a CSV file</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>Upload a CSV file with columns: amount, description, category, date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="csv-file">Select CSV File</Label>
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} className="mt-1" />
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
            )}

            <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
              {uploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </>
              )}
            </Button>

            {uploadStatus !== "idle" && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  uploadStatus === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {uploadStatus === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                <span className="text-sm">{uploadMessage}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSV Format</CardTitle>
            <CardDescription>Required format for your CSV file</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Required Columns:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>
                    • <strong>amount</strong> - Expense amount (e.g., 25.50)
                  </li>
                  <li>
                    • <strong>description</strong> - Expense description
                  </li>
                  <li>
                    • <strong>category</strong> - Category name
                  </li>
                  <li>
                    • <strong>date</strong> - Date (YYYY-MM-DD format)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-foreground">Example:</h4>
                <div className="bg-muted p-3 rounded text-sm font-mono text-muted-foreground">
                  amount,description,category,date
                  <br />
                  25.50,Lunch,Food & Dining,2024-01-15
                  <br />
                  45.00,Gas,Transportation,2024-01-14
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Available Categories:</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-2 py-1 text-xs rounded-full"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {preview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>First 5 rows of your CSV file</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {Object.keys(preview[0]).map((header) => (
                      <th key={header} className="text-left p-2 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, index) => (
                    <tr key={index} className="border-b">
                      {Object.values(row).map((value: any, cellIndex) => (
                        <td key={cellIndex} className="p-2">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
