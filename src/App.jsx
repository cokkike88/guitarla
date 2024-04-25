import { useState, useEffect } from 'react'
import Header from './components/Header'
import Guitar from "./components/Guitar.jsx"
import { db } from './db/data.js'

function App() {

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

  return (
    <>
        <Header
            cart={cart}
            removeFromCart={removeFromCart}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            cleanCart={cleanCart}
        />

        <main className="container-xl mt-5">
            <h2 className="text-center">Nuestra Colección</h2>

            <div className="row mt-5">
                {
                    data.map((item) => (
                        <Guitar
                            key={item.id}
                            guitar={item}
                            addToCart={addToCart}
                        />
                    ))
                }
            </div>
        </main>


        <footer className="bg-dark mt-5 py-5">
            <div className="container-xl">
                <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
            </div>
        </footer>
    </>
  )
}

export default App
