package util

import (
	"log"
	"testing"
)

func TestTimeParseDateTimeMillis(t *testing.T) {
	tt := TimeParseDateTimeMillis("2021-05-28 09:00:00.000")
	log.Println(tt)
}
