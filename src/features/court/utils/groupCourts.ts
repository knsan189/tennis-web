import { getWeekOfMonth } from "date-fns"
import type { ReservedCourt } from "../courtApiSlice"

export type GroupedCourts = Record<number, Record<string, ReservedCourt[]>>

export const groupCourtsByWeek = (courts: ReservedCourt[]) => {
  const result: Record<string, GroupedCourts> = {}
  for (const court of courts) {
    const date = new Date(court.year, court.month - 1, court.date)
    const week = getWeekOfMonth(date, { weekStartsOn: 1 }) // 월요일 시작으로 주차 계산

    const weekKey = `${court.year}-${court.month}-${week}` // ex) "2025-5-1"

    if (!result[weekKey]) {
      result[weekKey] = {}
    }

    const dateKey = date.getTime() // 날짜별로 다시 그룹핑
    if (!result[weekKey][dateKey]) {
      result[weekKey][dateKey] = {}
    }
    if (!result[weekKey][dateKey][court.time]) {
      result[weekKey][dateKey][court.time] = []
    }

    result[weekKey][dateKey][court.time].push(court)
  }
  return result
}
