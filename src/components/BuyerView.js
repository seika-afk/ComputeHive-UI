import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const BuyerView = ({ nfts, escrow, nftContract, provider, account, setRole }) => {
  const [listedNfts, setListedNfts] = useState([]);
  const [activeLeases, setActiveLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNft, setSelectedNft] = useState(null);
  const [leaseDuration, setLeaseDuration] = useState(3600);
  const [showPopup, setShowPopup] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    if (escrow && nfts.length > 0) loadListedNfts();
    if (escrow && account) loadActiveLeases();
  }, [nfts, escrow, account]);

  useEffect(() => {
    if (!account) return;
    const interval = setInterval(loadActiveLeases, 5000);
    return () => clearInterval(interval);
  }, [account]);

  const loadListedNfts = async () => {
    if (!escrow || nfts.length === 0) return;
    const listed = [];
    for (const nft of nfts) {
      try {
        const isListed = await escrow.isListed(nft.id);
        if (!isListed) continue;
        const price = await escrow.purchasePrice(nft.id);
        listed.push({ ...nft, price: ethers.utils.formatEther(price) });
      } catch (err) { console.error(err); }
    }
    setListedNfts(listed);
    setLoading(false);
  };

  const loadActiveLeases = async () => {
    if (!escrow || !account || nfts.length === 0) return;
    const leases = [];
    for (const nft of nfts) {
      try {
        const buyer = await escrow.buyer(nft.id);
        if (buyer.toLowerCase() !== account.toLowerCase()) continue;
        const leaseStart = await escrow.leaseStart(nft.id);
        if (leaseStart.toNumber() === 0) continue;
        const duration = await escrow.leaseDuration(nft.id);
        const price = await escrow.purchasePrice(nft.id);
        const command = await escrow.nftCommand(nft.id);
        const now = Math.floor(Date.now() / 1000);
        const endTime = leaseStart.toNumber() + duration.toNumber();
        const timeLeft = endTime - now;
        leases.push({
          ...nft,
          timeLeft,
          isExpired: timeLeft <= 0,
          price: ethers.utils.formatEther(price),
          command
        });
      } catch (err) { console.error(err); }
    }
    setActiveLeases(leases);
  };

  const confirmLease = async () => {
    if (!selectedNft || !account) return;
    try {
      setTransactionPending(true);
      const signer = provider.getSigner();
      const priceInWei = ethers.utils.parseEther(selectedNft.price);
      const tx = await escrow.connect(signer).startLease(selectedNft.id, leaseDuration, { value: priceInWei });
      await tx.wait();
      await nftContract.connect(signer).approve(escrow.address, selectedNft.id);
      setShowPopup(false);
      setShowSuccessPopup(true);
      setTransactionPending(false);
      loadListedNfts();
      loadActiveLeases();
    } catch (err) {
      console.error(err);
      setTransactionPending(false);
    }
  };

  const handleReturnNFT = async (nft) => {
    if (!nft.isExpired) return;
    try {
      const signer = provider.getSigner();
      const tx = await escrow.connect(signer).returnNFT(nft.id);
      await tx.wait();
      loadActiveLeases();
    } catch (err) { console.error(err); }
  };

  const formatDuration = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m ${s % 60}s`;
  };

  return (
    <div className="buyer-view">
      <div className="header-section">
        <h2>BUYER_DASHBOARD</h2>
        <button onClick={() => setRole(null)}>RETURN</button>
      </div>

      {activeLeases.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>ACTIVE_LEASES</h3>
          <div className="nft-grid">
            {activeLeases.map((lease) => (
              <div key={lease.id} className="lease-card">
                <h4>{lease.name}</h4>
                <p>STATUS: {lease.isExpired ? '[EXPIRED]' : '[ACTIVE]'}</p>
                <p>TIME_REMAINING: {lease.isExpired ? '0s' : formatDuration(lease.timeLeft)}</p>
                {!lease.isExpired && (
                  <div className="command-box">
                    <code>{lease.command}</code>
                  </div>
                )}
                {lease.isExpired && <button onClick={() => handleReturnNFT(lease)}>TERMINATE_LEASE</button>}
              </div>
            ))}
          </div>
        </div>
      )}

      <h3>MARKETPLACE_LISTINGS</h3>
      <div className="nft-grid" style={{ marginTop: '1rem' }}>
        {loading ? <p>INITIALIZING...</p> : listedNfts.map((nft) => (
          <div key={nft.id} className="nft-card">
            <h4>{nft.name}</h4>
            <p>{nft.description}</p>
            <p style={{ marginTop: '10px' }}>RAM: {nft.ram}</p>
            <p>COST: {nft.price} ETH</p>
            <button style={{ marginTop: '15px', width: '100%' }} onClick={() => { setSelectedNft(nft); setShowPopup(true); }}>EXECUTE_RENTAL</button>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>CONFIRM_TRANSACTION</h3>
            <p>ID: {selectedNft.id}</p>
            <label>DURATION (SEC)</label>
            <input type="number" value={leaseDuration} onChange={(e) => setLeaseDuration(Number(e.target.value))} />
            <button disabled={transactionPending} onClick={confirmLease}>
              {transactionPending ? 'WAITING...' : 'CONFIRM_AND_SIGN'}
            </button>
            <button onClick={() => setShowPopup(false)} style={{ marginLeft: '10px' }}>ABORT</button>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>PROTOCOL_SUCCESS</h3>
            <p>Lease initialization complete.</p>
            <button onClick={() => setShowSuccessPopup(false)}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerView;
