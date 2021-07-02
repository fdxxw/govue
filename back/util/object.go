package util

import (
	"encoding/json"
)

func To(in interface{}, out interface{}) error {
	b, err := json.Marshal(in)
	if err != nil {
		return err
	}
	err = json.Unmarshal(b, out)
	if err != nil {
		return err
	}
	return nil
}
