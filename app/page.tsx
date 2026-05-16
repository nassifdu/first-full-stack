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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
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
            <p className="text-red-800 font-semibold">Error: {error}</p>
            <p className="text-xs text-red-500 mt-2">Check the browser console (F12) for more details</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-4">
              <input
                value={globalFilter}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search all columns…"
                className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} className="bg-gray-100 border-b">
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-sm font-semibold text-gray-700 select-none"
                        >
                          {header.isPlaceholder ? null : (
                            <button
                              className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${header.column.getCanSort() ? 'cursor-pointer' : ''}`}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              <span className="text-gray-400">
                                {{ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string] ?? ' ↕'}
                              </span>
                            </button>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                        No people found
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map(row => (
                      <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="px-6 py-3 text-sm text-gray-700">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-500">
                {table.getFilteredRowModel().rows.length} of {pessoas.length} row(s)
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
