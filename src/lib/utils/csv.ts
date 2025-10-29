export function toCSV(rows: Record<string, unknown>[], headers?: string[]) {
  if (!rows || rows.length === 0) return ''
  const cols = headers ?? Array.from(new Set(rows.flatMap((r) => Object.keys(r))))
  const esc = (v: unknown) => {
    const s = v === undefined || v === null ? '' : String(v)
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
    return s
  }
  const head = cols.join(',')
  const body = rows.map((r) => cols.map((c) => esc((r as any)[c])).join(',')).join('\n')
  return head + '\n' + body
}

export function downloadCSV(filename: string, csv: string) {
  if (typeof window === 'undefined') return
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}


