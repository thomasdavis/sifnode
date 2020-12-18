import json
import re
import time
import os

from test_utilities import get_shell_output, SIF_ETH, burn_peggy_coin, ETHEREUM_ETH, owner_addr, moniker, \
    get_sifchain_addr_balance, wait_for_sifchain_addr_balance, advance_n_ethereum_blocks, n_wait_blocks, \
    cd_smart_contracts_dir, send_eth_lock
from test_utilities import print_error_message, get_user_account, get_sifchain_balance, network_password, \
    bridge_bank_address, \
    smart_contracts_dir, wait_for_sifchain_balance, wait_for_balance

# define users
USER = "user1"
ETH_CONTRACT = "0x0000000000000000000000000000000000000000"
SLEEPTIME = 5
AMOUNT = 3 * 10 ** 18
ROWAN_AMOUNT = 5
CLAIMLOCK = "lock"
CLAIMBURN = "burn"

operatorAddress = "0xf17f52151EbEF6C7334FAD080c5704D77216b732"

def get_eth_balance(account, symbol):
    command_line = cd_smart_contracts_dir + "yarn peggy:getTokenBalance {} {}".format(
        account, symbol)
    result = get_shell_output(command_line)
    lines = result.split('\n')
    for line in lines:
        balance = re.match("Eth balance for.*\((.*) Wei\).*", line)
        if balance:
            return int(balance.group(1))
    return 0


def wait_for_eth_balance(account, symbol, target_balance, max_attempts=30):
    wait_for_balance(lambda: get_eth_balance(account, symbol), target_balance, max_attempts)


def get_peggyrwn_balance(account, symbol):
    command_line = cd_smart_contracts_dir + "yarn peggy:getTokenBalance {} {}".format(
        account, symbol)
    result = get_shell_output(command_line)
    lines = result.split('\n')
    for line in lines:
        balance = re.match("Balance of eRWN for.*\((.*) eRWN.*\).*",
                           line)
        if balance:
            return balance.group(1)
    return 0


# Send eth from ETHEREUM_PRIVATE_KEY to BridgeBank, lock the eth on bridgebank, ceth should end up in sifchain_user
def send_eth_lock(sifchain_user, symbol, amount):
    command_line = cd_smart_contracts_dir + "yarn peggy:lock {} {} {}".format(
        get_user_account(sifchain_user, network_password), symbol, amount)
    get_shell_output(command_line)

def send_erowan_lock(sifchain_user, symbol, amount):
    command_line = cd_smart_contracts_dir + "yarn peggy:lock {} {} {}".format(
        get_user_account(sifchain_user, network_password), "erowan", 2000)
    get_shell_output(command_line)


def burn_peggyrwn(sifchain_user, peggyrwn_contract, amount):
    command_line = cd_smart_contracts_dir + "yarn peggy:burn {} {} {}".format(
        get_user_account(sifchain_user, network_password), peggyrwn_contract, amount)
    get_shell_output(command_line)


def get_operator_account(user):
    command_line = "sifnodecli keys show " + user + " -a --bech val"
    return get_shell_output(command_line)


def get_account_nonce(user):
    command_line = "sifnodecli q auth account " + get_user_account(user, network_password)
    output = get_shell_output(command_line)
    json_str = json.loads(output)
    return json_str["value"]["sequence"]


def lock_rowan(user, eth_user, amount):
    command_line = f"""yes {network_password} | sifnodecli tx ethbridge lock {get_user_account(user, network_password)} \
        {eth_user} {amount} rwn \
        --ethereum-chain-id=3 --from={user} --yes    
    """
    return get_shell_output(command_line)


def test_case_1():
    print(
        "########## Test Case One Start: lock eth in ethereum then mint ceth in sifchain"
    )
    bridge_bank_balance_before_tx = get_eth_balance(bridge_bank_address, ETHEREUM_ETH)
    user_balance_before_tx = get_sifchain_balance(USER, SIF_ETH, network_password)

    print(f"send_eth_lock({USER}, {ETHEREUM_ETH}, {AMOUNT})")
    send_eth_lock(USER, ETHEREUM_ETH, AMOUNT)
    advance_n_ethereum_blocks(n_wait_blocks)

    wait_for_eth_balance(bridge_bank_address, ETHEREUM_ETH, bridge_bank_balance_before_tx + AMOUNT)
    wait_for_sifchain_balance(USER, SIF_ETH, network_password, user_balance_before_tx + AMOUNT)

    print("########## Test Case One Over ##########")


def test_case_2():
    print(
        "########## Test Case Two Start: ceth => eth"
    )

    # send owner ceth to operator eth
    amount = 1 * 10 ** 18

    operator_balance_before_tx = get_eth_balance(operatorAddress, ETHEREUM_ETH)
    owner_sifchain_balance_before_tx = get_sifchain_addr_balance(owner_addr, SIF_ETH)
    print(f"starting user_eth_balance_before_tx {operator_balance_before_tx}, owner_sifchain_balance_before_tx {owner_sifchain_balance_before_tx}, amount {amount}")
    burn_peggy_coin(owner_addr, operatorAddress, amount)

    wait_for_sifchain_addr_balance(owner_addr, SIF_ETH, owner_sifchain_balance_before_tx - amount)
    wait_for_eth_balance(operatorAddress, ETHEREUM_ETH, operator_balance_before_tx + amount)
    print("########## Test Case Two Over ##########")

def basic_happy_path_scenario_1():
    '''
    Scenario:   A user locks 100 DAI in the bridgebank.

    Outcome:    User is minted cDAI at their sifchain recipient address as
                this is under the deposit limit and DAI is whitelisted on
                the ethereum smart contracts.
    '''

    print("########## Basic Happy Path Scenario One Start ##########")

    _amount = 100
    _dai_symbol = "dai"
    _sifchain_user = USER

    send_eth_lock(_sifchain_user, _dai_symbol, _amount)

    print("########## Basic Happy Path Scenario One Over ##########")

def basic_happy_path_scenario_2():
    '''
    Scenario:   A user locks 5 eth in the bridgebank.
    Outcome:    User is minted 5 ceth in their sifchain recipient address
    '''

    print("########## Basic Happy Path Scenario Two Start ##########")

    _amount = 5 * 10 ** 18
    _bridge_bank_address = bridge_bank_address
    _eth_symbol = "eth"
    _network_password = network_password
    _sifchain_user = USER
    _sif_eth_symbol = "ceth"

    bridge_bank_balance_before_tx = get_eth_balance(
        _bridge_bank_address,
        _eth_symbol)

    user_balance_before_tx = get_sifchain_balance(
        _sifchain_user,
        _sif_eth_symbol,
        _network_password)

    print(f"send_eth_lock({_sifchain_user}, {_eth_symbol}, {_amount})")
    send_eth_lock(_sifchain_user, _eth_symbol, _amount)

    assert wait_for_eth_balance(
        _bridge_bank_address,
        _eth_symbol,
        bridge_bank_balance_before_tx + _amount
    ), "Basic Happy Path Scenario 2 Failed: Incorrect Eth Balance"

    assert wait_for_sifchain_balance(
        _sifchain_user,
        _sif_eth_symbol,
        _network_password,
        user_balance_before_tx + _amount
    ), "Basic Happy Path Scenario 2 Failed: Incorrect Sifchain Balance"

    print("########## Basic Happy Path Scenario Two Over ##########")

def basic_happy_path_scenario_3():
    '''
    Scenario:   A user locks $2000 worth of rowan up on sifchain.

    Outcome:    User receives same amount of erowan minted to their
                ethereum recipient address.
    '''

    raise NotImplementedError

def basic_happy_path_scenario_4():
    '''
    Scenario:   A user burns $2000 worth of erowan on ethereum.

    Outcome:    The user receives $2000 worth of rowan on their sifchain
                recipient address.
    '''

    print("########## Basic Happy Path Scenario Four Start ##########")

    _user = USER
    _rowan_contract = ROWAN_CONTRACT
    _amount = 2000

    burn_peggyrwn(_user, _rowan_contract, _amount)

    print("########## Basic Happy Path Scenario Four Over ##########")

def basic_sad_path_scenario_1():
    '''
    Scenario:   A user deposits 15 eth into the bridge bank smart contract
                by calling the lock function. Deposit limits for ethereum
                are 10eth

    Outcome:    transaction reverts as this deposit is over the threshold
                for deposited funds.
    '''
    raise NotImplementedError

def basic_sad_path_scenario_2():
    '''
    Scenario:   A user burns 15 ceth on sifchain to redeem their ethereum
                on an ethereum account.

    Outcome:    Transaction fails as this is over the sifchain max amount
                of ceth to burn. The user still has that 15 ceth in their
                wallet.
    '''
    raise NotImplementedError

def basic_sad_path_scenario_3():
    '''
    Scenario:   A user locks $10,000 rowan on sifchain to redeem their
                ethereum on an ethereum account.

    Outcome:    Transaction fails as this is over the sifchain max
                amount of rowan to lock. The user still has that $10,000
                worth of rowan in their wallet. No erowan is minted.
    '''
    raise NotImplementedError

def basic_sad_path_scenario_4():
    '''
    Scenario:   A user burns $10,000 erowan on ethereum to redeem their
                rowan on a sifchain account.

    Outcome:    Transaction fails as this is over the ethereum smart contract
                max amount of rowan to burn. The user still has that $10,000
                worth of rowan in their ethereum wallet. No rowan is unlocked.

    '''
    raise NotImplementedError

def advanced_security_scenario_1():
    '''
    Scenario:   A user tries to submit a new prophecy claim on ethereum and is
                not a registered validator in the valset.sol smart contract.

    Outcome:    Transaction reverts and prophecy claim is not submitted.

    '''
    raise NotImplementedError

def advanced_security_scenario_2():
    '''
    Scenario:   A user tries to submit a new prophecy claim on sifchain and is
                not a registered validator in the keeper that tracks this.

    Outcome:    Transaction on sifchain fails and does not create a new
                prophecy claim.
    '''
    raise NotImplementedError


def test_balance_does_not_change_without_manual_block_advance():
    print("########## test_balance_does_not_change_without_manual_block_advance")

    user_balance_before_tx = get_sifchain_balance(USER, SIF_ETH, network_password)
    send_eth_lock(USER, ETHEREUM_ETH, AMOUNT)

    advance_n_ethereum_blocks(n_wait_blocks / 2)

    # what we really want is to know that ebrelayer has done nothing,
    # but it's not clear how to get that, so we just wait a bit
    time.sleep(6)

    user_balance_before_required_wait = get_sifchain_balance(USER, SIF_ETH, network_password)

    print(f"Starting balance {user_balance_before_tx}, current balance {user_balance_before_required_wait} should be equal")

    if user_balance_before_required_wait != user_balance_before_tx:
        print_error_message(f"balance should not have changed yet.  Starting balance {user_balance_before_tx}, current balance {user_balance_before_required_wait}")

    advance_n_ethereum_blocks(n_wait_blocks)

    wait_for_sifchain_balance(USER, SIF_ETH, network_password, user_balance_before_tx + AMOUNT)
    print(f"final balance is {get_sifchain_balance(USER, SIF_ETH, network_password)}")


if __name__ == '__main__':
    test_case_1()
    test_case_2()
    try:
        test_balance_does_not_change_without_manual_block_advance()
    except:
        print("This is expected to fail until we get the block waiting PR")
