import '../styles/globals.css'
import type {AppProps} from 'next/app'
import CartContext, {CartContextProps} from "../components/context/CartContext";
import {useEffect, useState} from "react";
import _ from "lodash";
import {Stripe} from "stripe";

function MyApp({Component, pageProps}: AppProps) {
    const [items, setItems] = useState<Stripe.Price[]>([]);

    const remove = (priceID: string) => {
        let i = _.reject(items, function (item) {
            return item.id === priceID;
        });
        setItems(i)
    }

    const add = (product: Stripe.Price) => {
        let i = _.union(items, [product]);
        setItems(i)
    }

    const cartContext: CartContextProps = {
        items: items,
        add: add,
        remove: remove
    }


    return (
        <CartContext.Provider value={cartContext}>
            <Component {...pageProps} />
        </CartContext.Provider>
    )
}

export default MyApp
