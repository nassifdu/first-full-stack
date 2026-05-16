'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Pessoa {
  id: number
  nome: string
  email: string
  telefone: string
}

export default function Home() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPessoas()
  }, [])

  const fetchPessoas = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('pessoas')
        .select('*')

      if (fetchError) {
        console.error('Supabase error:', fetchError)
        setError(`${fetchError.message} (code: ${fetchError.code})`)
        return
      }
      setPessoas(data || [])
    } catch (err) {
      console.error('Unexpected error:', err)
      setError(err instanceof Error ? err.message : JSON.stringify(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Pessoas</h1>
          <button
            onClick={fetchPessoas}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">
              Error: {error}
            </p>
            <p className="text-sm text-red-600 mt-2">
              Possible causes:
            </p>
            <ul className="text-sm text-red-600 list-disc list-inside mt-1">
              <li>The "pessoas" table doesn't exist in your Supabase database</li>
              <li>Row-level security (RLS) is enabled and blocking access</li>
              <li>Your Supabase credentials are incorrect</li>
              <li>The table name is case-sensitive</li>
            </ul>
            <p className="text-xs text-red-500 mt-3">
              Check the browser console (F12) for more details
            </p>
          </div>
        )}

        {!loading && !error && pessoas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No people found</p>
          </div>
        )}

        {!loading && !error && pessoas.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Telefone</th>
                </tr>
              </thead>
              <tbody>
                {pessoas.map((pessoa) => (
                  <tr key={pessoa.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900">{pessoa.id}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{pessoa.nome}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{pessoa.email}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{pessoa.telefone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
