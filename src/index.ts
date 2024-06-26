type ReturnTypeFetesMetropole = ReturnType<typeof fetes>
type ReturnTypeFetesAlsace = ReturnTypeFetesMetropole & ReturnType<typeof fetesAlsace>
type Zones = "métropole" | "alsace-moselle"

const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000)

const paques = function (year: number) {
  const a = year % 19
  const century = Math.floor(year / 100)
  const yearsAfterCentury = year % 100
  const d =
    (19 * a + century - Math.floor(century / 4) - Math.floor((Math.floor(century - (century + 8) / 25) + 1) / 3) + 15) %
    30
  const e = (32 + 2 * (century % 4) + 2 * Math.floor(yearsAfterCentury / 4) - d - (yearsAfterCentury % 4)) % 7
  const f = d + e - 7 * Math.floor((a + 11 * d + 22 * e) / 451) + 114
  const month = Math.floor(f / 31)
  const day = (f % 31) + 1

  return new Date(year, month - 1, day)
}

const fetes = (year: number) => ({
  Armistice: new Date(year, 10, 11),
  Ascension: addDays(paques(year), 39),
  Assomption: new Date(year, 7, 15),
  "Fête Nationale": new Date(year, 6, 14),
  "Fête du travail": new Date(year, 4, 1),
  "Jour de l'an": new Date(year, 0, 1),
  "Lundi de Pentecôte": addDays(paques(year), 50),
  "Lundi de Pâques": addDays(paques(year), 1),
  Noël: new Date(year, 11, 25),
  Toussaint: new Date(year, 10, 1),
  "Victoire des alliés": new Date(year, 4, 8),
})

const fetesAlsace = (year: number) => ({
  "Saint Étienne": new Date(year, 11, 26),
  "Vendredi Saint": addDays(paques(year), -2),
})

/**
 * Get french bank holidays by year and zone.
 *
 * @param year year you're interested in
 * @param options the zone you're interested in ("métropole" by default)
 */
function joursFeries(year: number): ReturnTypeFetesMetropole
function joursFeries(year: number, options: { zone: "métropole" }): ReturnTypeFetesMetropole
function joursFeries(year: number, options: { zone: "alsace-moselle" }): ReturnTypeFetesAlsace
function joursFeries(year: number, options: { zone: Zones } = { zone: "métropole" }): ReturnTypeFetesMetropole | ReturnTypeFetesAlsace
{
  if (options.zone === "alsace-moselle") {
    return { ...fetes(year), ...fetesAlsace(year) }
  } else {
    return fetes(year)
  }
}

/**
 * Check if a date is a holiday in France.
 *
* @param date date you're interested in
 * @param options the zone you're interested in ("métropole" by default)
 */
function isJourFerie(date: Date): boolean
function isJourFerie(date: Date, options: { zone: Zones } = { zone: "métropole" } ): boolean 
{
  const year = date.getFullYear()
  let joursFeriesByYear;
  if (options.zone === "alsace-moselle") {
    joursFeriesByYear = joursFeries(year, { zone: 'alsace-moselle' })
    } else {
    joursFeriesByYear = joursFeries(year, { zone: 'métropole' })
  }
  return Object.values(joursFeriesByYear).some((jourFerie) => jourFerie.getTime() === date.getTime())
}

export { joursFeries, isJourFerie }
