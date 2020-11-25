package types

import (
	"github.com/stretchr/testify/assert"
	"testing"
)


func TestNewGenesisState(t *testing.T) {
	const (
		minCreatePoolThreshold uint = 1000
	)

	customParams := NewParams(minCreatePoolThreshold)
	customGenesis := NewGenesisState(customParams)

	defaultGenesis := DefaultGenesisState()

	assert.IsType(t, GenesisState{}, customGenesis)
	assert.NotEqual(t, defaultGenesis.Params.MinCreatePoolThreshold, customGenesis.Params.MinCreatePoolThreshold)
}

func TestDefaultGenesisState(t *testing.T) {
	defaultGenesis := DefaultGenesisState()

	assert.IsType(t, GenesisState{}, defaultGenesis)
	assert.Equal(t, DefaultMinCreatePoolThreshold, defaultGenesis.Params.MinCreatePoolThreshold)
}