'use client'
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./partya.module.css";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { thunkGetSettlement, thunkAddSettlement, thunkUpdateSettlement } from "../redux/settlement";
import { io } from 'socket.io-client';

let socket: any

export default function Page() {
    const [errors, setErrors] = useState("");
    const [amount, setAmount] = useState(0);
    const [status, setStatus] = useState("Not offered");
    const [change, setChange] = useState(false);

    const settlement = useAppSelector((state) => state.settlement?.data)

    const dispatch = useAppDispatch()

    useEffect(() => {
        const getSettlement = async () => {
            const serverData = await dispatch(thunkGetSettlement())
        }
        getSettlement()
    }, [])


    useEffect(() => {
        if (settlement) {
            setStatus(settlement.status)
            setAmount(settlement.amount)
        }
    }, [settlement])


    useEffect(() => {
        document.title = 'Party A'
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
                    return
                }
                case "b": {
                    console.log('here')
                    setChange(true)
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

    const handleSubmit = async () => {
        if (status === 'Accepted') return
        if (change) {
            alert('The other party has responded to the settlement. Please refresh the page to see the response.')
            return
        }
        if (!settlement) {
            const serverData = await dispatch(thunkAddSettlement({ amount, status: 'Offered' }))
            console.log(serverData)
            if (serverData.errors) {
                console.error(serverData.errors)
                setErrors(serverData.errors)
            } else {
                socket.emit('server', { room: 1, type: "a", amount })
                setStatus('Offered')
            }
        } else {
            const serverData = await dispatch(thunkUpdateSettlement({ amount, status: 'Offered' }))
            if (serverData.errors) {
                console.error(serverData.errors)
                setErrors(serverData.errors)
            } else {
                socket.emit('server', { room: 1, type: "a", amount })
            }
        }
    }

    return (
        <>
            <Link href='/'>
                <div className="back"><FontAwesomeIcon icon={faChevronLeft} /> Back</div>
            </Link>
            <main className='main'>
                <div className={styles.status_wrapper}><div className="gray-text">Status</div>
                    <div className="horizontal_divider" />
                    {(status === "Not offered") && <span className={styles.not_offered}>{status}</span>}
                    {(status === "Offered") && <span className={styles.offered}>{status}</span>}
                    {(status === "Rejected") && <span className={styles.rejected}>{status}</span>}
                    {(status === "Accepted") && <span className={styles.accepted}>{status}</span>}
                </div>
                <div className={styles.submit_wrapper}>
                    <div className="currency">$</div><input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
                    <button onClick={handleSubmit} disabled={(status === "Accepted") || (amount < 1)} className="button-dark">Submit</button>
                </div>
            </main>
        </>
    )
}