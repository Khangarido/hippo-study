'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Question = Database['public']['Tables']['questions']['Row']

export default function ExamPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchQuestions()
  }, [user, router])

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching questions:', error)
    } else {
      // Take a random subset of 20 questions if there are more
      const shuffled = [...(data || [])].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, Math.min(20, shuffled.length))
      setQuestions(selected)
    }
    setLoading(false)
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    
    // Calculate score
    let score = 0
    const attemptAnswers: any[] = []

    questions.forEach(question => {
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer === question.correct_answer
      
      if (isCorrect) score++
      
      attemptAnswers.push({
        question_id: question.id,
        selected_answer: userAnswer || null,
        is_correct: isCorrect
      })
    })

    // Save attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('attempts')
      .insert({
        user_id: user!.id,
        score: score,
        total: questions.length
      })
      .select()
      .single()

    if (attemptError) {
      console.error('Error saving attempt:', attemptError)
      setSubmitting(false)
      return
    }

    // Save attempt answers
    const { error: answersError } = await supabase
      .from('attempt_answers')
      .insert(
        attemptAnswers.map(answer => ({
          ...answer,
          attempt_id: attempt.id
        }))
      )

    if (answersError) {
      console.error('Error saving attempt answers:', answersError)
    }

    const percentage = Math.round((score / questions.length) * 100)
    const passed = percentage >= 60

    setResults({
      score,
      total: questions.length,
      percentage,
      passed,
      attemptId: attempt.id
    })

    setShowResults(true)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🦛</div>
          <div className="text-xl text-gray-600">Loading questions...</div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Questions Available</h2>
          <p className="text-gray-600 mb-6">Please ask an admin to add some questions!</p>
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

  if (showResults && results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">
              {results.passed ? '🎉' : '📚'}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {results.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h2>
            <div className="space-y-4 mb-6">
              <div className="text-2xl font-bold text-gray-900">
                {results.score} / {results.total}
              </div>
              <div className="text-xl text-gray-600">
                {results.percentage}%
              </div>
              <div className={`inline-flex px-4 py-2 text-lg font-semibold rounded-full ${
                results.passed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {results.passed ? 'PASSED' : 'FAILED'}
              </div>
            </div>
            <div className="space-y-3">
              <Link
                href={`/results/${results.attemptId}`}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                📊 Review Answers
              </Link>
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                🏠 Back to Dashboard
              </Link>
              <button
                onClick={() => {
                  setShowResults(false)
                  setCurrentQuestionIndex(0)
                  setAnswers({})
                  window.location.reload()
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                🔄 Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                ← Back
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🦛</span>
                <h1 className="text-xl font-bold text-gray-900">Hippo Study Exam</h1>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                {currentQuestion.category || 'General'}
              </span>
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3 mb-8">
            {['A', 'B', 'C', 'D'].map((option) => (
              <label
                key={option}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  answers[currentQuestion.id] === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex-1">
                  <span className="font-medium text-gray-900 mr-2">{option}.</span>
                  {currentQuestion[`option_${option.toLowerCase()}` as keyof Question] as string}
                </span>
              </label>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="text-sm text-gray-600">
              {Object.keys(answers).length} of {questions.length} answered
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length !== questions.length}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
