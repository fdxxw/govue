package cache

import (
	"acuiot/cache/parquet"
	"acuiot/log"
	"acuiot/transfer"
	"acuiot/util"
	"errors"
	"path/filepath"

	"github.com/spf13/cast"
)

type Cache struct {
	TransferId string `parquet:"name=transferId, type=BYTE_ARRAY, convertedtype=UTF8, encoding=PLAIN_DICTIONARY"`
	Key        string `parquet:"name=key, type=BYTE_ARRAY, convertedtype=UTF8, encoding=PLAIN_DICTIONARY"`
	Value      string `parquet:"name=value, type=BYTE_ARRAY, convertedtype=UTF8, encoding=PLAIN_DICTIONARY"`
}

var lock = &util.KeyLock{}

// 设置缓存
func Set(transferId string, key string, value []byte) error {
	defer func() {
		if r := recover(); r != nil {
			log.Error("recover from cache set", r)
			// log.Debug(pkt.Idx, pkt.)
		}
	}()
	for {
		if lock.TryLock(transferId) {
			break
		}
	}
	defer lock.UnLock(transferId)
	cs, err := readAll(transferId)
	if err != nil {
		cs = []Cache{}
	}
	findIndex := -1
	for i, c := range cs {
		if c.TransferId == transferId && c.Key == key {
			findIndex = i
			cs[i].Value = cast.ToString(value)
			break
		}
	}
	if findIndex == -1 {
		cs = append(cs, Cache{TransferId: transferId, Key: key, Value: cast.ToString(value)})
	}
	return writeAll(transferId, cs)
}
func Get(transferId string, key string) ([]byte, error) {
	defer func() {
		if r := recover(); r != nil {
			log.Error("recover from cache get", r)
			// log.Debug(pkt.Idx, pkt.)
		}
	}()
	for {
		if lock.TryLock(transferId) {
			break
		}
	}
	defer lock.UnLock(transferId)
	p := filepath.Join(transfer.TransferDir(transferId), "cache.parquet")
	pr, err := parquet.GetPR(p, new(Cache))
	if err != nil {
		return nil, err
	}
	defer pr.PFile.Close()
	num := pr.GetNumRows()
	if num <= 0 {
		return nil, errors.New("no data")
	}
	transferIdTmp, _, _, err := pr.ReadColumnByIndex(0, num)
	if err != nil {
		return nil, err
	}
	keyTmp, _, _, err := pr.ReadColumnByIndex(1, num)
	if err != nil {
		return nil, err
	}
	for i := int64(0); i < num; i++ {
		if cast.ToString(transferIdTmp[i]) == transferId && cast.ToString(keyTmp[i]) == key {
			pr.SkipRowsByIndex(int64(2), int64(i))
			vs, _, _, err := pr.ReadColumnByIndex(int64(2), 1)
			if err != nil {
				return nil, err
			}
			if len(vs) == 0 {
				return nil, errors.New("no data")
			}
			return []byte(cast.ToString(vs[0])), nil
		}
	}
	return nil, errors.New("no data")
}
func readAll(transferId string) ([]Cache, error) {
	p := filepath.Join(transfer.TransferDir(transferId), "cache.parquet")
	pr, err := parquet.GetPR(p, new(Cache))

	if err != nil {
		return nil, err
	}
	defer pr.PFile.Close()
	cs := make([]Cache, pr.GetNumRows())
	if err = pr.Read(&cs); err != nil {
		return nil, err
	}
	pr.ReadStop()
	return cs, nil
}
func writeAll(transferId string, cs []Cache) error {
	p := filepath.Join(transfer.TransferDir(transferId), "cache.parquet")
	pw, err := parquet.GetPW(p, new(Cache))
	if err != nil {
		return err
	}
	defer pw.PFile.Close()
	for _, c := range cs {
		if err = pw.Write(c); err != nil {
			return err
		}
	}
	if err = pw.WriteStop(); err != nil {
		return err
	}
	return nil
}
