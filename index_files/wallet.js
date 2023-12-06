async function fetchNonce(userAddress) {
    try {
        const response = await fetch(`https://api.aimage.tools/getNonce/${userAddress}`);
        const data = await response.json();
        if (data.message) {
            // Use a regular expression to extract the nonce value from the message string
            const nonceMatch = data.message.match(/Nonce: (\S+)/);
            if (nonceMatch && nonceMatch.length > 1) {
                return nonceMatch[1]; // This is the nonce value
            } else {
                throw new Error('Nonce not found in the message');
            }
        } else {
            throw new Error('Message property not found in response');
        }
    } catch (error) {
        console.error('Error fetching nonce:', error);
        return null;
    }
}
