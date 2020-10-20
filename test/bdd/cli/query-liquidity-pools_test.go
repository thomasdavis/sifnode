package cli

import (
	"fmt"

	"github.com/bitfield/script"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var _ = Describe("as a cli user", func() {
	Context("when no pools exist", func() {
		When("I query the clp pools", func() {
			output := Exec("sifnodecli query clp pools")
			It("should return empty pools", func() {
				Expect(output).Should(ContainSubstring("ERROR: PoolList Is Empty"))
			})
		})
	})

	Context("when a pool exist", func() {
		CreatePool("user1", "ETHEREUM", "cLINK", "LINK", "1000", "1")
		When("I query the clp pools", func() {
			It("should return details of the pool", func() {
			})
		})
	})
})

func CreatePool(fromUser, sourceChain, symbol, ticker, nativeAmount, externalAmount string) {
	cmd := fmt.Sprintf("sifnodecli tx clp create-pool --from %v --sourceChain %v --symbol %v --ticker %v --nativeAmount %v --externalAmount %v", fromUser, sourceChain, symbol, ticker, nativeAmount, externalAmount)
	p := script.Exec(cmd)
	p.SetError(nil)
	output, err := p.String()
	if err != nil {
		Fail(err.Error())
	}
	fmt.Println(output)
	// spew.Dump(output)
}

func Exec(cmd string) string {
	p := script.Exec(cmd)
	p.SetError(nil)
	output, err := p.String()
	if err != nil {
		Fail(err.Error())
	}
	return output
}
