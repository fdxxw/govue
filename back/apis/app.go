package apis

import (
	"govue/config"
	"govue/version"
	"net/http"

	"github.com/gin-gonic/gin"
)

type App struct {
	Config    *config.Config `json:"config"`
	Version   string         `json:"version"`
	BuildTime string         `json:"buildTime"`
}

func AppInfo(c *gin.Context) {
	c.JSON(http.StatusOK, App{
		Config:    config.Cfg,
		Version:   version.Version,
		BuildTime: version.BuildTime,
	})
}
