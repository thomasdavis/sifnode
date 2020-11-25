package types

import (
	"github.com/stretchr/testify/assert"
	"strings"
	"testing"
)

func TestNewAsset_WithValidArguments_ReturnsAsset(t *testing.T) {
	asset := NewAsset("Ethereum", "ETH", "ceth")

	assert.IsType(t, Asset{}, asset)
}

func TestNewAsset_WithValidArguments_HasCorrectValues(t *testing.T) {
	asset := NewAsset("Ethereum", "ETH", "ceth")

	assert.Equal(t, "Ethereum", asset.SourceChain)
	assert.Equal(t, "ETH", asset.Symbol)
	assert.Equal(t, "ceth", asset.Ticker)
}

func TestString_WithValidArguments_ReturnsFormattedString(t *testing.T) {
	asset := NewAsset("Ethereum", "ETH", "ceth")

	assert.Equal(t, "SourceChain: Ethereum\nSymbol: ETH\nTicker: ceth", asset.String())
}

func TestValidate_WithValidArguments_ReturnsTrue(t *testing.T) {
	asset := NewAsset("Ethereum", "ETH", "ceth")
	isValid := asset.Validate()

	assert.True(t, isValid)
}

func TestValidate_WithSourceChainAsEmptyString_ReturnsFalse(t *testing.T) {
	asset := NewAsset("", "ETH", "ceth")
	isValid := asset.Validate()
	assert.False(t, isValid)
}

func TestValidate_WithSourceChainAsLongString_ReturnsFalse(t *testing.T) {
	longSourceChain := strings.Repeat("x", MaxSourceChainLength + 1)
	asset := NewAsset(longSourceChain, "ETH", "ceth")

	isValid := asset.Validate()

	assert.False(t, isValid)
}

func TestValidate_WithSymbolAsEmptyString_ReturnsFalse(t *testing.T) {
	asset := NewAsset("Ethereum", "", "ceth")

	isValid := asset.Validate()

	assert.False(t, isValid)
}

func TestValidate_WithSymbolAsLongString_ReturnsFalse(t *testing.T) {
	longSymbol := strings.Repeat("x", MaxSymbolLength + 1)
	asset := NewAsset("Ethereum", longSymbol, "ceth")
	isValid := asset.Validate()
	assert.False(t, isValid)
}

func TestValidate_WithTickerAsEmptyString_ReturnsFalse(t *testing.T) {
	asset := NewAsset("", "ETH", "ceth")

	isValid := asset.Validate()

	assert.False(t, isValid)
}

func TestValidate_WithTickerAsLongString_ReturnsFalse(t *testing.T) {
	longTicker := strings.Repeat("x", MaxTickerLength + 1)
	asset := NewAsset("", "ETH", longTicker)

	isValid := asset.Validate()

	assert.False(t, isValid)
}

func TestVerifyRange_NumWithinRange_ReturnsTrue(t *testing.T) {
	num := 100
	low := 1
	high := 1000

	res := VerifyRange(num, low, high)

	assert.True(t, res)
}

func TestVerifyRange_NumGreaterThanHigh_ReturnsFalse(t *testing.T) {
	num := 1001
	low := 1
	high := 1000

	res := VerifyRange(num, low, high)

	assert.False(t, res)
}

func TestVerifyRange_NumLessThanLow_ReturnsFalse(t *testing.T) {
	num := 0
	low := 1
	high := 1000

	res := VerifyRange(num, low, high)

	assert.False(t, res)
}

func TestEquals_WithIdenticalAssets_ReturnsTrue(t *testing.T) {
	assetA := NewAsset("Ethereum", "ETH", "ceth")
	assetB := NewAsset("Ethereum", "ETH", "ceth")

	res := Asset.Equals(assetA, assetB)

	assert.True(t, res)
}

func TestEquals_WithDifferentAssets_ReturnsFalse(t *testing.T) {
	assetA := NewAsset("Ethereum", "ETH", "ceth")
	assetB := NewAsset("Bitcoin", "BTC", "cbtc")

	res := Asset.Equals(assetA, assetB)

	assert.False(t, res)
}

func TestIsEmpty_WithEmptySourceChain_ReturnsTrue(t *testing.T) {
	asset := NewAsset("", "ETH", "ceth")
	res := Asset.IsEmpty(asset)
	assert.True(t, res)
}

func TestIsEmpty_WithEmptySymbol_ReturnsTrue(t *testing.T) {
	asset := NewAsset("Ethereum", "", "ceth")

	res := Asset.IsEmpty(asset)

	assert.True(t, res)
}

func TestIsEmpty_WithEmptyTicker_ReturnsTrue(t *testing.T) {
	asset := NewAsset("Ethereum", "ETH", "")
	res := Asset.IsEmpty(asset)
	assert.True(t, res)
}

func TestIsEmpty_WithNoEmptyStrings_ReturnsFalse(t *testing.T) {
	asset := NewAsset("Ethereum", "ETH", "ceth")

	res := Asset.IsEmpty(asset)

	assert.False(t, res)
}

func TestGetSettlementAsset_ReturnsAsset(t *testing.T) {
	res := GetSettlementAsset()

	assert.IsType(t, Asset{}, res)
}

func TestGetSettlementAsset_GetSourceChain_ReturnsCorrectNativeSourceChain(t *testing.T) {
	res := GetSettlementAsset().SourceChain

	assert.Equal(t, "SIFCHAIN", res)
}

func TestGetSettlementAsset_GetSymbol_ReturnsCorrectSymbol(t *testing.T) {
	res := GetSettlementAsset().Symbol

	assert.Equal(t, "RWN", res)
}

func TestGetSettlementAsset_GetTicker_ReturnsCorrectNativeTicker(t *testing.T) {
	res := GetSettlementAsset().Ticker

	assert.Equal(t, "rwn", res)
}