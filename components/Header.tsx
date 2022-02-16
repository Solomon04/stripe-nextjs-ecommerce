import {FunctionComponent, useContext} from "react";
import { Fragment } from 'react'
import { SearchIcon, ShoppingBagIcon } from '@heroicons/react/outline'
import { Popover, Transition } from '@headlessui/react'
import CartContext from "./context/CartContext";
import {Stripe} from "stripe";
import {getPriceTotal, getProductDescription, getProductImage, getProductName} from "../utils/computed";

const Header: FunctionComponent = () => {
    const {items, remove} = useContext(CartContext);
    const removeFromCart = (priceID: string) => {
        if(remove) {
            remove(priceID)
        }
    }

    const checkout = async () => {

        const lineItems = items?.map(price => {
            return {
                price: price.id,
                quantity: 1
            };
        });

        const res = await fetch('/api/checkout', {
            method: 'POST',
            body: JSON.stringify({lineItems: lineItems})
        });

        const b = await res.json()
        window.location.href = b.session.url;


        // const session = await stripe.checkout.sessions.create({
        //     success_url: 'http://localhost:3000/success',
        //     cancel_url: 'http://localhost:3000/cancel',
        //     line_items: lineItems,
        //     mode: 'payment',
        // });

        // console.log('here')
    }

    return (
        <header className="relative bg-white">
            <nav aria-label="Top" className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="relative px-4 pb-14 sm:static sm:px-0 sm:pb-0">
                    <div className="h-16 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex-1 flex">
                            <a href="#">
                                Shopping
                            </a>
                        </div>

                        <div className="flex-1 flex items-center justify-end">
                            {/* Cart */}
                            <Popover className="ml-4 flow-root text-sm lg:relative lg:ml-8 z-50">
                                <Popover.Button className="group -m-2 p-2 flex items-center">
                                    <ShoppingBagIcon
                                        className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{items?.length}</span>
                                    <span className="sr-only">items in cart, view bag</span>
                                </Popover.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Popover.Panel className="absolute top-16 inset-x-0 mt-px pb-6 bg-white shadow-lg sm:px-2 lg:top-full lg:left-auto lg:right-0 lg:mt-3 lg:-mr-1.5 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5">
                                        <h2 className="sr-only">Shopping Cart</h2>

                                        <div className="max-w-2xl mx-auto px-4">
                                            <ul role="list" className="divide-y divide-gray-200">
                                                {items?.map((price) => (
                                                    <li key={price.id} className="py-6 flex">
                                                        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                                            <img
                                                                src={getProductImage(price.product)}
                                                                alt={getProductDescription(price.product)}
                                                                className="w-full h-full object-center object-cover"
                                                            />
                                                        </div>

                                                        <div className="ml-4 flex-1 flex flex-col">
                                                            <div>
                                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                                    <h3>
                                                                        {getProductName(price.product)}
                                                                    </h3>
                                                                    <p className="ml-4">${getPriceTotal(price)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 flex items-end justify-between text-sm">
                                                                <div className="flex">
                                                                    <button onClick={e => removeFromCart(price.id)} type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                ))}
                                            </ul>

                                            <button
                                                onClick={checkout}
                                                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                                            >
                                                Checkout
                                            </button>
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </Popover>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
