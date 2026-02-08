import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import RoleSelect from './components/RoleSelect';
import SellerView from './components/SellerView';
import BuyerView from './components/BuyerView';

// ABIs
import ComputePower from './abis/Compute_Power.json';
import ComputeEscrow from './abis/ComputeEscrow.json';

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [account, setAccount] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBlockchainData = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A69' }],
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const network = await provider.getNetwork();
      console.log("Connected to chain:", network.chainId);

      const nftAddress = config[network.chainId].computePower.address;
      const nftContract = new ethers.Contract(nftAddress, ComputePower, provider);
      setNftContract(nftContract);

      const escrowAddress = config[network.chainId].escrow.address;
      const escrow = new ethers.Contract(escrowAddress, ComputeEscrow, provider);
      setEscrow(escrow);

      await loadNFTs(nftContract, escrow);

      setLoading(false);

      window.ethereum.on('accountsChanged', async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(ethers.utils.getAddress(accounts[0]));
      });
    } catch (error) {
      console.error("Error loading blockchain data:", error);
      setLoading(false);
    }
  };

  const loadNFTs = async (contract, escrowContract) => {
    try {
      const totalSupply = await contract.totalSupply();
      const nftList = [];

      for (let i = 1; i <= totalSupply; i++) {
        try {
          // Get contract data
          const ram = await escrowContract.nftRAM(i);
          const name = await escrowContract.nftName(i);
          const description = await escrowContract.nftDescription(i);
          const command = await escrowContract.nftCommand(i);
          
          // Get metadata from IPFS for duration
          let duration = 3600;
          try {
            const uri = await contract.tokenURI(i);
            const ipfsGateway = uri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
            const response = await fetch(ipfsGateway);
            const metadata = await response.json();
            duration = metadata.duration || 3600;
          } catch (e) {
            console.error('Error fetching IPFS metadata for NFT', i, e);
          }

          nftList.push({
            id: i,
            name: name || `Compute Power #${i}`,
            description: description || 'No description available',
            ram: ram || 'N/A',
            command: command || 'No command',
            duration: duration,
            image: '',
          });
        } catch (e) {
          console.error("Failed to load NFT", i, e);
        }
      }

      setNfts(nftList);
    } catch (error) {
      console.error("Error loading NFTs:", error);
    }
  };

  const reloadNfts = async () => {
    if (nftContract && escrow) {
      await loadNFTs(nftContract, escrow);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      
      {!role ? (
        <RoleSelect setRole={setRole} />
      ) : role === 'seller' ? (
        <SellerView 
          nfts={nfts} 
          escrow={escrow}
          nftContract={nftContract}
          provider={provider}
          account={account}
          setRole={setRole}
          reloadNfts={reloadNfts}
        />
      ) : (
        <BuyerView 
          nfts={nfts} 
          escrow={escrow} 
          nftContract={nftContract}
          provider={provider}
          account={account}
          setRole={setRole}
        />
      )}
    </div>
  );
}

export default App;
