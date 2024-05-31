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
    const settlement = useAppSelector((state) => state.settlement.data)
    const [amount, setAmount] = useState(0);
    const [status, setStatus] = useState("Not sent");

    useEffect(() => {

        const fetchAsync = async () => {
            const serverData: any = await dispatch(thunkGetSettlement())
        }

        fetchAsync()
    }, [])

    useEffect(() => {
        document.title = 'Party B'
    }, [])

    return (
        <>
            <Link href='/'>
                <div className="back"><FontAwesomeIcon icon={faChevronLeft} /> Back</div>
            </Link>
            <div className={styles.main_content}>
                <div className={styles.status_wrapper}>Status:
                    {(status === "Not sent") && <span className={styles.not_sent}>{status}</span>}
                    {(status === "Sent") && <span className={styles.sent}>{status}</span>}
                    {(status === "Rejected") && <span className={styles.rejected}>{status}</span>}
                    {(status === "Accepted") && <span className={styles.accepted}>{status}</span>}
                </div>
                <div className={styles.submit_wrapper}>
                    $<input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
                    <button onClick={handleSubmit} className="button-dark">Submit</button>
                </div>            </div>
        </>
    )
}