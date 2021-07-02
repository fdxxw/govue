package version

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

var (
	//Version 项目版本信息
	Version = "0.0.1"
	//GoVersion Go版本信息
	GoVersion = ""
	//GitCommit git提交commmit id
	GitCommit = ""
	//BuildTime 构建时间
	BuildTime = ""
)

//PrintVersion 输出版本信息
func PrintVersion() {
	fmt.Printf("Version: %s\n", Version)
	fmt.Printf("Go Version: %s\n", GoVersion)
	fmt.Printf("Git Commit: %s\n", GitCommit)
	fmt.Printf("Build Time: %s\n", BuildTime)
	os.Exit(0)
}

func GetVersion(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"version":   Version,
		"GoVersion": GoVersion,
		"GitCommit": GitCommit,
		"BuildTime": BuildTime,
	})
}
func Route(r *gin.Engine) {
	r.GET("/api/version", GetVersion)
}
