package log

import (
	"govue/config"
	"net/url"
	"os"
	"path/filepath"
	"runtime"

	"github.com/fdxxw/go-wen"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var log *zap.SugaredLogger

func Init() {
	outputPath := filepath.Join(config.Cfg.LogPath, "output.log")
	errorPath := filepath.Join(config.Cfg.LogPath, "error.log")
	if !wen.DirExists(config.Cfg.LogPath) {
		err := os.MkdirAll(config.Cfg.LogPath, os.ModePerm)
		if err != nil {
			log.Fatal(err)
		}
	}
	if runtime.GOOS == "windows" {

		zap.RegisterSink("winfile", func(u *url.URL) (zap.Sink, error) {
			// Remove leading slash left by url.Parse()
			return os.OpenFile(u.Path[1:], os.O_WRONLY|os.O_APPEND|os.O_CREATE, 0644)
		})
		outputPath = "winfile:///" + outputPath
		errorPath = "winfile:///" + errorPath
	}
	encoderConfig := zapcore.EncoderConfig{
		TimeKey:        "time",
		LevelKey:       "level",
		NameKey:        "logger",
		CallerKey:      "caller",
		MessageKey:     "msg",
		StacktraceKey:  "stacktrace",
		LineEnding:     zapcore.DefaultLineEnding,
		EncodeLevel:    zapcore.LowercaseLevelEncoder,
		EncodeTime:     zapcore.TimeEncoderOfLayout("2006-01-02 15:04:05.000"),
		EncodeDuration: zapcore.SecondsDurationEncoder,
		EncodeCaller:   zapcore.FullCallerEncoder,
	}

	cfg := zap.Config{
		Level:            zap.NewAtomicLevelAt(zap.DebugLevel), // 日志级别
		Development:      true,                                 // 开发模式，堆栈跟踪
		Encoding:         "console",                            // 输出格式 console 或 json
		EncoderConfig:    encoderConfig,                        // 编码器配置
		InitialFields:    map[string]interface{}{},             // 初始化字段，如：添加一个服务器名称
		OutputPaths:      []string{"stdout", outputPath},       // 输出到指定文件 stdout（标准输出，正常颜色） stderr（错误输出，红色）
		ErrorOutputPaths: []string{"stderr", errorPath},
		// OutputPaths:      []string{"stdout"},
		// ErrorOutputPaths: []string{"stderr"},
	}

	logger, err := cfg.Build()
	if err != nil {
		panic(err)
	}
	logger = logger.WithOptions(zap.AddCallerSkip(1))
	log = logger.Sugar()
}

func Debug(args ...interface{}) {
	log.Debug(args...)
}
func Info(args ...interface{}) {
	log.Info(args...)
}
func Warn(args ...interface{}) {
	log.Warn(args...)
}
func Error(args ...interface{}) {
	log.Error(args...)
}

func Debugf(format string, args ...interface{}) {
	log.Debugf(format, args...)
}
func Infof(format string, args ...interface{}) {
	log.Infof(format, args...)
}
func Warnf(format string, args ...interface{}) {
	log.Warnf(format, args...)
}
func Errorf(format string, args ...interface{}) {
	log.Errorf(format, args...)
}

func Debugw(msg string, keysAndValues ...interface{}) {
	log.Debugw(msg, keysAndValues...)
}
func Infow(msg string, keysAndValues ...interface{}) {
	log.Infow(msg, keysAndValues...)
}
func Warnw(msg string, keysAndValues ...interface{}) {
	log.Warnw(msg, keysAndValues...)
}
func Errorw(msg string, keysAndValues ...interface{}) {
	log.Errorw(msg, keysAndValues...)
}

func GetLogger() *zap.SugaredLogger {
	return log
}
