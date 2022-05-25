import React, { useState, useEffect } from "react";
import Product from "../components/Products"
import CreateProduct from "../components/CreateProduct"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

import HeadComponent from '../components/Head';

// Constants
const TWITTER_HANDLE = "stevedsimkins";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const { publicKey } = useWallet();
  const isOwner = ( publicKey ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY : false );
  const [creating, setCreating] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (publicKey) {
      fetch(`/api/fetchProducts`)
      .then(response => response.json())
      .then(data => {
          setProducts(data)
          console.log("Products:", data)
        })
    }
  }, [publicKey])

  const renderNotConnectedContainer = () => (
    <div>
      <div className="button-container">
        <WalletMultiButton className="cta-button connect-wallet-button" />
      </div>  
    </div>
  )

  const renderItemBuyContainer = () => (
    <div className="product-container">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  )
  
  return (
    <div className="App">
      <HeadComponent/>
      <div className="container">
        <header className="header-container">
          <p className="header">Solana Coffee Shop</p>
          <p className="sub-text">☕️☕️☕️</p>
          {isOwner && (
            <button className="create-product-button" onClick={() => setCreating(!creating)}>
              {creating ? "Close" : "Create Product"}
            </button>
          )}
        </header>

        <main>
          <img className="logo" src="coffee.png" alt="Logo" />
          {creating && <CreateProduct />}
          {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
        </main>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
