pragma solidity ^0.8.19;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract H2HToken is ERC20, AccessControl {

    bool private _isTransferable = false;

    constructor(uint256 initialSupply) ERC20("H2HToken", "H2H") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _mint(msg.sender, initialSupply);
    }

    modifier onlyMember() {
        require(isMember(msg.sender), "H2H: caller is not the admin");
        _;
    }

    function isMember(address account) public virtual view returns (bool)
    {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function addAdmin(address account) public virtual onlyMember {
        grantRole(DEFAULT_ADMIN_ROLE, account);
    }

    function removeAdmin(address account) public virtual onlyMember {
        require(msg.sender != account, "H2H: can not remove yourself from admin");

        revokeRole(DEFAULT_ADMIN_ROLE, account);
    }

    function setTransferable(bool allow) public onlyMember {
        _isTransferable = allow;
    }

    function transfer(address to, uint256 amount) override public returns (bool) {
        require(isMember(msg.sender) || _isTransferable, "H2H: can not transfer tokens");

        _transfer(msg.sender, to, amount);

        return true;
    }

    function transferFrom(address from, address to, uint256 amount) override public returns (bool) {
        require(isMember(msg.sender) || _isTransferable, "H2H: can not transfer tokens");

        _spendAllowance(from, msg.sender, amount);
        _transfer(from, to, amount);

        return true;
    }
}