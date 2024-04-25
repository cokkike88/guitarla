import {useEffect, useMemo, useState} from "react";
import {db} from "../db/data.js";


export const useCart = () => {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart())
    const MAX_ITMES = 5

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (guitar) => {
        const itemExists = cart.findIndex(item => item.id === guitar.id)
        if (itemExists >= 0) {
            const updatedCart = [...cart]
            updatedCart[itemExists].quantity++
            setCart(updatedCart)
        } else {
            guitar.quantity = 1
            setCart(prevState => [...prevState, guitar])
        }
    }

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id))
    }

    function increaseQuantity (guitar) {
        if (guitar.quantity < MAX_ITMES) {
            guitar.quantity += 1
            setCart(prevCart => prevCart.map(item => item.id === guitar.id? guitar : item))
        }
    }

    function decreaseQuantity (guitar) {
        guitar.quantity -= 1
        if (guitar.quantity === 0) {
            removeFromCart(guitar.id)
            return
        }
        setCart(prevCart => prevCart.map(item => item.id === guitar.id? guitar : item))
    }

    function cleanCart () {
        setCart([])
    }

    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cleanCart,
        isEmpty,
        cartTotal
    }
}

