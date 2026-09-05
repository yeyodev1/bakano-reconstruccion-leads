import { getCountries, getCountryCallingCode } from 'libphonenumber-js'

export interface Pais {
  code: string
  name: string
  dial: string
  flag: string
}

/** Código ISO de dos letras → emoji de bandera (regional indicator symbols). */
const flagEmoji = (code: string) =>
  [...code.toUpperCase()].map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0))).join('')

/** Al inicio de la lista: el público real de Bakano. */
const PRIORITY = [
  'EC',
  'CO',
  'PE',
  'MX',
  'AR',
  'CL',
  'VE',
  'BO',
  'PY',
  'UY',
  'CR',
  'PA',
  'DO',
  'US',
  'ES',
]

const nombres: Record<string, string> = {
  EC: 'Ecuador',
  CO: 'Colombia',
  PE: 'Perú',
  MX: 'México',
  AR: 'Argentina',
  CL: 'Chile',
  VE: 'Venezuela',
  BO: 'Bolivia',
  PY: 'Paraguay',
  UY: 'Uruguay',
  CR: 'Costa Rica',
  PA: 'Panamá',
  DO: 'Rep. Dominicana',
  US: 'Estados Unidos',
  ES: 'España',
  BR: 'Brasil',
  IT: 'Italia',
  GB: 'Reino Unido',
  CA: 'Canadá',
  DE: 'Alemania',
  FR: 'Francia',
  PT: 'Portugal',
}

const todos: Pais[] = getCountries().map((code) => ({
  code,
  name: nombres[code] ?? code,
  dial: '+' + getCountryCallingCode(code),
  flag: flagEmoji(code),
}))

export const prioritarios = PRIORITY.map((c) => todos.find((x) => x.code === c)).filter(
  Boolean,
) as Pais[]

const resto = todos
  .filter((c) => !PRIORITY.includes(c.code))
  .sort((a, b) => a.name.localeCompare(b.name))

/** Separador visual entre los prioritarios y el resto. */
export const SEPARADOR = '---'

export const paises: Pais[] = [
  ...prioritarios,
  { code: SEPARADOR, name: '', dial: '', flag: '' },
  ...resto,
]

export const paisPorDefecto = prioritarios[0]
