package types

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestParams_Equal(t *testing.T) {
	otherParams := DefaultParams()
	assert.True(t, DefaultParams().Equal(otherParams))
	// Nothing special about + 1, just want a difference
	otherParams.MinCreatePoolThreshold = otherParams.MinCreatePoolThreshold + 1
	assert.NotEqual(t, DefaultParams(), otherParams)
	assert.False(t, DefaultParams().Equal(otherParams))
}

func TestParams_String(t *testing.T) {
	assert.NotEmpty(t, DefaultParams().String())
}

func TestParams_Validate(t *testing.T) {
	assert.NoError(t, DefaultParams().Validate())
}