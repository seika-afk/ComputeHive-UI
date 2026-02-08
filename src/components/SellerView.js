import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const SellerView = ({ nfts, escrow, nftContract, provider, account, setRole, reloadNfts }) => {
  const [activeLeases, setActiveLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showListForm, setShowListForm] = useState(false);
  const [listingNFT, setListingNFT] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', ram: '', duration: '', price: '', command: '' });

  useEffect(() => {
    if (escrow && nfts.length > 0) {
      loadActiveLeases();
      const interval = setInterval(loadActiveLeases, 5000);
      return () => clearInterval(interval);
    }
  }, [nfts, escrow]);

  const loadActiveLeases = async () => {
    if (!escrow || nfts.length === 0) return;
    const leases = [];
    for (const nft of nfts) {
      try {
        const buyer = await escrow.buyer(nft.id);
        const leaseStart = await escrow.leaseStart(nft.id);
        if (buyer !== ethers.constants.AddressZero && leaseStart.toNumber() > 0) {
          const leaseDuration = await escrow.leaseDuration(nft.id);
          const now = Math.floor(Date.now() / 1000);
          const timeLeft = (leaseStart.toNumber() + leaseDuration.toNumber()) - now;
          leases.push({ ...nft, timeLeft, isExpired: timeLeft <= 0 });
        }
      } catch (err) { console.error(err); }
    }
    setActiveLeases(leases);
    setLoading(false);
  };

  const handleListNewNFT = async (e) => {
    e.preventDefault();
    try {
      setListingNFT(true);
      const signer = provider.getSigner();
      const metadata = { name: formData.name, description: formData.description, ram: formData.ram, command: formData.command };
      
      const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', 
        { pinataContent: metadata }, 
        { headers: { Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}` }}
      );
      const tokenURI = `ipfs://${res.data.IpfsHash}`;

      await (await nftContract.connect(signer).mint(tokenURI)).wait();
      const tokenId = (await nftContract.totalSupply()).toNumber();
      await (await nftContract.connect(signer).approve(escrow.address, tokenId)).wait();
      
      const priceInWei = ethers.utils.parseEther(formData.price);
      await (await escrow.connect(signer).list(tokenId, priceInWei, formData.ram, formData.name, formData.description, formData.command)).wait();

      setShowListForm(false);
      reloadNfts?.();
    } catch (err) { console.error(err); } finally { setListingNFT(false); }
  };

  return (
    <div className="seller-view">
      <div className="header-section">
        <h2>SELLER_DASHBOARD</h2>
        <div>
          <button onClick={() => setShowListForm(!showListForm)} style={{ marginRight: '10px' }}>
            {showListForm ? 'CANCEL_OP' : 'NEW_LISTING'}
          </button>
          <button onClick={() => setRole(null)}>RETURN</button>
        </div>
      </div>

      {showListForm && (
        <form onSubmit={handleListNewNFT}>
          <h3>MINT_RESOURCE_NFT</h3>
          <input placeholder="RESOURCE_NAME" onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <input placeholder="RAM_ALLOCATION" onChange={e => setFormData({ ...formData, ram: e.target.value })} />
          <textarea placeholder="SYSTEM_DESCRIPTION" onChange={e => setFormData({ ...formData, description: e.target.value })} />
          <input placeholder="PRICE_ETH" onChange={e => setFormData({ ...formData, price: e.target.value })} />
          <input placeholder="ACCESS_COMMAND" onChange={e => setFormData({ ...formData, command: e.target.value })} />
          <button disabled={listingNFT} style={{ width: '100%', marginTop: '1rem' }}>
            {listingNFT ? 'UPLOADING...' : 'INITIALIZE_DEPLOYMENT'}
          </button>
        </form>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>ACTIVE_RESOURCE_MONITOR</h3>
        <div className="nft-grid" style={{ marginTop: '1rem' }}>
          {activeLeases.map(lease => (
            <div key={lease.id} className="lease-card">
              <h4>{lease.name}</h4>
              <p>STATUS: {lease.isExpired ? '[AVAILABLE_FOR_RECLAIM]' : '[LEASED]'}</p>
              <p>REMAINING: {lease.timeLeft}s</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerView;
