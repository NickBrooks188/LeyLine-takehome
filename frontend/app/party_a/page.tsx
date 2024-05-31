'use client'
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./partya.module.css";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { thunkGetSettlement } from "../redux/settlement";

export default function Page() {
    const [errors, setErrors] = useState("");
    const [amount, setAmount] = useState(0);

    const settlement = useAppSelector((state) => state.settlement)

    const dispatch = useAppDispatch()


    useEffect(() => {
        const getInventory = async () => {
            const serverData = await dispatch(thunkGetSettlement())
        }
        getInventory()
    }, [])


    useEffect(() => {
        document.title = 'Party A'
    }, [])

    return (
        <>
            <Link href='/'>
                <div className="back"><FontAwesomeIcon icon={faChevronLeft} /> Back</div>
            </Link>
            <main className='main'>
                <div className={styles.status}>Status: </div>
            </main>
        </>
    )
}