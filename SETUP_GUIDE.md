# 🚀 Quick Setup Guide

## Complete File Structure Created

```
nft-escrow-ui/
├── public/
│   └── index.html                 # Main HTML file
├── src/
│   ├── abis/
│   │   ├── Compute_Power.json     # NFT contract ABI
│   │   └── ComputeEscrow.json     # Escrow contract ABI
│   ├── components/
│   │   ├── Navigation.js          # Top navigation bar with wallet connect
│   │   ├── RoleSelect.js          # Role selection screen (Buyer/Seller)
│   │   ├── SellerView.js          # Seller dashboard
│   │   └── BuyerView.js           # Buyer marketplace with lease functionality
│   ├── App.js                     # Main application component
│   ├── App.css                    # 2000s-style CSS
│   ├── index.js                   # React entry point
│   └── config.json                # Contract addresses (UPDATE THIS!)
├── package.json                   # Dependencies
├── .gitignore                     # Git ignore file
└── README.md                      # Full documentation

## 🎯 What This UI Does

### 1. **Role Selection Screen**
   - Clean, centered interface
   - Two big cards: "Buyer" and "Seller"
   - Click to choose your role

### 2. **Seller View** (for Doraemon)
   - Shows all minted NFTs
   - Simple grid layout
   - Back button to return to role selection
   - **Note**: List functionality not implemented yet (as requested)

### 3. **Buyer View** (for everyone)
   - Browse all listed NFTs available for rent
   - Each NFT shows:
     - Name and description
     - Price in ETH
     - "Rent Now" button
   
   - **Lease Flow**:
     1. Click "Rent Now"
     2. Popup appears with lease configuration
     3. Select duration (1h, 2h, 4h, 8h, 24h)
     4. Confirm and pay
     5. MetaMask pops up for transaction
     6. Wait for confirmation
     7. **Success popup appears** with the command:
        ```
        xyzabra_ka_dabra_command
        ```

## 📝 Step-by-Step Setup

### 1. Navigate to the UI folder

```bash
cd /home/claude/nft-escrow-ui
```

### 2. Install dependencies

```bash
npm install
```

### 3. Update contract addresses

Open `src/config.json` and update with your deployed addresses:

```json
{
  "31337": {
    "computePower": {
      "address": "YOUR_DEPLOYED_COMPUTE_POWER_ADDRESS"
    },
    "escrow": {
      "address": "YOUR_DEPLOYED_ESCROW_ADDRESS"
    }
  }
}
```

**Get these addresses from:**
- Your hardhat deployment output
- Or from your previous deployment logs

### 4. Make sure Hardhat node is running

In your contracts directory (separate terminal):

```bash
npx hardhat node
```

### 5. Make sure contracts are deployed

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 6. Start the React app

```bash
npm start
```

Browser will open at `http://localhost:3000`

### 7. Configure MetaMask

1. **Add Network**:
   - Network: Localhost 8545
   - RPC: http://127.0.0.1:8545
   - Chain ID: 31337
   - Symbol: ETH

2. **Import Accounts**:
   - Copy private keys from hardhat node terminal
   - Import Account #1 (Doraemon - seller)
   - Import Account #0 or #2 (buyers)

### 8. Test the Flow

**As Seller (Doraemon - Account #1)**:
1. Connect wallet
2. Click "Seller"
3. See your minted NFTs

**As Buyer (Any other account)**:
1. Connect wallet
2. Click "Buyer"
3. Click "Rent Now" on an NFT
4. Select duration
5. Click "Confirm & Pay"
6. Approve in MetaMask
7. Wait for success popup
8. See command: `xyzabra_ka_dabra_command`

## 🎨 UI Style

- **2000s aesthetic**: Simple, clean, centered
- **No fancy frameworks**: Pure CSS
- **Color scheme**: Blues, greens, grays
- **Buttons**: Big, obvious, with hover effects
- **Popups**: Modal overlays for interactions
- **Grid layout**: For NFT cards
- **Responsive**: Works on different screen sizes

## 🔍 Key Features Implemented

✅ Wallet connection with MetaMask
✅ Role selection (Buyer/Seller)
✅ Load NFTs from blockchain
✅ Display listed NFTs for buyers
✅ Lease configuration popup
✅ Transaction handling with loading states
✅ Success popup with command display
✅ Back navigation between views
✅ IPFS metadata fetching
✅ ETH price display
✅ Duration selection

## 🚫 Not Implemented (As Requested)

❌ Seller listing new NFTs (kept empty for now)
❌ Return NFT functionality
❌ Release payment functionality
❌ Lease timer/countdown

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Can't connect to localhost | Make sure `npx hardhat node` is running |
| Wrong network | Select "Localhost 8545" in MetaMask |
| No NFTs showing | Check if NFTs are minted and listed in your deploy script |
| Transaction fails | Ensure you're using the correct account and have enough ETH |
| Config.json error | Update with correct contract addresses |

## 🎓 What Each File Does

- **App.js**: Main logic, loads contracts, manages state
- **Navigation.js**: Wallet connection button
- **RoleSelect.js**: Choose buyer or seller
- **SellerView.js**: Display NFTs for sellers
- **BuyerView.js**: Marketplace + lease functionality + popups
- **App.css**: All the 2000s-style aesthetics
- **config.json**: Contract addresses (UPDATE THIS!)

## 🔄 Testing Workflow

1. Start hardhat node
2. Deploy contracts
3. Start React app
4. Connect MetaMask (seller account)
5. Choose "Seller" → See NFTs
6. Disconnect wallet
7. Connect MetaMask (buyer account)
8. Choose "Buyer" → See listed NFTs
9. Click "Rent Now"
10. Configure lease
11. Confirm & pay
12. See success with `xyzabra_ka_dabra_command`

## 📦 Moving This to Your Project

Copy the entire `nft-escrow-ui` folder to your project directory, then:

```bash
cd nft-escrow-ui
npm install
# Update config.json with your addresses
npm start
```

That's it! Enjoy your 2000s-style NFT rental marketplace! 🎉
