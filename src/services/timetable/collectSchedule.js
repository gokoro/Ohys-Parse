// The original source is from Seia-soto's ohys-api
// https://github.com/seia-soto/ohys-api/

const axios = require('axios').default

const { currentYear, currentSeason, ohysGithubUrl } = require('../../config')

const days = [
  ['月'],
  ['火'],
  ['水'],
  ['木'],
  ['金', '金'],
  ['土'],
  ['日'],
  ['SP'],
  ['월'],
  ['화'],
  ['수'],
  ['목'],
  ['금'],
  ['토'],
  ['일'],
  ['SP'],
  ['MON'],
  ['TUE'],
  ['WED'],
  ['THU'],
  ['FRI'],
  ['SAT'],
  ['SUN'],
  ['SP'],
  ['UNK'],
]

const dividers = ['/', '[', ']']
const aggravateDividers = ['[', ']']
const comments = ['//', '/{', '/ [', ' / ']

const replaceDividers = (text) => {
  text = text.replace(/【|「|『/gi, '[')
  text = text.replace(/\】|\」|\』/gi, ']')
  text = text.replace(/\#/gi, '[')
  text = text.replace(/\｜/gi, '][')

  return text
}

const removeUselessDividers = (text) => {
  for (let i = 0, l = aggravateDividers.length; i < l; i++) {
    const divider = aggravateDividers[i]

    if (text.startsWith(divider)) text = text.slice(1)
    if (text.endsWith(divider)) text = text.slice(0, text.length - 1)
  }

  return text
}

const parseSchedule = async (opts = {}) => {
  opts.url = opts.url || ''
  opts.repo = opts.repo || 'ohyongslck/annie'
  opts.branch = opts.branch || 'master'
  opts.year = opts.year || new Date().getFullYear()
  opts.quarter = opts.quarter || 1

  // NOTE: build url;
  const url =
    opts.url ||
    ohysGithubUrl ||
    `https://raw.githubusercontent.com/${opts.repo}/${opts.branch}/${opts.year}@${opts.quarter}`

  // NOTE: request;
  const res = await axios.get(url)
  const text = replaceDividers(res.data)
  const lines = text.split('\n')

  // NOTE: parse data;
  const schedules = []
  let day = -1

  for (let i = 0, l = lines.length; i < l; i++) {
    const line = lines[i]

    if (!line) continue

    if (line.includes('------')) break // If the loop meets divider

    // NOTE: if current line is representing day;
    for (let k = 0, s = days.length; k < s; k++) {
      for (const dayCognizer of days[k]) {
        if (line.toUpperCase().startsWith(dayCognizer)) {
          day = k % 8
          break
        }
      }
    }

    const title = {}
    let pruned = (' ' + line).slice(1)
    let comment
    let date
    let time
    let broadcaster

    for (let k = 0, s = comments.length; k < s; k++) {
      ;[pruned, ...comment] = pruned.split(comments[k])

      // NOTE: resolve full string;
      comment = comment.join(comments[k])
    }

    for (let k = 0, s = dividers.length; k < s; k++) {
      const divider = dividers[k]
      const tokens = pruned.split(divider).reverse()

      for (let n = 0, z = tokens.length; n < z; n++) {
        const token = removeUselessDividers(
          tokens[n]
            .slice(1) // NOTE: replace divider;
            .trim()
        )

        const timeRegex = /\d{1,2}:\d{1,2}/i
        const dateRegex = /(\d{1,2}\/\d{1,2})|20\d{1,2}(?!\))/
        const yearRegex = /\d{3}\s(?=\d{1,2}:\d{1,2})/

        if (!time) {
          const possible = token.match(timeRegex) || []

          time = possible[0]
        } else if (!date) {
          const possible =
            token.match(dateRegex) || token.match(yearRegex) || []

          date = possible[0]

          if (
            !broadcaster &&
            token.match(timeRegex) &&
            (token.match(dateRegex) || token.match(yearRegex))
          ) {
            const [, , possible] = token.split(' ')

            broadcaster = possible
          }
        } else if (
          token &&
          token.match(/[a-zA-Z가-힣一-龠ぁ-ゔァ-ヴーａ-ｚＡ-Ｚ０-９々〆〤]/u)
        ) {
          if (!title.promised) {
            title.promised = token
          }
          if (!title.English && token.match(/[a-z]/i)) {
            title.English = token
          }
          if (!title.Korean && token.match(/[가-힣]/iu)) {
            title.Korean = token
          }
          if (
            !title.Japanese &&
            token.match(/[一-龠ぁ-ゔァ-ヴーａ-ｚＡ-Ｚ０-９々〆〤]/iu)
          ) {
            title.Japanese = token
          }
        }
      }
    }

    if (!title.promised) {
      continue
    }

    schedules.push({
      day,
      date,
      time,
      broadcaster,
      name: title.promised,
    })
  }

  return schedules
}

module.exports = async () => {
  const shortenDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  const parsed = await parseSchedule({
    year: currentYear,
    quarter: currentSeason,
  })

  const form = {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  }

  const sundayItems = []

  parsed.forEach((item) => {
    let { day: dayByNumber, time, broadcaster, name } = item
    let [hour, minute] = time.split(':')
    let isSunOver = false

    if (dayByNumber >= 7) {
      return
    }

    hour = Number(hour)
    minute = Number(minute)

    if (hour >= 24) {
      hour -= 24
      dayByNumber === 6
        ? ((dayByNumber = 0), (isSunOver = true))
        : (dayByNumber += 1)
    }

    const dayOfItem = shortenDays[dayByNumber]

    const addZero = (num) => (num < 10 ? `0${num}` : num.toString())
    const leachFileName = (str) => str.replace(/[\\/:\*\?"<>\|]/g, '')

    const itemToPut = {
      title: leachFileName(name),
      time: `${addZero(hour)}:${addZero(minute)}`,
      broadcaster,
    }

    if (isSunOver) {
      sundayItems.push(itemToPut)
      return
    }

    form[dayOfItem].push(itemToPut)
    return
  })

  form.mon = [...sundayItems, ...form.mon]

  return form
}
