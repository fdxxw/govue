package util

import (
	"log"
	"time"
)

const DateTimeMill = "2006-01-02 15:04:05.999"

func TimeFormat(t time.Time, layout string) string {
	return t.Local().Format(layout)
}
func TimeFormatDateTime(t time.Time) string {
	return t.Local().Format("2006-01-02 15:04:05")
}
func TimeFormatDate(t time.Time) string {
	return t.Local().Format("2006-01-02")
}
func TimeFormatDateTimeMillis(t time.Time) string {
	return t.Local().Format("2006-01-02 15:04:05.888")
}

func TimeParse(timeString, layout string) time.Time {
	t, _ := time.ParseInLocation(layout, timeString, time.Local)
	return t
}

func TimeParseDateTimeMillis(timeString string) time.Time {
	t, err := time.ParseInLocation("2006-01-02 15:04:05.000", timeString, time.Local)
	if err != nil {
		log.Println(err)
	}
	return t
}
func TimeParseDateTime(timeString string) (time.Time, error) {
	return time.ParseInLocation("2006-01-02 15:04:05", timeString, time.Local)
}
