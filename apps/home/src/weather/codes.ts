const table: [codes: number[], icon: string, text: string][] = [
  [[0], 'sun', 'CLEAR'],
  [[1], 'sun-low', 'MOSTLY CLEAR'],
  [[2], 'haze', 'PARTLY CLOUDY'],
  [[3], 'cloud', 'OVERCAST'],
  [[45, 48], 'cloud-fog', 'FOG'],
  [[51, 53, 55, 56, 57], 'mist', 'DRIZZLE'],
  [[61, 63, 65, 66, 67, 80, 81, 82], 'cloud-rain', 'RAIN'],
  [[71, 73, 75, 77, 85, 86], 'cloud-snow', 'SNOW'],
  [[95, 96, 99], 'cloud-storm', 'THUNDER'],
]

export function describeWeather(code: number): { icon: string; text: string } {
  const hit = table.find(([codes]) => codes.includes(code))
  return hit ? { icon: hit[1], text: hit[2] } : { icon: 'cloud-question', text: 'UNKNOWN' }
}
