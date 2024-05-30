'use client';
import { useAppSelector, useAppDispatch } from "../redux/store"
import { useEffect, useState } from "react";
import styles from "./dashboard.module.css"
import Link from "next/link";
import Image from 'next/image'
import { thunkGetAllInventory, thunkAddInventory, thunkUpdateInventory } from "../redux/settlement";
import { thunkGetAllQuotes } from "../redux/quotes";
import DataTable from "react-data-table-component";

const inventoryColumns = [
    {
        name: 'Item',
        selector: (row: any) => row.name,
        sortable: true,
    },
    {
        name: 'Quantity',
        selector: (row: any) => row.quantity,
        sortable: true,
    },
    {
        name: 'Dimensions',
        selector: (row: any) => row.dimensions,
        sortable: true,
    },
    {
        name: 'Price',
        selector: (row: any) => row.price,
        sortable: true,
    },
];

const quotesColumns = [
    {
        name: 'Email',
        selector: (row: any) => row.customer_email,
        sortable: true,
        width: '150px'
    },
    {
        name: 'First Name',
        selector: (row: any) => row.customer_first_name,
        sortable: true,
        width: '120px'
    },
    {
        name: 'Last Name',
        selector: (row: any) => row.customer_last_name,
        sortable: true,
        width: '120px'
    },
    {
        name: 'Total Price ($)',
        selector: (row: any) => row.total_price,
        sortable: true,
        width: '140px'
    },
    {
        name: 'Date Created',
        selector: (row: any) => row.created_at.split("T").join(' ').slice(0, 19),
        sortable: true,
        width: '200px'
    },
    {
        name: 'Text',
        selector: (row: any) => row.text,
        sortable: true,
    },
];


export default function Page() {
    const dispatch = useAppDispatch()
    const inventory = useAppSelector((state) => state.inventory.items)
    const quotes = useAppSelector((state) => state.quotes.quotes)
    const [tab, setTab] = useState('inventory')
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState(0)
    const [dimensions, setDimensions] = useState('')
    const [price, setPrice] = useState(0.00)

    useEffect(() => {

        const fetchAsync = async () => {
            const inventoryData: any = await dispatch(thunkGetAllInventory())
            const quotesData: any = await dispatch(thunkGetAllQuotes())
        }

        fetchAsync()
    }, [])


    const handleAddItem = async () => {
        for (let item of inventory) {
            if (item.name === name && item.dimensions === dimensions && Number(item.price) === price) {
                console.log("updating")
                const updatedQuantity = item.quantity + quantity
                console.log(updatedQuantity)
                const itemId = item.id
                const serverData = await dispatch(thunkUpdateInventory(itemId, {
                    name,
                    quantity: updatedQuantity,
                    dimensions,
                    price
                }))
                if (serverData.errors) {
                    console.error(serverData.errors)
                }
                return
            }
        }

        const serverData = await dispatch(thunkAddInventory({
            name,
            quantity,
            dimensions,
            price
        }))
        if (serverData.errors) {
            console.error(serverData.errors)
        }
    }

    return (
        <div className={styles.main_content}>
            <Link href={'/'}>
                <Image src='https://assets-global.website-files.com/6429b8ca66cfe6b6f88c2c07/6429c71369d01c2c4c258ce5_Type%3DTransparent%2C%20Color%3DCrusta.svg'
                    width={183}
                    height={100}
                    alt="Cloudforge logo"
                    className='logo'
                />
            </Link>
            <div className={styles.tab_selector}>
                <div className={`${styles.tab} ${tab === 'inventory' ? styles.tab_selected : ''}`} onClick={() => setTab('inventory')}>Inventory</div>
                <div className={`${styles.tab} ${tab === 'quotes' ? styles.tab_selected : ''}`} onClick={() => setTab('quotes')}>Quotes</div>
            </div>
            {tab === 'inventory' && (
                <>
                    <DataTable
                        columns={inventoryColumns}
                        data={inventory}
                        pagination
                        theme="dark"
                    />
                    <div className={styles.add_inventory}>
                        <div className={styles.add_inventory_header}>Item</div>
                        <div className={styles.add_inventory_header}>Quantity</div>
                        <div className={styles.add_inventory_header}>Dimensions</div>
                        <div className={styles.add_inventory_header}>Price</div>
                        <div />
                        <input type="text" placeholder="Item" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="number" placeholder="0" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                        <input type="text" placeholder="Dimensions" value={dimensions} onChange={(e) => setDimensions(e.target.value)} />
                        <input type="number" placeholder="0.00" name="price" min="0" step="0.01" pattern="^\d+(?:\.\d{1,2})?$" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />
                        <button onClick={handleAddItem} className="button-light">Add Item</button>
                    </div>
                </>
            )}
            {tab === 'quotes' && <DataTable
                columns={quotesColumns}
                data={quotes}
                pagination
                theme="dark"
            />
            }
        </div>
    )
}