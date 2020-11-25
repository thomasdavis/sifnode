package types

import (
	"github.com/cosmos/cosmos-sdk/x/auth/types"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestParams_Equal(t *testing.T) {
	otherParams := types.DefaultParams()
	assert.True(t, types.DefaultParams().Equal(otherParams))
	// Nothing special about + 1, just want a difference
	otherParams.TxSigLimit = otherParams.TxSigLimit + 1
	assert.NotEqual(t, types.DefaultParams(), otherParams)
	assert.False(t, types.DefaultParams().Equal(otherParams))
}

func TestParams_String(t *testing.T) {
	assert.NotEmpty(t, types.DefaultParams().String())
}
