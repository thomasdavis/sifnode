package types

import (
	"github.com/Sifchain/sifnode/common"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

// MsgCreatePool defines a CreatePool message
type MsgCreatePool struct {
	Signer              string       `json:"signer"`
	ExternalAsset       common.Asset `json:"external_asset"`
	NativeAssetAmount   sdk.Uint     `json:"native_asset_amount"`
	ExternalAssetAmount sdk.Uint     `json:"external_asset_amount"`
}

// NewMsgCreatePool is a constructor function for MsgCreatePool
func NewMsgCreatePool(signer string, externalAsset common.Asset, nativeAssetAmount common.Asset, externalAssetAmount, common.Asset) MsgCreatePool {
	return MsgCreatePool{
		Signer:  signer,
		ExternalAsset: externalAsset,
		NativeAssetAmount: nativeAssetAmount,
		ExternalAssetAmount: externalAssetAmount
	}
}

// Route should return the name of the module
func (msg MsgCreatePool) Route() string { return RouterKey }

// Type should return the action
func (msg MsgCreatePool) Type() string { return "create_pool" }

// ValidateBasic runs stateless checks on the message
func (msg MsgCreatePool) ValidateBasic() error {
	if msg.Signer.Empty() {
		return sdkerrors.Wrap(sdkerrors.ErrInvalidAddress, msg.Signer.String())
	}
	if len(msg.Name) == 0 || len(msg.Value) == 0 {
		return sdkerrors.Wrap(sdkerrors.ErrUnknownRequest, "Name and/or Value cannot be empty")
	}

	if msg.ExternalAsset.IsEmpty() {
		return sdk.ErrUnknownRequest("External asset cannot be empty")
	}

	return nil
}

// GetSignBytes encodes the message for signing
func (msg MsgCreatePool) GetSignBytes() []byte {
	return sdk.MustSortJSON(ModuleCdc.MustMarshalJSON(msg))
}

// GetSigners defines whose signature is required
func (msg MsgCreatePool) GetSigners() []sdk.AccAddress {
	return []sdk.AccAddress{msg.Signer}
}
