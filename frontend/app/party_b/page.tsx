'use client';
import { useAppSelector, useAppDispatch } from "../redux/store"
import { useEffect, useState } from "react";
import styles from "./partyb.module.css"
import Link from "next/link";
import Image from 'next/image'
import { thunkGetSettlement, thunkUpdateSettlement } from "../redux/settlement";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { io } from 'socket.io-client';


let socket: any

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
        if (settlement) {
            setStatus(settlement.status)
            setAmount(settlement.amount)
        }
        console.log(settlement)
    }, [settlement])

    useEffect(() => {
        document.title = 'Party B'
    }, [])


    useEffect(() => {
        socket = io("localhost:8000")
        console.log(socket)
        console.log("RUNNING")

        const payload = {
            type: "newUser",
            method: "POST",
            room: 1,
            user: 1
        }

        socket.on("server", (obj: any) => {
            console.log(obj)
            switch (obj.type) {
                case "a": {
                    console.log('here')
                    return
                }
                case "b": {
                    console.log('here')
                    return
                }
            }

        })

        socket.emit("join", { room: 1, user: payload })


        return (() => {
            socket.emit("leave", { room: 1 })
            socket.disconnect()
        })
    }, [])

    const rejectSettlement = async () => {
        const serverData: any = await dispatch(thunkUpdateSettlement({ amount: amount, status: 'Rejected' }))
        if (serverData.errors) {
            console.error(serverData.errors)
        } else {
            socket.emit('server', { room: 1, type: "b", status: "Rejected" })
            setStatus('Rejected')
        }
    }

    const acceptSettlement = async () => {
        const serverData: any = await dispatch(thunkUpdateSettlement({ amount: amount, status: 'Accepted' }))
        if (serverData.errors) {
            console.error(serverData.errors)
        } else {
            socket.emit('server', { room: 1, type: "b", status: "Accepted" })

            setStatus('Accepted')
        }
    }


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
                <div className={styles.offer_wrapper}>
                    Offer: <div className={styles.offer}>{`$${amount}`}</div>
                </div>
                <div className={styles.response_wrapper}>
                    <button onClick={rejectSettlement} className="button-dark">Reject</button>
                    <button onClick={acceptSettlement} className="button-light">Accept</button>
                </div>
            </div>
        </>
    )
}