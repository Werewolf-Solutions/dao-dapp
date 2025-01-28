import React from "react";

export default function Footer() {
  return (
    <div className="flex justify-center items-center">
      <footer className="fixed bottom-0 text-center bg-[#1a202c] text-[#fff] w-full">
        <div className="flex gap-4 justify-center items-center">
          <a
            href="https://discord.gg/7NupAHw7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-blue-500 transition-all"
          >
            <i className="fab fa-discord"></i> Discord
          </a>
          <a
            href="https://github.com/Werewolf-Solutions/dao-dapp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-blue-500 transition-all"
          >
            <i className="fab fa-github"></i> GitHub
          </a>
        </div>
        <p className="mt-4 text-sm opacity-60">
          &copy; {new Date().getFullYear()} DAO Tester DApp
        </p>
      </footer>
    </div>
  );
}
