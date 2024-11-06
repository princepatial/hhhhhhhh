const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("H2H_token_tests", function () {
  let H2HToken;
  let h2hToken;
  let owner;
  let signer;
  let account1;
  let account2;
  let account3;
  let accounts;
  let decimals;

  before(async function () {
    H2HToken = await ethers.getContractFactory("H2HToken");
  });

  beforeEach(async function () {
    [owner, account1, account2, account3, ...accounts] = await ethers.getSigners();

    h2hToken = await H2HToken.deploy(ethers.parseEther("100"));
    decimals = await h2hToken.decimals();
    signer = h2hToken.connect(account1);
  });

  describe("Deployment", function () {
    it('Creates a token with a valid name', async function () {
      expect(await h2hToken.name()).to.equal('H2HToken');
    });

    it('Creates a token with a valid symbol', async function () {
      expect(await h2hToken.symbol()).to.equal('H2H');
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await h2hToken.balanceOf(owner.address);
      expect(await h2hToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should initial supply of tokens equal to the owner number of tokens", async function () {
      const ownerBalance = await h2hToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.parseEther('100', decimals));
    });
  });

  describe("Transactions", function () {
    it('Transfers the right amount of tokens to/from an account', async function () {
      const transferAmount = ethers.parseUnits("100", decimals);

      await expect(h2hToken.transfer(account1.address, transferAmount)).to.changeTokenBalances(
          h2hToken,
          [owner.address, account1.address],
          [-transferAmount, transferAmount]
        );
    });

    it('Emits a transfer event with the right arguments', async function () {
      const transferAmount = ethers.parseUnits("100", decimals);

      await expect(h2hToken.transfer(account1.address, transferAmount))
          .to.emit(h2hToken, "Transfer")
          .withArgs(owner.address, account1.address, transferAmount);
    });

    it('Allows for allowance approvals and queries', async function () {
      const approveAmount = ethers.parseUnits("100", decimals);

      await signer.approve(owner.address, approveAmount);

      expect((await h2hToken.allowance(account1.address, owner.address)))
        .to.equal(approveAmount);
    });

    it('Emits an approval event with the right arguments', async function () {
      const approveAmount = ethers.parseUnits("100", decimals);

      await expect(signer.approve(owner.address, approveAmount))
          .to.emit(h2hToken, "Approval")
          .withArgs(account1.address, owner.address, approveAmount)
    });

    it('Allows an approved spender to transfer from owner', async function () {
      const transferAmount = ethers.parseUnits("100", decimals);

      await h2hToken.transfer(account1.address, transferAmount);
      await signer.approve(owner.address, transferAmount);

      await expect(h2hToken.transferFrom(account1.address, owner.address, transferAmount)).to.changeTokenBalances(
          h2hToken,
          [owner.address, account1.address],
          [transferAmount, -transferAmount]
        );
    });

    it('Emits a transfer event with the right arguments when conducting an approved transfer', async function () {
      const transferAmount = ethers.parseUnits("100", decimals);

      await h2hToken.transfer(account1.address, transferAmount);
      await signer.approve(owner.address, transferAmount);

      await expect(h2hToken.transferFrom(account1.address, owner.address, transferAmount))
          .to.emit(h2hToken, "Transfer")
          .withArgs(account1.address, owner.address, transferAmount)
    });

    it('Revert a transfer due to out of balance', async function () {
      const transferAmount = ethers.parseUnits("10000", decimals);

      await expect(h2hToken.transfer(account1.address, transferAmount))
        .to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it('Allows allowance to be increased and queried', async function () {
      const initialAmount = ethers.parseUnits("100", decimals);
      const incrementAmount = ethers.parseUnits("10000", decimals);
      const expectedAllowance = initialAmount + incrementAmount;

      await signer.approve(owner.address, initialAmount);
      await signer.increaseAllowance(owner.address, incrementAmount);

      expect((await h2hToken.allowance(account1.address, owner.address))).to.equal(expectedAllowance);
    });

    it('Emits approval event when alllowance is increased', async function () {
      const incrementAmount = ethers.parseUnits("10000", decimals);

      await expect(signer.increaseAllowance(owner.address, incrementAmount))
          .to.emit(h2hToken, "Approval")
          .withArgs(account1.address, owner.address, incrementAmount);
    });

    it('Allows allowance to be decreased and queried', async function () {
      const initialAmount = ethers.parseUnits("100", decimals);
      const decrementAmount = ethers.parseUnits("10", decimals);
      const expectedAllowance = initialAmount - decrementAmount;

      await signer.approve(owner.address, initialAmount);
      await signer.decreaseAllowance(owner.address, decrementAmount);

      expect((await h2hToken.allowance(account1.address, owner.address))).to.equal(expectedAllowance);
    });

    it('Emits approval event when alllowance is decreased', async function () {
      const initialAmount = ethers.parseUnits("100", decimals);
      const decrementAmount = ethers.parseUnits("10", decimals);
      const expectedAllowance = initialAmount - decrementAmount;

      await signer.approve(owner.address, initialAmount);

      await expect(signer.decreaseAllowance(owner.address, decrementAmount))
          .to.emit(h2hToken, "Approval")
          .withArgs(account1.address, owner.address, expectedAllowance);
    });

    it('Revert when alllowance is below zero', async function () {
      const decrementAmount = ethers.parseUnits("10", decimals);

      await expect(signer.decreaseAllowance(owner.address, decrementAmount))
        .to.be.revertedWith("ERC20: decreased allowance below zero");
    });

    it('Only admins can transfer tokens', async function () {
      const transferAmount = ethers.parseUnits("100", decimals);
      await h2hToken.transfer(account1.address, transferAmount);

      await expect(h2hToken.connect(account1).transfer(account2.address, transferAmount))
        .to.be.revertedWith("H2H: can not transfer tokens");
    });

    it('Everyone can transfer tokens if admins allows', async function () {
      const transferAmount = ethers.parseUnits("100", decimals);
      await h2hToken.transfer(account1.address, transferAmount);
      await h2hToken.setTransferable(true);

      await expect(h2hToken.connect(account1).transfer(account2.address, transferAmount)).to.changeTokenBalances(
        h2hToken,
        [account1.address, account2.address],
        [-transferAmount, transferAmount]
      );
    });

    it('Only admins can allow token transfers', async function () {
      await expect(h2hToken.connect(account1).setTransferable(true))
        .to.be.revertedWith("H2H: caller is not the admin");

      await h2hToken.addAdmin(account1.address);

      await expect(h2hToken.connect(account1).setTransferable(true))
        .not.to.be.reverted
    });

    it('Removed admins can not allow token transfers', async function () {
      await h2hToken.addAdmin(account1.address);

      await expect(h2hToken.connect(account1).setTransferable(true))
        .not.to.be.reverted

      await h2hToken.removeAdmin(account1.address);

      await expect(h2hToken.connect(account1).setTransferable(false))
        .to.be.revertedWith("H2H: caller is not the admin");
    });

    it('Can not remove yourself from admin', async function () {
      await expect(h2hToken.removeAdmin(owner.address))
        .to.be.revertedWith("H2H: can not remove yourself from admin");
    });

    it('Only admins can transferFrom tokens', async function () {
      const transferAmount = ethers.parseUnits("100", decimals);
      await h2hToken.transfer(account1.address, transferAmount);
      await signer.approve(owner.address, transferAmount);

      await expect(signer.transferFrom(account1.address, account2.address, transferAmount))
        .to.be.revertedWith("H2H: can not transfer tokens");

      await expect(h2hToken.transferFrom(account1.address, account2.address, transferAmount))
        .to.changeTokenBalances(
          h2hToken,
          [account1.address, account2.address],
          [-transferAmount, transferAmount]
        );
    });

    it('Everyone can transferFrom tokens if admins allows', async function () {
      const transferAmount = ethers.parseUnits("100", decimals);
      await h2hToken.transfer(account1.address, transferAmount);
      await h2hToken.setTransferable(true);
      await signer.approve(account3.address, transferAmount);

      await expect(h2hToken.connect(account3).transferFrom(account1.address, account2.address, transferAmount)).to.changeTokenBalances(
        h2hToken,
        [account1.address, account2.address],
        [-transferAmount, transferAmount]
      );
    });
  });
});