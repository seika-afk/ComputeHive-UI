# NFT Compute Power Rental Marketplace - Complete Edition

A simple, 2000s-style UI for renting compute power represented as NFTs with full lease management.

## 🚀 New Features

### ✨ Complete Lease Management
- **Duration from NFT Metadata**: Lease duration is extracted from the NFT's IPFS metadata
- **Auto-Approval**: Buyer automatically approves escrow after lease starts (prevents cheating)
- **Active Lease Tracking**: Real-time countdown timers for active leases
- **Return NFT**: Buyers can return NFTs when lease expires
- **Release Payment**: Sellers can claim payment after NFT is returned

### 🎯 Key Improvements
- **Live Countdown Timers**: See exactly how much time is left on each lease
- **Buyer Dashboard**: View all your active leases in one place
- **Seller Dashboard**: Track leases and release payments
- **Smart Contract Protection**: Approval happens automatically - no way for buyers to cheat

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **MetaMask** browser extension
3. **Hardhat local blockchain** running
4. **Contracts deployed** on localhost
5. **Pinata Account** for IPFS uploads

## 🛠️ Setup Instructions

### Step 1: Start Hardhat Node

In your contracts directory:

```bash
npx hardhat node
```

Keep this running in a separate terminal.

### Step 2: Prepare Your Metadata

Make sure your NFT metadata includes a `duration` field (in seconds):

```javascript
let meta_data = {
    name: "High Performance GPU",
    description: "NVIDIA RTX 4090 with 24GB VRAM",
    duration: 3600 // 1 hour in seconds
};
```

### Step 3: Deploy Contracts

Use the updated deploy script (see `deploy-script-example.js`):

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Important**: Copy the deployed contract addresses!

### Step 4: Update Config

Update `/src/config.json` with your contract addresses:

```json
{
  "31337": {
    "computePower": {
      "address": "YOUR_COMPUTE_POWER_ADDRESS_HERE"
    },
    "escrow": {
      "address": "YOUR_ESCROW_ADDRESS_HERE"
    }
  }
}
```

### Step 5: Install UI Dependencies

```bash
cd nft-escrow-ui
npm install
```

### Step 6: Start the React App

```bash
npm start
```

The app will open at `http://localhost:3000`

### Step 7: Configure MetaMask

1. **Add Network**:
   - Network: Localhost 8545
   - RPC: http://127.0.0.1:8545
   - Chain ID: 31337
   - Symbol: ETH

2. **Import Accounts**:
   - Copy private keys from hardhat node terminal
   - Import Account #1 (Doraemon - seller)
   - Import Account #0 or #2 (buyers)

## 🎮 Complete Usage Flow

### As a Seller (Doraemon)

1. **Connect wallet** with seller account
2. **Select "Seller" role**
3. **View your NFTs** - see all minted compute power
4. **Track active leases**:
   - See who's renting
   - Watch countdown timers
   - Monitor NFT status (with buyer / returned)
5. **Release payment** when:
   - Lease has expired
   - NFT has been returned
   - Click "💰 Release Payment" button

### As a Buyer

1. **Connect wallet** with buyer account
2. **Select "Buyer" role**
3. **Browse marketplace** - see available compute power
4. **Rent compute power**:
   - Click "Rent Now"
   - Review lease details (duration from metadata)
   - Confirm and pay
   - ✅ **Auto-approval happens** (can't cheat!)
5. **Use your lease**:
   - See command: `xyzabra_ka_dabra_command`
   - Watch countdown timer
6. **Return NFT when expired**:
   - Timer shows "Expired"
   - Click "Return NFT" button
   - Seller can now release payment

## 🔄 Complete Lease Lifecycle

```
1. Seller lists NFT with price
   ↓
2. Buyer rents (pays + NFT transfers to buyer)
   ↓
3. Buyer AUTOMATICALLY approves escrow (anti-cheat!)
   ↓
4. Buyer uses compute power (timer counts down)
   ↓
5. Lease expires (timer hits 0)
   ↓
6. Buyer returns NFT to escrow
   ↓
7. Seller releases payment (gets their money)
   ↓
8. Cycle complete! NFT back in escrow, can be re-listed
```

## 📝 NFT Metadata Format

Your IPFS metadata MUST include the `duration` field:

```json
{
  "name": "High Performance GPU",
  "description": "NVIDIA RTX 4090 with 24GB VRAM",
  "duration": 3600,
  "image": "ipfs://..."
}
```

**Duration values** (in seconds):
- 1 hour = 3600
- 2 hours = 7200
- 4 hours = 14400
- 8 hours = 28800
- 24 hours = 86400

## 🎨 UI Features

### Buyer Dashboard
- **Active Leases Card**: Shows all your current rentals
  - Live countdown timer
  - NFT details
  - Access command
  - Return button (when expired)
- **Marketplace**: Browse available compute power
  - Duration displayed from metadata
  - Price in ETH
  - Rent Now button

### Seller Dashboard
- **Stats Overview**: Total NFTs and active leases
- **Active Leases Tracking**:
  - Buyer address
  - Live countdown timer
  - NFT status (with buyer / returned)
  - Release payment button (when ready)
- **All NFTs Grid**: View all your minted compute power

## 🔐 Anti-Cheat Protection

**The Problem**: What if a buyer refuses to approve the NFT transfer back?

**The Solution**: 
1. Lease starts → NFT transfers to buyer
2. **Immediately after**, buyer's wallet automatically approves escrow
3. This happens in the same transaction flow
4. Buyer can't skip it or refuse
5. When lease expires, escrow can take NFT back

This is why you see TWO MetaMask popups when renting:
1. Start lease + pay
2. Approve escrow (automatic, required)

## 📁 Project Structure

```
nft-escrow-ui/
├── public/
│   └── index.html
├── src/
│   ├── abis/
│   │   ├── Compute_Power.json
│   │   └── ComputeEscrow.json
│   ├── components/
│   │   ├── Navigation.js          # Wallet connection
│   │   ├── RoleSelect.js          # Choose buyer/seller
│   │   ├── SellerView.js          # Seller dashboard with release payment
│   │   └── BuyerView.js           # Buyer dashboard with active leases
│   ├── App.js                     # Main app logic
│   ├── App.css                    # 2000s-style CSS
│   ├── index.js                   # React entry point
│   └── config.json                # Contract addresses
├── deploy-script-example.js       # Example deploy with duration
├── package.json
└── README.md
```

## 🐛 Troubleshooting

### Duration not showing
- Make sure your metadata includes `"duration": 3600`
- Upload metadata to IPFS with duration field
- Check browser console for metadata fetch errors

### Can't return NFT
- Wait for lease to expire (timer shows "Expired")
- Make sure you approved escrow when starting lease
- Check you're connected with the buyer account

### Can't release payment
- Lease must be expired
- NFT must be returned to escrow
- You must be connected as the seller (doraemon)

### Countdown timer not updating
- Timers update every 5 seconds automatically
- Refresh page if stuck
- Check browser console for errors

### MetaMask shows wrong network
- Switch to "Localhost 8545"
- Chain ID must be 31337
- Make sure hardhat node is running

## 🎨 UI Design Philosophy

- **2000s Aesthetic**: Clean, simple, straightforward
- **No Frameworks**: Pure CSS, no Bootstrap/Tailwind
- **Clear Actions**: Big buttons, obvious next steps
- **Real-time Updates**: Live countdown timers
- **Color Coding**:
  - 🟢 Green: Active leases
  - 🟠 Orange: Expired leases
  - 🔵 Blue: Primary actions

## 📜 License

MIT

---

Built with ⚡ for decentralized compute power rental

## 🆘 Need Help?

Common issues and their solutions are in the Troubleshooting section above. If you're still stuck, check:

1. Is hardhat node running?
2. Are contracts deployed?
3. Is config.json updated with correct addresses?
4. Is MetaMask on localhost network (31337)?
5. Does your metadata include the duration field?
