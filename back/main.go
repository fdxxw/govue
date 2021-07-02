package main

import (
	"flag"
	"fmt"
	"govue/config"
	"govue/log"
	"govue/middleware"
	"govue/version"

	"github.com/fdxxw/go-wen"
	"github.com/gin-gonic/gin"
)

var printVersion = flag.Bool("version", false, "打印版本信息")
var cfgFile = flag.String("config", "", "指定配置文件路径")
var AutoOpen = "false"

func main() {
	flag.Parse()
	if *printVersion {
		version.PrintVersion()
	}
	if *cfgFile != "" {
		config.CfgFile = *cfgFile
	}
	config.Init()
	log.Init()
	r := gin.New()
	// 跨域
	r.Use(middleware.Cors)
	// 注册zap相关中间件
	r.Use(log.GinLogger(), log.GinRecovery(true))

	addr := fmt.Sprintf("%v:%v", config.Cfg.HttpListenIP, config.Cfg.HttpListenPort)
	if AutoOpen == "true" {
		url := fmt.Sprintf("%v%v%v", "http://localhost", addr, "/web")
		wen.ChromeAppMaximized(url, "")
	}
	r.Run(addr)
}
