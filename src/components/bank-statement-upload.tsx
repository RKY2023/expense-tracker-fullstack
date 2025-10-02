"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useUploadBankStatementMutation } from "@/store/locationApi"
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react"

export function BankStatementUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadBankStatement, { isLoading, isSuccess, isError, error, data }] = useUploadBankStatementMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      const base64File = await convertFileToBase64(selectedFile)

      await uploadBankStatement({
        file: base64File,
        original_filename: selectedFile.name,
      }).unwrap()

      // Reset file after successful upload
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      console.error("Upload failed:", err)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bank Statement Upload</h1>
          <p className="text-gray-600 dark:text-gray-400">Upload your bank statement for transaction processing</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Bank Statement
            </CardTitle>
            <CardDescription>Select a bank statement file to upload and process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Input */}
            <div className="space-y-2">
              <Label htmlFor="file-upload">Bank Statement File</Label>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept=".pdf,.csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4" />
                    <span className="text-gray-700 dark:text-gray-300">{selectedFile.name}</span>
                    <span className="text-gray-500">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supported formats: PDF, CSV, XLSX, XLS
              </p>
            </div>

            {/* Upload Button */}
            <div>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isLoading}
                className="w-full sm:w-auto"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isLoading ? "Uploading..." : "Upload Statement"}
              </Button>
            </div>

            {/* Success Message */}
            {isSuccess && (
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 dark:text-green-100">Upload Successful</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Your bank statement has been uploaded successfully.
                  </p>
                  {data && (
                    <pre className="text-xs mt-2 p-2 bg-green-100 dark:bg-green-900/40 rounded overflow-auto">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {isError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 dark:text-red-100">Upload Failed</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {error && 'data' in error
                      ? JSON.stringify(error.data)
                      : "An error occurred while uploading the bank statement. Please try again."}
                  </p>
                </div>
              </div>
            )}

            {/* Information Card */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Upload Instructions</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                <li>Ensure your bank statement is in a supported format (PDF, CSV, XLSX, XLS)</li>
                <li>The file should contain transaction details with dates and amounts</li>
                <li>Maximum file size: 10 MB</li>
                <li>The system will automatically process and extract transaction data</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
