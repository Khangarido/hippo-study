'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Attempt = Database['public']['Tables']['attempts']['Row']
type Question = Database['public']['Tables']['questions']['Row']
type AttemptAnswer = Database['public']['Tables']['attempt_answers']['Row']

interface AttemptWithAnswers extends Attempt {
  attempt_answers: (AttemptAnswer & { question: Question })[]
}

export default function ResultsPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const attemptId = params.attemptId as string
  
  const [attempt, setAttempt] = useState<AttemptWithAnswers | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCorrectOnly, setShowCorrectOnly] = useState(false)

  useEffect(() => {
    if (!user || !attemptId) {
      router.push('/login')
      return
    }

    fetchAttemptData()
  }, [user, attemptId, router])

  const fetchAttemptData = async () => {
    // Fetch attempt with answers and questions
    const { data: attemptData, error: attemptError } = await supabase
      .from('attempts')
      .select(`
        *,
        attempt_answers (
          *,
          question:questions (*)
        )
      `)
      .eq('id', attemptId)
      .eq('user_id', user!.id)
      .single()

    if (attemptError) {
      console.error('Error fetching attempt:', attemptError)
      router.push('/dashboard')
      return
    }

    setAttempt(attemptData)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🦛</div>
          <div className="text-xl text-gray-700">Loading results...</div>
        </div>
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Results Not Found</h2>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const percentage = Math.round((attempt.score / attempt.total) * 100)
  const passed = percentage >= 60
  const correctAnswers = attempt.attempt_answers.filter(a => a.is_correct)
  const incorrectAnswers = attempt.attempt_answers.filter(a => !a.is_correct)

  const answersToShow = showCorrectOnly ? correctAnswers : attempt.attempt_answers

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                ← Back to Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🦛</span>
                <h1 className="text-xl font-bold text-gray-900">Exam Results</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {passed ? '🎉' : '📚'}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{attempt.score}</div>
                <div className="text-sm text-gray-700">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{attempt.total}</div>
                <div className="text-sm text-gray-700">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
                <div className="text-sm text-gray-700">Score</div>
              </div>
              <div className="text-center">
                <div className={`inline-flex px-4 py-2 text-lg font-semibold rounded-full ${
                  passed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {passed ? 'PASSED' : 'FAILED'}
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <Link
                href="/exam"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                🔄 Try Again
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCorrectOnly(false)}
              className={`px-4 py-2 rounded-md transition-colors ${
                !showCorrectOnly
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Questions ({attempt.attempt_answers.length})
            </button>
            <button
              onClick={() => setShowCorrectOnly(true)}
              className={`px-4 py-2 rounded-md transition-colors ${
                showCorrectOnly
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Correct Only ({correctAnswers.length})
            </button>
            {!showCorrectOnly && (
              <div className="flex items-center px-4 py-2 text-sm text-gray-700">
                <span className="text-red-600 font-semibold">{incorrectAnswers.length} incorrect</span>
              </div>
            )}
          </div>
        </div>

        {/* Answers List */}
        <div className="space-y-4">
          {answersToShow.map((answer, index) => (
            <div
              key={answer.id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                answer.is_correct ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      Question {index + 1}
                    </span>
                    <span className="inline-flex px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                      {answer.question.category || 'General'}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      answer.is_correct
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {answer.is_correct ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {answer.question.question}
                  </h3>
                  
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((option) => {
                      const optionText = answer.question[`option_${option.toLowerCase()}` as keyof Question] as string
                      const isCorrectOption = option === answer.question.correct_answer
                      const isSelectedOption = option === answer.selected_answer

                      return (
                        <div
                          key={option}
                          className={`flex items-center p-3 rounded-md border ${
                            isCorrectOption
                              ? 'bg-green-50 border-green-200'
                              : isSelectedOption && !answer.is_correct
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <span className="font-medium text-gray-900 mr-2">{option}.</span>
                          <span className="flex-1">{optionText}</span>
                          {isCorrectOption && (
                            <span className="text-green-600 font-semibold">✓ Correct</span>
                          )}
                          {isSelectedOption && !isCorrectOption && (
                            <span className="text-red-600 font-semibold">✗ Your Answer</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
