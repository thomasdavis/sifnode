package types

// Pools is the response that is returns when queuing a pool
type Pools struct {
	Pools []struct {
		ExternalAsset struct {
			SourceChain string `json:"source_chain"`
			Symbol      string `json:"symbol"`
			Ticker      string `json:"ticker"`
		} `json:"external_asset"`
		NativeAssetBalance   string `json:"native_asset_balance"`
		ExternalAssetBalance string `json:"external_asset_balance"`
		PoolUnits            string `json:"pool_units"`
		PoolAddress          string `json:"pool_address"`
	} `json:"Pools"`
	Height string `json:"height"`
}
