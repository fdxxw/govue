package parquet

import (
	"github.com/xitongsys/parquet-go-source/local"
	"github.com/xitongsys/parquet-go/reader"
	"github.com/xitongsys/parquet-go/writer"
)

func GetPW(flatPath string, typeStruct interface{}) (*writer.ParquetWriter, error) {
	fw, err := local.NewLocalFileWriter(flatPath)
	if err != nil {
		return nil, err
	}
	pw, err := writer.NewParquetWriter(fw, typeStruct, 4)
	if err != nil {
		fw.Close()
		return nil, err
	}
	return pw, nil
}
func GetPR(flatPath string, typeStruct interface{}) (*reader.ParquetReader, error) {
	fr, err := local.NewLocalFileReader(flatPath)
	if err != nil {
		return nil, err
	}
	pr, err := reader.NewParquetReader(fr, typeStruct, 4)
	if err != nil {
		fr.Close()
		return nil, err
	}
	return pr, nil
}
