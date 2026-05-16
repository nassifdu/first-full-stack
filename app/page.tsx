'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { supabase } from '@/lib/supabase'

interface Pessoa {
  id: number
  nome: string
  email: string
  telefone: string
}

const columnHelper = createColumnHelper<Pessoa>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('nome', {
    header: 'Nome',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('telefone', {
    header: 'Telefone',
    cell: info => info.getValue(),
  }),
]

export default function Home() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

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

  const data = useMemo(() => pessoas, [pessoas])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Pessoas</h1>
            <p className="text-sm text-gray-500 mt-0.5">People directory</p>
          </div>
          <button
            onClick={fetchPessoas}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">{error}</p>
              <p className="text-xs text-red-600 mt-1">Check the browser console for more details.</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-xs">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
                </svg>
                <input
                  value={globalFilter}
                  onChange={e => setGlobalFilter(e.target.value)}
                  placeholder="Search…"
                  className="w-full pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {table.getFilteredRowModel().rows.length} of {pessoas.length} results
              </span>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="border-b border-gray-100 bg-gray-50/70">
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-5 py-3 text-left">
                        {header.isPlaceholder ? null : (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-blue-600 transition-colors ${header.column.getCanSort() ? 'cursor-pointer' : 'cursor-default'}`}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <span className="text-gray-300">
                              {{ asc: '▲', desc: '▼' }[header.column.getIsSorted() as string] ?? '↕'}
                            </span>
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-50">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-5 py-16 text-center text-sm text-gray-400">
                      No results found
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                      {row.getVisibleCells().map((cell, i) => (
                        <td key={cell.id} className={`px-5 py-3.5 text-sm ${i === 0 ? 'font-medium text-gray-900 w-16' : 'text-gray-600'}`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Skeleton while loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="h-8 w-48 bg-gray-100 rounded-lg" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-6 px-5 py-4 border-b border-gray-50">
                <div className="h-4 w-8 bg-gray-100 rounded" />
                <div className="h-4 w-32 bg-gray-100 rounded" />
                <div className="h-4 w-48 bg-gray-100 rounded" />
                <div className="h-4 w-28 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
