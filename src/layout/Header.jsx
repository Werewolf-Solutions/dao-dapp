import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Link } from "react-router-dom";

export default function Header() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [nav, setNav] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for the connect popup
  const [isHoverPopupOpen, setIsHoverPopupOpen] = useState(false); // State for hover popup
  const [hoverTimeout, setHoverTimeout] = useState(null); // Timeout for delayed hiding

  const handleNav = () => {
    setNav(!nav);
  };

  const handleConnectButtonClick = () => {
    setIsPopupOpen(true); // Open the connect popup
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false); // Close the connect popup
  };

  const handleHoverPopupClose = () => {
    setHoverTimeout(
      setTimeout(() => {
        setIsHoverPopupOpen(false);
      }, 200) // Small delay to allow smoother transitions
    );
  };

  const handleHoverPopupOpen = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout); // Cancel the timeout to prevent premature hiding
    }
    setIsHoverPopupOpen(true);
  };

  useEffect(() => {
    if (status === "success") {
      setIsPopupOpen(false); // Close the wallet connection popup
    }
  }, [status]);

  return (
    <div className="fixed inset-x-0 top-0 bg-[#1a202c] text-[#fff] w-full flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 font-bold text-xl z-50">
      <ul className="hidden md:flex items-center">
        <li className="p-4">
          <Link to="/">Home</Link>
        </li>
        <li className="p-4">
          <Link to="/token-sale">Token Sale</Link>
        </li>
        <li className="p-4">
          <Link to="/DAO">DAO</Link>
        </li>
        <li className="p-4">
          <Link to="/account">Account</Link>
        </li>
        <li className="p-4">
          <Link to="/staking">Staking</Link>
        </li>
        <li className="p-4">
          <Link to="/companies">Companies House</Link>
        </li>
        <li className="p-4 relative">
          {account.status === "connected" ? (
            <div
              className="inline-block relative"
              onMouseEnter={handleHoverPopupOpen} // Show hover popup
              onMouseLeave={handleHoverPopupClose} // Start hiding popup
            >
              <button className="bg-[#8e2421] text-white hover:bg-[#8e25219d] p-2 rounded-lg">
                {`${account.address.slice(0, 3)}...${account.address.slice(
                  -3
                )}`}
              </button>
              {isHoverPopupOpen && (
                <div
                  className="absolute top-full mt-2 right-0 bg-gray-800 p-4 rounded-lg shadow-lg"
                  onMouseEnter={handleHoverPopupOpen} // Keep popup open when hovered
                  onMouseLeave={handleHoverPopupClose} // Allow closing after leaving popup
                >
                  <button
                    onClick={disconnect} // Disconnect wallet
                    className="bg-[#8e2421] text-white hover:bg-[#8e25219d] p-2 rounded-lg"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="bg-[#8e2421] text-white hover:bg-[#8e25219d] p-2 rounded-lg"
              onClick={handleConnectButtonClick} // Show connect popup
              onMouseLeave={handleHoverPopupClose}
            >
              Connect Wallet
            </button>
          )}
        </li>
      </ul>

      {/* Popup for Wallet Connection */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handlePopupClose} // Close connect popup when clicking outside
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
          >
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <div className="space-y-4">
              {/* Map through connectors and display buttons for each */}
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  type="button"
                  className="w-full px-6 py-3 bg-blue-600 text-white hover:bg-blue-500 font-semibold rounded-lg shadow-lg transition-all"
                >
                  {connector.name}
                </button>
              ))}
            </div>
            <div className="text-center mt-4">
              <p>Status: {status}</p>
              <p className="text-red-400">{error?.message}</p>
            </div>
            <button
              onClick={handlePopupClose}
              className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
