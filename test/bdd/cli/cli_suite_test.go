package cli_test

import (
	"testing"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

func TestCli(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Cli Suite")
}

var _ = BeforeSuite(func() {
	// TODO workout how to boot a fresh chain
})

var _ = AfterSuite(func() {
	// TODO shut chain down.
})
