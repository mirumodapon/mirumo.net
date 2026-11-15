function toNumber(value: string): number | undefined {
  if (/^0x[0-9a-f]+$/i.test(value)) return Number.parseInt(value.slice(2), 16)
  if (/^\d+$/.test(value)) return Number(value)
  return undefined
}

export function parseStage(hash: string, count: number): number {
  const stage = toNumber(hash.replace(/^#/, ''))
  if (stage === undefined || !Number.isSafeInteger(stage) || stage < 1 || stage > count) return 1
  return stage
}

export function formatStage(stage: number): string {
  return `0x${stage.toString(16).toUpperCase().padStart(2, '0')}`
}
