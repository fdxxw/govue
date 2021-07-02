package apis

import "github.com/gin-gonic/gin"

func Router(r *gin.Engine) {
	r.GET("/api/app/info", AppInfo)
}
