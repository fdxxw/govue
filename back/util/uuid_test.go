package util

import (
	"log"
	"testing"
)

func TestID(t *testing.T) {
	for i := 0; i < 1*10000; i++ {
		log.Println(ID())
	}
}
