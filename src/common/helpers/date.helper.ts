import { HttpStatus } from '@nestjs/common';
import { DateTime, IANAZone } from 'luxon';
import { ExceptionHelper } from './ExceptionHelper';
import { NestHelper } from './NestHelper';

export class DateHelper {
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // constructor() {}

    // static getInstance(): DateHelper {
    //   DateHelper.instance = DateHelper.instance || new DateHelper();
    //   return DateHelper.instance;
    // }

    now(zone: string): Date {
        return DateTime.now().setZone(zone).toJSDate();
    }
    stringDateToDateZoneToUTC(date: string, zone: string): Date {
        return DateTime.fromISO(date).setZone(zone).toJSDate();
    }
    stringDateToDateZone(date: string, zone: string): Date {
        return DateTime.fromISO(date).setZone(zone).toJSDate();
    }

    add30Days(): Date {
        return DateTime.now().plus({ days: 30 }).toJSDate();
    }
    addTimeByType(date: Date, duration: number, type: string): Date {
        if (type == 'hr') {
            return DateTime.fromJSDate(date).setZone('UTC').plus({ hours: duration }).toJSDate();
        } else if (type == 'min') {
            return DateTime.fromJSDate(date).setZone('UTC').plus({ minutes: duration }).toJSDate();
        }
    }
    add1Days(): Date {
        return DateTime.now().plus({ days: 1 }).toJSDate();
    }
    add1DaysFromDate(date: string): Date {
        return DateTime.fromISO(date).setZone().plus({ days: 1 }).toJSDate();
    }
    minus1Days(date: Date): Date {
        return DateTime.fromJSDate(date).minus({ days: 1 }).toJSDate();
    }
    add20Mins(): Date {
        return DateTime.now().plus({ minutes: 20 }).toJSDate();
    }
    minus6hour(date: Date): Date {
        return DateTime.fromJSDate(date).minus({ hour: 6 }).toJSDate();
    }
    addMins(date: Date, mins: number): Date {
        return DateTime.fromJSDate(date).plus({ minutes: mins }).toJSDate();
    }

    fromString(dateString: string, format: string, zone: string): Date {
        const date = DateTime.fromFormat(dateString, format, {
            zone: zone,
            setZone: true,
        });
        return date.toJSDate();
    }

    fromDate(date: Date, zone: string): Date {
        return DateTime.fromJSDate(date).setZone(zone).startOf('day').toJSDate();
    }

    formatDateZone(date: Date, zone: string): Date {
        return DateTime.fromJSDate(date).setZone(zone).toJSDate();
    }

    test(date: string, zone: string): Date {
        const newDate = new Date(date);
        const date1 = newDate.toISOString();
        let time = DateTime.fromISO(date1).setZone(zone).plus({ days: -1 }).plus({ hours: -6 }).toJSDate();
        return time;
    }

    startOfToday(zone: string): string {
        return DateTime.now().setZone(zone).startOf('day').toISO();
    }
    startOfDate(date: Date, zone: string): Date {
        return DateTime.fromJSDate(date).setZone(zone).startOf('day').toJSDate();
    }
    startOfDateString(date: Date, zone: string): Date {
        return DateTime.fromJSDate(date).setZone(zone).startOf('day').toISO();
    }
    endOfDate(date: Date, zone: string): Date {
        return DateTime.fromJSDate(date).setZone(zone).endOf('day').toJSDate();
    }
    endOfDateString(date: Date, zone: string): Date {
        return DateTime.fromJSDate(date).setZone(zone).endOf('day').toISO();
    }

    startOfDaysAgo(zone: string, days: number): Date {
        return DateTime.now().plus({ days: days }).setZone(zone).startOf('day').toJSDate();
    }

    endOfToday(zone: string): Date {
        return DateTime.now().setZone(zone).endOf('day').toJSDate();
    }
    endOfTodayString(zone: string): string {
        return DateTime.now().setZone(zone).endOf('day').toJSDate().toISOString();
    }

    getDayName(date: Date): string {
        return this.days[date.getDay()];
    }

    getNowInTimestamp(): number {
        return DateTime.now().setZone('UTC').toUTC().toMillis();
    }
    getSixMonthsInTimestamp(): number {
        return DateTime.now().plus({ days: 180 }).setZone('UTC').toUTC().toMillis();
    }
    getOneMonthInTimestamp(): number {
        return DateTime.now().plus({ days: 30 }).setZone('UTC').toUTC().toMillis();
    }

    getDateInTimestamp(date: Date): number {
        const date2 = date.toISOString();
        return DateTime.fromISO(date2).toMillis();
    }


    getNowInISOString(): string {
        return DateTime.now().setZone('UTC').toJSDate().toISOString();
    }

    getTimeInISOString(date: Date): string {
        return DateTime.fromJSDate(date).setZone('UTC').toJSDate().toISOString();
    }

    convertToTime(time: string): void {
        console.log(DateTime.fromFormatExplain(time, 'HH:mm a'));
    }

    dayAndTime(zone?: string): { day: string; time: string } {
        let timeZone = 'America/New_York';
        if (process.env['SERVER_TYPE'] == 'test_') {
            timeZone = 'Asia/Dhaka';
        }
        if (!NestHelper.getInstance().isEmpty(zone)) {
            timeZone = zone;
        } else {
            timeZone = 'UTC';
        }
        let day = DateTime.now().weekdayLong.toLowerCase();
        let time = DateTime.now().setZone(timeZone).toFormat('hh:mm a').toLowerCase();

        // let time = DateTime.now().setZone('America/Washington').toFormat("hh:mm a").toLowerCase()
        // if (process.env['SERVER_TYPE'] == "test_") {
        //     time = DateTime.now().setZone(timeZone).toFormat("hh:mm a").toLowerCase()
        // }
        // let time = DateTime.now().setZone('America/New_York').toFormat("hh:mm a").toLowerCase()
        // let time = DateTime.now().setZone('UTC').toFormat("hh:mm a").toLowerCase()
        return {
            day: day,
            time: time,
        };
    }

    isValidTimeZone(zone: string): boolean {
        return IANAZone.isValidZone(zone);
    }
    dayAndTimeByGivenTime(date: Date, zone?: string): { day: string; time: string } {
        let timeZone = 'America/New_York';
        if (process.env['SERVER_TYPE'] == 'test_') {
            timeZone = 'Asia/Dhaka';
        }
        if (!NestHelper.getInstance().isEmpty(zone)) {
            timeZone = zone;
        } else {
            timeZone = 'UTC';
        }
        const newDate = new Date(date);
        const date1 = newDate.toISOString();
        let day = DateTime.fromISO(date1).weekdayLong.toLowerCase();
        let time = DateTime.fromISO(date1).setZone(timeZone).toFormat('hh:mm a').toLowerCase();
        return {
            day: day,
            time: time,
        };
    }
    // deployment jai na kn

    getDayOfMonth(): number {
        let day = DateTime.now().day;
        return day;
    }

    formatDate(date: Date, format: string, zone?: string): string {
        let zn = 'America/New_York';
        if (!NestHelper.getInstance().isEmpty(zone)) {
            zn = zone;
        }
        const date2 = date.toISOString();
        return DateTime.fromISO(date2).setZone(zn).toFormat(format);
    }
    formatDateAccordingToHour(date: string, format: string, zone?: string): string {
        let zn = 'America/New_York';
        if (!NestHelper.getInstance().isEmpty(zone)) {
            zn = zone;
        }
        const startDate = DateTime.fromISO(date, { zone: zn, setZone: true });
        if (startDate.hour >= 18) {
            // If the time is less than 18:00:00, add one day to the start date
            const startDatePlusOneDay = startDate.plus({ days: 1 });

            // Format the start date with the desired format ("YYYY-MM-DD")
            const startDatePlusFormatted = startDatePlusOneDay.toFormat(format);
            return startDatePlusFormatted;
        } else {
            // If the time is greater than or equal to 18:00:00, use the original start date
            const startDateFormatted = startDate.toFormat(format);
            return startDateFormatted;
        }
    }

    getDatesForPaymentDesc(
        date: Date,
        zone?: string
    ): { monthOfOneDayAgo: string; oneDayAgo: number; previousMonth: string; dayOneMonthAgo: number } {
        let zn = 'America/New_York';
        if (!NestHelper.getInstance().isEmpty(zone)) {
            zn = zone;
        }
        const dt = date.toISOString();
        const monthOfOneDayAgo = DateTime.fromISO(dt).setZone(zn).plus({ days: -1 }).monthLong;
        const previousMonth = DateTime.fromISO(dt).setZone(zn).plus({ months: -1 }).monthLong;
        let oneDayAgo = DateTime.fromISO(dt).setZone(zn).plus({ days: -1 }).day;
        let dayOneMonthAgo = DateTime.fromISO(dt).setZone(zn).plus({ months: -1 }).day;
        return {
            monthOfOneDayAgo: monthOfOneDayAgo,
            oneDayAgo: oneDayAgo,
            previousMonth: previousMonth,
            dayOneMonthAgo: dayOneMonthAgo,
        };
    }

    getZone(date: Date): string {
        const luxonDateTime = DateTime.fromJSDate(date);
        const zone = luxonDateTime.zoneName;
        return zone;
    }
    isDateInRange(currentDate: string, startDate: string, endDate: string): boolean {
        // Check if currentDate is greater than or equal to startDate
        // and currentDate is less than or equal to endDate
        console.log({ currentDate, startDate, endDate });
        return currentDate >= startDate && currentDate <= endDate;
    }


    getCurrentMonthName(): string {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const currentDate = new Date();
        const currentMonth = months[currentDate.getMonth()];

        return currentMonth;
    }

    getPreviousMonthName(): string {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const currentDate = new Date();
        const currentMonthIndex = currentDate.getMonth();
        const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
        const previousMonth = months[previousMonthIndex];

        return previousMonth;
    }

    getTimeInNext24Hours(now: string): string {
        const next24Hours = new Date(new Date(now).getTime() + 24 * 60 * 60 * 1000).toISOString();

        return next24Hours;
    }

    getPastStartDate(): Date {
        let startDate = new Date(0);
        return startDate
    }
    isValidUTCDate(utcDateString: string): boolean {
        const utcDateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z$/;
        let flag = true;
        if (!utcDateRegex.test(utcDateString)) {
            flag = false;
        }
        const matchResult = utcDateString.match(utcDateRegex);
        if (!matchResult) {
            flag = false;
        }
        if (flag) {
            const year = parseInt(matchResult[1]);
            const month = parseInt(matchResult[2]) - 1; // Month is 0-indexed in JavaScript
            const day = parseInt(matchResult[3]);
            const hours = parseInt(matchResult[4]);
            const minutes = parseInt(matchResult[5]);
            const seconds = parseInt(matchResult[6]);
            const milliseconds = parseInt(matchResult[7]);
            const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));
            flag = (
                date.getUTCFullYear() === year &&
                date.getUTCMonth() === month &&
                date.getUTCDate() === day &&
                date.getUTCHours() === hours &&
                date.getUTCMinutes() === minutes &&
                date.getUTCSeconds() === seconds &&
                date.getUTCMilliseconds() === milliseconds
            );
        }
        if (!flag) {
            ExceptionHelper.getInstance().defaultError(
                "Invalid_Date",
                "invalid_date",
                HttpStatus.BAD_REQUEST
            )
        }
        return flag;
    }
    isSecondDateGreater(startDate: string, endDate: string): boolean {
        return endDate > startDate;
    }
    isSecondDateGreaterOrEqual(startDate: string, endDate: string): boolean {
        return endDate >= startDate;
    }

}
