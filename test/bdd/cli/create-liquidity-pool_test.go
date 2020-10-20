package cli

import (
	. "github.com/onsi/ginkgo"
	_ "github.com/onsi/gomega"
)

var _ = Describe("as a cli user", func() {
	Context("when no pool exists for my token", func() {
		When("and valid inputs are given", func() {
			It("should create a new liquidity pool", func() {
			})
		})
	})
})
