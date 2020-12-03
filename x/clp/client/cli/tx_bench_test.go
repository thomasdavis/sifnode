package cli_test

import (
	"io/ioutil"
	"testing"

	"github.com/Sifchain/sifnode/x/clp/client/cli"
	"github.com/Sifchain/sifnode/x/clp/test"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/viper"
)

func SetupBenchViper() {
	viper.Set(flags.FlagKeyringBackend, flags.DefaultKeyringBackend)
	viper.Set(flags.FlagGenerateOnly, true)
	viper.Set(flags.FlagChainID, "sifchainTest")

}

func BenchmarkGetCmdCreatePool(b *testing.B) {
	cdc := test.MakeTestCodec()
	clpcmd := cli.GetCmdCreatePool(cdc)
	SetupBenchViper()
	viper.Set(cli.FlagExternalAssetAmount, "100")
	viper.Set(cli.FlagNativeAssetAmount, "100")
	viper.Set(cli.FlagAssetSourceChain, "ethereum")
	viper.Set(cli.FlagAssetSymbol, "ETH")
	viper.Set(cli.FlagAssetTicker, "ceth")
	clpcmd.SetArgs([]string{
		"--externalAmount", "100",
		"--nativeAmount", "100",
		"--sourceChain", "ethereum",
		"--symbol", "ETH",
		"--ticker", "eth"})
	clpcmd.Execute()
}

func BenchmarkGetCmdAddLiquidity(b *testing.B) {
	cdc := test.MakeTestCodec()
	clpcmd := cli.GetCmdAddLiquidity(cdc)
	SetupBenchViper()
	viper.Set(cli.FlagExternalAssetAmount, "100")
	viper.Set(cli.FlagNativeAssetAmount, "100")
	viper.Set(cli.FlagAssetSourceChain, "ethereum")
	viper.Set(cli.FlagAssetSymbol, "ETH")
	viper.Set(cli.FlagAssetTicker, "ceth")
	clpcmd.SetArgs([]string{
		"--externalAmount", "100",
		"--nativeAmount", "100",
		"--sourceChain", "ethereum",
		"--symbol", "ETH",
		"--ticker", "eth"})
	clpcmd.Execute()
}

func BenchmarkGetCmdRemoveLiquidity(b *testing.B) {
	cdc := test.MakeTestCodec()
	clpcmd := cli.GetCmdRemoveLiquidity(cdc)
	SetupBenchViper()
	viper.Set(cli.FlagWBasisPoints, "100")
	viper.Set(cli.FlagAsymmetry, "1000")
	viper.Set(cli.FlagAssetSourceChain, "ethereum")
	viper.Set(cli.FlagAssetSymbol, "ETH")
	viper.Set(cli.FlagAssetTicker, "ceth")
	clpcmd.SetArgs([]string{
		"--wBasis", "100",
		"--asymmetry", "1000",
		"--sourceChain", "ethereum",
		"--symbol", "ETH",
		"--ticker", "eth"})
	clpcmd.SetOut(ioutil.Discard)
	clpcmd.Execute()

	viper.Set(cli.FlagWBasisPoints, "100")
	viper.Set(cli.FlagAsymmetry, "1000")
	viper.Set(cli.FlagAssetSourceChain, "ethereum")
	viper.Set(cli.FlagAssetSymbol, "ETH")
	viper.Set(cli.FlagAssetTicker, "ceth")
	clpcmd.SetArgs([]string{
		"--wBasis", "100",
		"--asymmetry", "1000",
		"--sourceChain", "ethereum",
		"--symbol", "ETH",
		"--ticker", "eth"})
	clpcmd.SetOut(ioutil.Discard)
	clpcmd.Execute()

	viper.Set(cli.FlagWBasisPoints, "100")
	viper.Set(cli.FlagAsymmetry, "asdef")
	viper.Set(cli.FlagAssetSourceChain, "ethereum")
	viper.Set(cli.FlagAssetSymbol, "ETH")
	viper.Set(cli.FlagAssetTicker, "ceth")
	clpcmd.SetArgs([]string{
		"--wBasis", "100",
		"--asymmetry", "1000",
		"--sourceChain", "ethereum",
		"--symbol", "ETH",
		"--ticker", "eth"})
	clpcmd.SetOut(ioutil.Discard)
	clpcmd.Execute()
}

func BenchmarkGetCmdSwap(b *testing.B) {
	cdc := test.MakeTestCodec()
	clpcmd := cli.GetCmdSwap(cdc)
	SetupBenchViper()
	viper.Set(cli.FlagSentAssetSourceChain, "ethereum")
	viper.Set(cli.FlagSentAssetSymbol, "ETH")
	viper.Set(cli.FlagSentAssetTicker, "ceth")
	viper.Set(cli.FlagReceivedAssetSourceChain, "dash")
	viper.Set(cli.FlagReceivedAssetSymbol, "DASH")
	viper.Set(cli.FlagReceivedAssetTicker, "cdash")
	viper.Set(cli.FlagAmount, "100")
	clpcmd.SetArgs([]string{
		"--sentAmount", "100",
		"--receivedSourceChain", "dash",
		"--receivedSymbol", "DASH",
		"--receivedTicker", "cdash",
		"--sentSourceChain", "ethereum",
		"--sentSymbol", "ETH",
		"--sentTicker", "eth"})
	clpcmd.Execute()
}

func BenchmarkGetCmdDecommissionPool(b *testing.B) {
	cdc := test.MakeTestCodec()
	clpcmd := cli.GetCmdDecommissionPool(cdc)
	SetupBenchViper()
	viper.Set(cli.FlagAssetTicker, "ceth")
	clpcmd.SetArgs([]string{
		"--ticker", "ceth"})
	clpcmd.Execute()
}
