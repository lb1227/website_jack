import React from "react";

const COIN_PACKAGES = [
  { id: "starter", amount: 100, price: "$0.99", bonus: "Great for unlocking a chapter" },
  { id: "reader", amount: 550, price: "$4.99", bonus: "Most popular" },
  { id: "collector", amount: 1200, price: "$9.99", bonus: "Includes 200 bonus coins" },
  { id: "vault", amount: 2600, price: "$19.99", bonus: "Best value" },
];

export default function Coins() {
  return (
    <main className="coins-page page-shell">
      <section className="coins-hero">
        <p className="coins-kicker">PensUp Wallet</p>
        <h1>Buy Coins</h1>
        <p>
          Use coins to unlock premium chapters, tip your favorite creators, and access special story drops.
        </p>
      </section>

      <section className="coins-grid" aria-label="Coin packages">
        {COIN_PACKAGES.map((coinPackage) => (
          <article className="coin-card" key={coinPackage.id}>
            <p className="coin-amount">🪙 {coinPackage.amount.toLocaleString()} coins</p>
            <p className="coin-price">{coinPackage.price}</p>
            <p className="coin-bonus">{coinPackage.bonus}</p>
            <button className="btn glow-danger" type="button">
              Buy now
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
