document.addEventListener('DOMContentLoaded', (event) => {
    console.log("Script loaded");
    document.getElementById('connectWalletButton').addEventListener('click', async () => {
        console.log("Button clicked");
        try {
            const userAddress = await connectWallet();
            if (!userAddress) {
                throw new Error('Wallet connection failed');
            }

            const nonce = await fetchNonce(userAddress);
            if (!nonce) {
                throw new Error('Failed to fetch nonce');
            }

            const signature = await signNonce(nonce, userAddress);
            if (!signature) {
                throw new Error('Failed to sign nonce');
            }

            const oneTimeUrl = await submitSignature(signature, userAddress);
            if (!oneTimeUrl) {
                throw new Error('Failed to submit signature');
            }

            // Display the URL or navigate to it
            console.log("One-Time URL:", oneTimeUrl);
            window.location.href = oneTimeUrl; // Navigate to the URL
        } catch (error) {
            console.error("An error occurred:", error);
        }
    });

    async function connectWallet() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                return accounts[0];
            } catch (error) {
                console.error("User denied account access");
            }
        } else {
            console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
        }
    }

    async function fetchNonce(userAddress) {
        // Update with your new API endpoint
        const response = await fetch('https://api.aimage.tools/getNonce', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address: userAddress }),
        });
    
        const data = await response.json();
        return data.nonce;
    }    

    async function signNonce(nonce, userAddress) {
        const web3 = new Web3(window.ethereum);
        return await web3.eth.personal.sign(nonce, userAddress);
    }

    async function submitSignature(signature, userAddress) {
        // Update with your new API endpoint
        const response = await fetch('https://api.aimage.tools/verifySignature', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ signature: signature, address: userAddress }),
        });
    
        const data = await response.json();
        return data.oneTimeUrl;
    } 
});
