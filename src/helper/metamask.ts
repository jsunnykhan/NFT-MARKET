import Web3Modal from "web3modal";
import { ethers } from "ethers";

export const signInRequestMetaMask = async () => {
    //   const msgParams = JSON.stringify({
    //     domain: {
    //       // Defining the chain aka Rinkeby testnet or Ethereum Main Net
    //       chainId: 1,
    //       // Give a user friendly name to the specific contract you are signing for.
    //       name: "Ether Mail",
    //       // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
    //       verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
    //       // Just let's you know the latest version. Definitely make sure the field name is correct.
    //       version: "1",
    //     },

    //     // Defining the message signing data content.
    //     message: {
    //       /*
    //            - Anything you want. Just a JSON Blob that encodes the data you want to send
    //            - No required fields
    //            - This is DApp Specific
    //            - Be as explicit as possible when building out the message schema.
    //           */
    //       contents: `
    //       I want to login on Rarible at ${Date.now().toString()}. I accept the Rarible Terms of Service https://static.rarible.com/terms.pdf and I am at least 13 years old.`,
    //       attachedMoneyInEth: 4.2,


    //     },
    //     // Refers to the keys of the *types* object below.
    //     primaryType: "Mail",
    //     types: {
    //       // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
    //       EIP712Domain: [
    //         { name: "name", type: "string" },
    //         { name: "version", type: "string" },
    //         { name: "chainId", type: "uint256" },
    //         { name: "verifyingContract", type: "address" },
    //       ],
    //       // Not an EIP712Domain definition
    //       Group: [
    //         { name: "name", type: "string" },
    //         { name: "members", type: "Person[]" },
    //       ],
    //       // Refer to PrimaryType
    //       Mail: [
    //         { name: "from", type: "Person" },
    //         { name: "to", type: "Person[]" },
    //         { name: "contents", type: "string" },
    //       ],
    //       // Not an EIP712Domain definition
    //       Person: [
    //         { name: "name", type: "string" },
    //         { name: "wallets", type: "address[]" },
    //       ],
    //     },
    //   });

    //   //   const  from = web3.eth.accounts[0];

    //   const web3modal = new Web3Modal();
    //   const connectMA = await web3modal.connect();
    //   const provider = new ethers.providers.Web3Provider(connectMA);
    //   const signer = provider.getSigner();
    //   const from = await signer.getAddress();
    //   var params = [from, msgParams];

    //   var method = "eth_signTypedData_v4";

    //   web3.currentProvider.sendAsync(
    //     {
    //       method,
    //       params,
    //       from,
    //     },
    //     function (err, result) {
    //       if (err) return console.dir(err);
    //       if (result.error) {
    //         alert(result.error.message);
    //       }
    //       if (result.error) return console.error("ERROR", result);
    //       console.log("TYPED SIGNED:" + JSON.stringify(result.result));

    //       const recovered = sigUtil.recoverTypedSignature_v4({
    //         data: JSON.parse(msgParams),
    //         sig: result.result,
    //       });

    //       if (
    //         ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)
    //       ) {
    //         alert("Successfully recovered signer as " + from);
    //       } else {
    //         alert(
    //           "Failed to verify signer when comparing " + result + " to " + from
    //         );
    //       }
    //     }
    //   );
};
