package clp_test

import (
	"github.com/Sifchain/sifnode/x/clp"
	"github.com/Sifchain/sifnode/x/clp/test"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"testing"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

func TestClp(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Clp Suite")
}

// Add one working BDD test example for a demonstration.  This is a simple dupe of TestKeeper_SetPool
// See full Ginkgo documentation at https://onsi.github.io/ginkgo/
var _ = Describe("ClpBdd", func() {
	var (
		ctx sdk.Context
		keeper clp.Keeper
	)

	BeforeEach(func() {
		ctx, keeper = test.CreateTestAppClp(false)
	})

	Describe("Test set pool", func() {
		Context("With a random pool", func() {
			It("should be fetchable", func() {
				pool := test.GenerateRandomPool(1)[0]
				err := keeper.SetPool(ctx, pool)
				Expect(err).To(BeNil())
				getpool, err := keeper.GetPool(ctx, pool.ExternalAsset.Ticker)
				Expect(getpool).To(Equal(pool))
				Expect(err).To(BeNil())
			})

		})
	})
})
