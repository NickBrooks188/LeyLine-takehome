'use client'
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./quote.module.css";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import OpenAI from "openai";
import { thunkGetAllInventory } from "../redux/inventory";
import { thunkCreateQuote } from "../redux/quotes";

const columns = [
    {
        name: 'Item',
        selector: (row: any) => row.item,
        sortable: true,
    },
    {
        name: 'Quantity',
        selector: (row: any) => row.quantity,
        sortable: true,
        width: '100px'
    },
    {
        name: 'Dimensions',
        selector: (row: any) => row.dimensions,
        sortable: true,
    },
    {
        name: 'Due Date',
        selector: (row: any) => row.dueDate,
        sortable: true,
    },
];

export default function Page() {
    const [errors, setErrors] = useState("");
    const [email, setEmail] = useState("");
    const [text, setText] = useState("");
    const [parseDisabled, setParseDisabled] = useState(true)
    const [responseDisabled, setResponseDisabled] = useState(true)
    const [sendDisabled, setSendDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [storedEmail, setStoredEmail] = useState("")
    const [quoteStatus, setQuoteStatus] = useState<number>(0)
    const [response, setResponse] = useState("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [totalPrice, setTotalPrice] = useState<any>(0)
    const [tile, setTile] = useState<number>(0)

    const inventory = useAppSelector((state) => state.inventory)

    const dispatch = useAppDispatch()
    const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });


    useEffect(() => {
        const getInventory = async () => {
            const serverData = await dispatch(thunkGetAllInventory())
        }
        getInventory()
    }, [])


    useEffect(() => {
        document.title = 'Cloudforge | Quote'
    }, [])

    useEffect(() => {
        if (email && text) {
            setParseDisabled(false)
        } else {
            setParseDisabled(true)
        }
    }, [email, text])

    const scrollRight = () => {
        const mainSlider = document.getElementById('main')
        if (mainSlider) {
            mainSlider.scrollBy({ left: 520, top: 0, behavior: 'smooth' })
        }

        setTile((prev) => prev + 1)
    }

    const scrollLeft = () => {
        const mainSlider = document.getElementById('main')
        if (mainSlider) {
            mainSlider.scrollBy({ left: -520, top: 0, behavior: 'smooth' })
        }
        setTile((prev) => prev - 1)
    }


    const handleParse = async () => {
        setLoading(true)
        setSendDisabled(true)
        setResponse('')
        setResponseDisabled(true)
        setQuoteStatus(0)

        // Send request to OpenAI API to check if RFQ is valid, ask for executive summary details if so
        const parseRFQ = await openai.chat.completions.create({
            messages: [{
                role: "system", content: `If the following is not a request for quote for a metal supply company, please respond with False. 
                Otherwise, respond with a JSON array of objects, do not respond with True.
                Parse the following RFQ by item, quantity, due date, and dimensions? 
                The format for the JSON objects should be {"item": "", "quantity": "", "dimensions": "", "dueDate": ""} with one object per item mentioned in the RFQ. 
                If any fields are not present in the request, just add avalue of empty string.
                '${text}' `
            }],
            model: "gpt-3.5-turbo",
        });

        // If not, set quote status to 1
        if (parseRFQ.choices[0].message.content === "False") {
            setQuoteStatus(1)
            setLoading(false)
            setData([])
            setResponse('')
            return
        }
        // Display details for user and set "Generate RFQ response" button to enabled
        if (parseRFQ.choices[0].message.content) {
            try {
                setData(JSON.parse(parseRFQ.choices[0].message.content))
            } catch {
                handleParse()
                return
            }
        }
        // If so, set quote status to 2 and continue
        setQuoteStatus(2)
        setStoredEmail(email)
        const mainSlider = document.getElementById('main')
        if (mainSlider) {
            mainSlider.scrollBy({ left: 520, top: 0, behavior: 'smooth' })
        }
        setTile((prev) => prev + 1)
        setResponseDisabled(false)
        setLoading(false)
    }

    const handleResponse = async () => {
        setLoading(true)
        setQuoteStatus(0)
        const responseText = await openai.chat.completions.create({
            messages: [{
                role: "system", content:
                    `Parse the following RFQ and generate a response to the customer.
                Generate a response to the customer, including whether or not we have the requested items in our inventory and what the total cost would be if so.
                Recommend alternatives if we can't fulfil the requrest but similar items are available in our inventory.
                Do not include a signature in your response and only include the JSON output with no text before or after.
                
                This is the RFQ:
                '${text}'
                This is our inventory (in JSON format): 
                ${JSON.stringify(inventory.items)}
                
                Also parse the RFQ by customer first name and customer last name, and parse your own response for total price.
                Give your output in the format of a JSON object: '{"response": "", "customer_first_name": "", "customer_last_name": "", "total_price": ""}'. 
                If any fields are not present in the email, include an empty string ("") as the value.
                `
            }],
            model: "gpt-4o",
        });
        if (responseText.choices[0].message.content) {
            try {
                const parsedJSON = JSON.parse(responseText.choices[0].message.content)
                setResponse(parsedJSON.response)
                setTotalPrice(Number(parsedJSON.total_price) || null)
                setFirstName(parsedJSON.customer_first_name)
                setLastName(parsedJSON.customer_last_name)
            } catch {
                handleResponse()
                return
            }
        }
        const mainSlider = document.getElementById('main')
        if (mainSlider) {
            mainSlider.scrollBy({ left: 520, top: 0, behavior: 'smooth' })
        }
        setTile((prev) => prev + 1)
        setLoading(false)
        setSendDisabled(false)
    }

    const handleSend = async () => {
        const quotePost = {
            customer_first_name: firstName,
            customer_last_name: lastName,
            total_price: totalPrice,
            customer_email: storedEmail,
            text: response
        }
        const serverData = await dispatch(thunkCreateQuote(quotePost))
        if (serverData.errors) {
            console.error(serverData.errors)
        } else {
            setQuoteStatus(3)
        }
    }

    return (
        <main className='main'>
            <Link href={'/'}>
                <Image src='https://assets-global.website-files.com/6429b8ca66cfe6b6f88c2c07/6429c71369d01c2c4c258ce5_Type%3DTransparent%2C%20Color%3DCrusta.svg'
                    width={183}
                    height={100}
                    alt="Cloudforge logo"
                    className='logo'
                />
            </Link>
            <div className={styles.messages}>
                {loading && (<div className={styles.loading} id="loading">
                    <Image src='https://tierforge.s3.us-west-1.amazonaws.com/gear-spinner.svg'
                        width={20}
                        height={20}
                        alt="loading"
                    />Loading...</div>)}
                {(quoteStatus == 1) && <div className={styles.not_RFQ}><FontAwesomeIcon icon={faCircleXmark} /> Invalid RFQ</div>}
                {(quoteStatus == 2) && <div className={styles.is_RFQ}><FontAwesomeIcon icon={faCircleCheck} /> Valid RFQ</div>}
                {(quoteStatus == 3) && <div className={styles.is_RFQ}><FontAwesomeIcon icon={faCircleCheck} /> Email sent</div>}
            </div>
            <div className={styles.main_content_wrapper}>
                <div className={styles.navigate_wrapper}>
                    {(tile > 0) && <div className={styles.navigate_button} onClick={scrollLeft}><FontAwesomeIcon icon={faAngleLeft} /></div>}
                </div>
                <div className={styles.main_content} id='main'>
                    <div className={styles.main_content_tile}>
                        <form className={styles.email_form}>
                            <label>
                                Customer email address
                            </label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label >
                                Paste RFQ here
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                            {(errors) && <p>{errors}</p>}
                        </form>
                        <button className="button-dark" onClick={handleParse} disabled={parseDisabled} >Parse email</button>

                    </div>
                    <div className={styles.main_content_tile}>
                        <div className={styles.table_wrapper}>
                            {data.length > 0 && (<DataTable theme="dark" columns={columns} data={data} />)}
                        </div>
                        <button className="button-light" onClick={handleResponse} disabled={responseDisabled}>Generate RFQ response</button>
                    </div>
                    <div className={styles.main_content_tile}>
                        <textarea className={styles.response} disabled={response.length === 0} value={response} onChange={(e) => setResponse(e.target.value)}></textarea>
                        <button className="button-light" onClick={handleSend} disabled={sendDisabled}>Send RFQ response</button>
                    </div>
                </div>
                <div className={styles.navigate_wrapper}>
                    {(tile < 2) && <div className={styles.navigate_button} onClick={scrollRight}><FontAwesomeIcon icon={faAngleRight} /></div>}
                </div>
            </div>

        </main>
    )
}