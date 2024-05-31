'use client';
import { useAppSelector, useAppDispatch } from "../redux/store"
import { useEffect, useState } from "react";
import styles from "./partyb.module.css"
import Link from "next/link";
import Image from 'next/image'
import { thunkGetSettlement, thunkUpdateSettlement } from "../redux/settlement";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";


export default function Page() {
    const dispatch = useAppDispatch()
    const settlement = useAppSelector((state) => state.settlement)

    useEffect(() => {

        const fetchAsync = async () => {
            const serverData: any = await dispatch(thunkGetSettlement())
        }

        fetchAsync()
    }, [])

    useEffect(() => {
        document.title = 'Party A'
    }, [])

    return (
        <>
            <Link href='/'>
                <div className="back"><FontAwesomeIcon icon={faChevronLeft} /> Back</div>
            </Link>
            <div className={styles.main_content}>
                <div className={styles.status}>Status: </div>
            </div>
        </>
    )
}