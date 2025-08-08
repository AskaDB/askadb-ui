import React, { useState } from 'react'
import './App.css'
import QueryEditor from './components/QueryEditor'
import DashboardView from './components/DashboardView'
import LoadingSpinner from './components/LoadingSpinner'
import Header from './components/Header'
import HistoryPanel from './components/HistoryPanel'

interface QueryResult {
  success: boolean
  data?: any[]
  error?: string
  metadata: {
    row_count: number
    columns: string[]
    execution_time_ms: number
  }
}

interface DashboardSuggestion {
  type: string
  title: string
  description: string
  confidence: number
  config: any
  reasoning: string
}

interface QueryHistory {
  id: string
  question: string
  sql: string
  result: QueryResult
  dashboard: DashboardSuggestion
  timestamp: Date
}

function App() {
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([])
  const [currentQuery, setCurrentQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentResult, setCurrentResult] = useState<QueryResult | null>(null)
  const [currentDashboard, setCurrentDashboard] = useState<DashboardSuggestion | null>(null)
  const [showHistory, setShowHistory] = useState<boolean>(false)

  const handleQuerySubmit = async (question: string) => {
    setIsLoading(true)
    setCurrentQuery(question)

    try {
      // Step 1: Convert NL to SQL
      const nlResponse = await fetch('http://localhost:8001/translate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          schema: null,
          context: null,
          examples: null
        })
      })

      if (!nlResponse.ok) {
        throw new Error('Failed to translate query')
      }

      const nlResult = await nlResponse.json()
      const sql = nlResult.query

      // Step 2: Execute SQL query
      const queryResponse = await fetch('http://localhost:8002/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: sql
        })
      })

      if (!queryResponse.ok) {
        throw new Error('Failed to execute query')
      }

      const queryResult: QueryResult = await queryResponse.json()

      if (!queryResult.success) {
        throw new Error(queryResult.error || 'Query execution failed')
      }

      // Step 3: Generate dashboard suggestions
      const dashboardResponse = await fetch('http://localhost:8003/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: queryResult.data,
          question: question
        })
      })

      if (!dashboardResponse.ok) {
        throw new Error('Failed to generate dashboard')
      }

      const dashboardResult = await dashboardResponse.json()
      const dashboard = dashboardResult.suggestions[0] // Get the best suggestion

      // Update state
      setCurrentResult(queryResult)
      setCurrentDashboard(dashboard)

      // Add to history
      const historyItem: QueryHistory = {
        id: Date.now().toString(),
        question: question,
        sql: sql,
        result: queryResult,
        dashboard: dashboard,
        timestamp: new Date()
      }

      setQueryHistory(prev => [historyItem, ...prev])

    } catch (error) {
      console.error('Error processing query:', error)
      setCurrentResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          row_count: 0,
          columns: [],
          execution_time_ms: 0
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleHistoryItemClick = (item: QueryHistory) => {
    setCurrentQuery(item.question)
    setCurrentResult(item.result)
    setCurrentDashboard(item.dashboard)
    setShowHistory(false)
  }

  return (
    <div className="app">
      <Header onHistoryClick={() => setShowHistory(!showHistory)} />
      
      <div className="main-content">
        <div className="left-panel">
          <QueryEditor 
            onSubmit={handleQuerySubmit}
            isLoading={isLoading}
            currentQuery={currentQuery}
          />
          
          {isLoading && <LoadingSpinner />}
          
          {currentResult && currentDashboard && !isLoading && (
            <DashboardView 
              result={currentResult}
              dashboard={currentDashboard}
              question={currentQuery}
            />
          )}
        </div>
        
        {showHistory && (
          <HistoryPanel 
            history={queryHistory}
            onItemClick={handleHistoryItemClick}
            onClose={() => setShowHistory(false)}
          />
        )}
      </div>
    </div>
  )
}

export default App
