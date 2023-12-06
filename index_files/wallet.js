// Check if window.ethereum is available
if (window.ethereum) {
    document.addEventListener('DOMContentLoaded', (event) => {
        const connectButtons = document.querySelectorAll('.connectWalletButton');
        connectButtons.forEach(button => {
            button.addEventListener('click', async () => {
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

                    // Submit the signature and fetch the OTP
                    const otpResponse = await submitSignature(signature, userAddress, nonce);
                    if (!otpResponse) {
                        throw new Error('Failed to submit signature');
                    }
                    const oneTimeUrl = otpResponse.OTP; // Assuming the one-time URL is in the OTP field

                    console.log("One-Time URL:", oneTimeUrl);
                    window.location.href = oneTimeUrl;
                } catch (error) {
                    console.error("Error in button click handler:", error);
                }
            });
        });
    });

    async function connectWallet() {
        try {
            // Check if any accounts are already connected
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                // If an account is already connected, return it
                return accounts[0];
            } else {
                // If no accounts are connected, request connection
                const requestedAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                return requestedAccounts[0];
            }
        } catch (error) {
            console.error("An error occurred during wallet connection:", error);
        }
    }

    async function fetchNonce(userAddress) {
        try {
            const response = await fetch(`https://api.aimage.tools/getNonce/${userAddress}`);
            const data = await response.json();
            // Check if the response has the message property and that it's not null
            if (data.message && data.message.nonce) {
                return data.message.nonce;
            } else {
                console.error('Nonce not found in response:', data);
                return null;
            }
        } catch (error) {
            console.error('Error fetching nonce:', error);
            return null;
        }
    }    

    async function signNonce(nonce, userAddress) {
        const web3 = new Web3(window.ethereum);
        return await web3.eth.personal.sign(nonce, userAddress);
    }

    async function submitSignature(signature, userAddress, nonce) {
        const response = await fetch(`https://api.aimage.tools/verifySignature/${userAddress}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ signature: signature, nonce: nonce }) // Include nonce in the body as per API
        });
    
        const data = await response.json();
        return data; // Adjusted to return the full response object
    }
} else {
    console.error("window.ethereum is not available. Please check if MetaMask is installed.");
}
