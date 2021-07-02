package resources

import (
	"embed"
	_ "embed"
)

//go:embed web
var WebResources embed.FS
