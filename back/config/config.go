package config

import (
	"fmt"
	"log"
	"path/filepath"

	"github.com/fdxxw/go-wen"
	homedir "github.com/mitchellh/go-homedir"
	"github.com/spf13/viper"
)

var (
	Cfg     *Config
	CfgFile string
)

type Config struct {
	HttpListenIP   string `json:"httpListenIP"`
	HttpListenPort int    `json:"httpListenPort"`
	StoragePath    string `json:"storagePath"` // 数据存储路径
	LogPath        string `json:"logPath"`     // 日志存储路径
	MachineID      string `json:"machineId"`   // 机器id
	IsHttps        bool   `json:"isHttps"`
}

func Init() {
	initConfig()
	Cfg = &Config{}
	Cfg.StoragePath = viper.GetString("storagePath")
	Cfg.MachineID = viper.GetString("machineId")
	Cfg.IsHttps = viper.GetBool("isHttps")
	Cfg.HttpListenIP = viper.GetString("httpListenIP")
	Cfg.HttpListenPort = viper.GetInt("httpListenPort")
	Cfg.LogPath = viper.GetString("logPath")
}

func initConfig() {
	// Find home directory.
	home, err := homedir.Dir()
	if err != nil {
		log.Fatal(err)
	}
	viper.SetDefault("storagePath", filepath.Join(home, "govue"))
	viper.SetDefault("machineid", wen.ID())
	viper.SetDefault("isHttps", false)
	viper.SetDefault("httpListenIP", "")
	viper.SetDefault("httpListenPort", 9999)
	viper.SetDefault("logPath", filepath.Join(home, "govue", "logs"))
	if CfgFile != "" {
		// Use config file from the flag.
		viper.SetConfigFile(CfgFile)
	} else {
		// Search config in home directory with name ".cobra" (without extension).
		viper.AddConfigPath(home)
		viper.SetConfigName(".govue")
		viper.SetConfigType("yaml")
	}

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			// Config file not found; ignore error if desired
			err := viper.SafeWriteConfig()
			if err != nil {
				log.Fatal(err)
			}
		} else {
			// Config file was found but another error was produced
			log.Fatal(err)
		}
	} else {
		err := viper.WriteConfig()
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("Using config file:", viper.ConfigFileUsed())
	}
}
