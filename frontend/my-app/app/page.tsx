'use client';

import { useState } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useChainId,
} from 'wagmi';
import { injected } from 'wagmi/connectors';

// ==============================
// 🔹 CONFIG
// ==============================

// 👉 GANTI dengan contract address hasil deploy kamu day 2
const CONTRACT_ADDRESS = '0x1302B2ffA64153e87ddFA3010D5D5F8e1D7d227b';

// 👉 ABI SIMPLE STORAGE
const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: 'getValue',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'setValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export default function Page() {
  // ==============================
  // 🔹 WALLET STATE
  // ==============================
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  // ==============================
  // 🔹 LOCAL STATE
  // ==============================
  const [inputValue, setInputValue] = useState('');

  // ==============================
  // 🔹 READ CONTRACT
  // ==============================
  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getValue',
  });

  // ==============================
  // 🔹 WRITE CONTRACT
  // ==============================
  const {
    writeContract,
    isPending: isWriting,
  } = useWriteContract({
    mutation: {
      onSuccess() {
        alert('Transaction success ✅');
        refetch();
      },
      onError() {
        alert('Transaction failed ❌');
      },
    },
  });

  // ==============================
  // 🔹 HANDLERS
  // ==============================
  const handleSetValue = () => {
    if (!inputValue) return;

    alert('Transaction submitted ⏳');

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: SIMPLE_STORAGE_ABI,
      functionName: 'setValue',
      args: [BigInt(inputValue)],
    });
  };

  // ==============================
  // 🔹 HELPERS
  // ==============================
  const getNetworkName = (id?: number) => {
    switch (id) {
      case 43113:
        return 'Avalanche Fuji Testnet';
      case 43114:
        return 'Avalanche Mainnet';
      default:
        return 'Unknown Network';
    }
  };

  const shortenAddress = (addr?: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // ==============================
  // 🔹 UI
  // ==============================
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-l from-[#0F2027] via-[#203A43] to-[#2C5364] text-white">
      <div className="w-full max-w-md rounded-lg p-6 space-y-6 bg-[#0F2027] border border-white">

        <h1 className="text-xl font-bold text-center">
          Day 3 – Frontend dApp (Avalanche)
        </h1>

        <h1 className="text-xs font-bold text-center text-gray-400">
          PALAGUNA || 241011400443
        </h1>

        {/* ==========================
            WALLET CONNECT
        ========================== */}
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isConnecting}
            className={`w-full py-2 rounded-xl border border-white
              ${isConnecting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600'}
            `}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400 text-center">Connected Address</p>
              <p className="font-mono text-xs text-center">
                {shortenAddress(address)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 text-center">Network Status</p>
              <p className="text-sm font-medium text-center">
                {getNetworkName(chainId)}
              </p>
            </div>

            <button
              onClick={() => disconnect()}
              className="w-full bg-red-600 py-2 rounded-xl border border-white"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* ==========================
            READ CONTRACT
        ========================== */}
        <div className="border-t border-gray-700 pt-4 space-y-2">
          <p className="text-sm text-gray-400 text-center">
            Contract Value (read)
          </p>

          {isReading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <p className="text-2xl font-bold text-center">
              {value?.toString()}
            </p>
          )}

          <button
            onClick={() => refetch()}
            className="w-full text-sm underline text-gray-300 text-center"
          >
            Refresh value
          </button>
        </div>

        {/* ==========================
            WRITE CONTRACT
        ========================== */}
        <div className="border-t border-gray-700 pt-4 space-y-3">
          <p className="text-sm text-gray-400 text-center">
            Update Contract Value
          </p>

          <input
            type="number"
            placeholder="New value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 rounded-xl bg-black border border-white text-center"
          />

          <button
            onClick={handleSetValue}
            disabled={isWriting}
            className={`w-full py-2 rounded-xl border border-white
              ${isWriting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600'}
            `}
          >
            {isWriting ? 'Updating...' : 'Set Value'}
          </button>
        </div>

        {/* ==========================
            FOOTNOTE
        ========================== */}
        <p className="text-xs text-gray-500 pt-2 text-center">
          Smart contract = single source of truth
        </p>

      </div>
    </main>
  );
}
