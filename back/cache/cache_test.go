package cache

import (
	"fmt"
	"govue/config"
	"log"
	"testing"

	"github.com/fdxxw/go-wen"
	"github.com/spf13/cast"
)

func TestSet(t *testing.T) {
	defer wen.TimeCost()()
	config.Init()
	transferId := "8cddc5e6"
	for i := 0; i < 1000; i++ {
		err := Set(transferId, fmt.Sprintf("%v-%v", "test", i), []byte(cast.ToString(i)))
		if err != nil {
			t.Error(err)
		}
	}
}
func TestGet(t *testing.T) {
	config.Init()
	defer wen.TimeCost()()
	transferId := "8cddc5e6"
	for i := 0; i < 1000; i++ {
		v, err := Get(transferId, fmt.Sprintf("%v-%v", "test", i))
		if err != nil {
			t.Error(err)
		}
		log.Println(cast.ToString(v))
	}
}
