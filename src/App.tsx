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
    console.log('Starting new query:', question);
    setIsLoading(true)
    setCurrentQuery(question)
    
    // Clear previous results before starting new query
    setCurrentResult(null)
    setCurrentDashboard(null)

    try {
      // Single call to Orchestrator API which handles: NL->SQL, Execute, Dashboard Suggestion
      const orchestratorResponse = await fetch('http://localhost:8000/', {
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

      if (!orchestratorResponse.ok) {
        throw new Error('Failed to process query')
      }

      const responseJson = await orchestratorResponse.json()
      console.log('Orchestrator response:', responseJson)

      if (!responseJson.success) {
        throw new Error(responseJson.error || 'Processing failed')
      }

      const queryResult: QueryResult = {
        success: true,
        data: responseJson.data,
        error: undefined,
        metadata: responseJson.metadata || {
          row_count: responseJson.data?.length || 0,
          columns: Array.isArray(responseJson.data) && responseJson.data.length > 0 ? Object.keys(responseJson.data[0]) : [],
          execution_time_ms: 0
        }
      }

      const dashboard: DashboardSuggestion | null = responseJson.dashboard || null

      if (!dashboard) {
        throw new Error('Dashboard suggestion missing')
      }

      // Update state
      setCurrentResult(queryResult)
      setCurrentDashboard(dashboard)

      // Add to history
      const historyItem: QueryHistory = {
        id: Date.now().toString(),
        question: question,
        sql: responseJson.sql || '',
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
      setCurrentDashboard(null)
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
