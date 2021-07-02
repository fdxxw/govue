package util

import (
	"crypto/tls"
	"github.com/go-resty/resty/v2"
)

var RestClient *resty.Client

func init() {
	RestClient = resty.New().SetTLSClientConfig(&tls.Config{InsecureSkipVerify: true})
	RestClient.SetHeader("Content-Type", "application/json")
}
