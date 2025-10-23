"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  useUploadBankStatementMutation,
  useGetBankStatementsQuery,
  useProcessBankStatementMutation,
  useGetBankTransactionsQuery
} from "@/store/locationApi"
import { Upload, FileText, CheckCircle, AlertCircle, X, RefreshCw, Clock, Database, Calendar, DollarSign } from "lucide-react"

export function BankStatementUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedStatementId, setSelectedStatementId] = useState<number | null>(null)
  const [uploadBankStatement, { isLoading, isSuccess, isError, error, data }] = useUploadBankStatementMutation()
  const { data: bankStatements, isLoading: isLoadingStatements, refetch: refetchStatements } = useGetBankStatementsQuery()
  const [processBankStatement, { isLoading: isProcessing }] = useProcessBankStatementMutation()
  const { data: transactions, isLoading: isLoadingTransactions, refetch: refetchTransactions } = useGetBankTransactionsQuery(selectedStatementId || undefined)
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

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      await uploadBankStatement({
        file: selectedFile,
      }).unwrap()

      // Reset file after successful upload
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      
      refetchStatements()
    } catch (err) {
      console.error("Upload failed:", err)
    }
  }

  const handleProcess = async (statementId: number) => {
    try {
      await processBankStatement(statementId).unwrap()
      // Refetch statements and transactions after processing
      refetchStatements()
      if (selectedStatementId === statementId) {
        refetchTransactions()
      }
    } catch (err) {
      console.error("Processing failed:", err)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount))
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bank Statement Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">Upload, process, and view your bank statement transactions</p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="process">
              <RefreshCw className="w-4 h-4 mr-2" />
              Process
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <Database className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Section 1: Upload */}
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Bank Statement
                </CardTitle>
                <CardDescription>Select a bank statement file to upload</CardDescription>
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
                        Your bank statement has been uploaded successfully. Go to the Process tab to process it.
                      </p>
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
                    <li>After uploading, process the statement to extract transactions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section 2: Process */}
          <TabsContent value="process">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Process Bank Statements
                </CardTitle>
                <CardDescription>View and process uploaded bank statements</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingStatements ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Loading statements...</span>
                  </div>
                ) : bankStatements && bankStatements.results.length > 0 ? (
                  <div className="space-y-4">
                    {bankStatements.results.map((statement) => (
                      <div
                        key={statement.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="w-5 h-5 text-blue-500" />
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {statement.original_filename}
                              </h3>
                              {getStatusBadge(statement.status)}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div>
                                <span className="font-medium">Uploaded:</span> {formatDate(statement.created_at)}
                              </div>
                              {statement.processed_at && (
                                <div>
                                  <span className="font-medium">Processed:</span> {formatDate(statement.processed_at)}
                                </div>
                              )}
                              <div>
                                <span className="font-medium">Transactions:</span> {statement.transaction_count}
                              </div>
                              <div>
                                <span className="font-medium">Encrypted:</span> {statement.is_encrypted ? 'Yes' : 'No'}
                              </div>
                            </div>
                            {statement.error_message && (
                              <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                                <span className="font-medium">Error:</span> {statement.error_message}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleProcess(statement.id)}
                              disabled={isProcessing || statement.status === 'processing'}
                            >
                              <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                              {statement.status === 'pending' ? 'Process' : 'Reprocess'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedStatementId(statement.id)
                              }}
                            >
                              View Transactions
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No bank statements uploaded yet.</p>
                    <p className="text-sm mt-2">Go to the Upload tab to upload your first bank statement.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section 3: Transactions */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Bank Transactions
                </CardTitle>
                <CardDescription>
                  {selectedStatementId
                    ? `Viewing transactions for statement ID: ${selectedStatementId}`
                    : 'Select a bank statement from the Process tab to view its transactions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedStatementId ? (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No bank statement selected.</p>
                    <p className="text-sm mt-2">Go to the Process tab and click "View Transactions" on a statement.</p>
                  </div>
                ) : isLoadingTransactions ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Loading transactions...</span>
                  </div>
                ) : transactions && transactions.results.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total: {transactions.count} transactions
                      </p>
                      <Button size="sm" variant="outline" onClick={() => setSelectedStatementId(null)}>
                        Clear Selection
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {transactions.results.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {new Date(transaction.transaction_date).toLocaleDateString()}
                                </span>
                                <Badge variant={transaction.transaction_type === 'credit' ? 'default' : 'secondary'}>
                                  {transaction.transaction_type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {transaction.description}
                              </p>
                              {transaction.balance && (
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  Balance: {formatCurrency(transaction.balance)}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className={`text-lg font-semibold ${
                                transaction.transaction_type === 'credit'
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {transaction.transaction_type === 'credit' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No transactions found for this statement.</p>
                    <p className="text-sm mt-2">The statement may need to be processed first.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
