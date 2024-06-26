'use client'
import styles from "./page.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsSpin } from "@fortawesome/free-solid-svg-icons";
import { thunkDeleteSettlement, thunkGetSettlement } from "./redux/settlement";
import { useAppDispatch } from "./redux/store";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getSettlement = async () => {
      const serverData = await dispatch(thunkGetSettlement())
    }
    getSettlement()
  }, [])

  const deleteSettlement = async () => {
    const serverData = await dispatch(thunkDeleteSettlement());
  }

  return (
    <main className={styles.main}>
      <div className={styles.title_divider} />
      <div className={styles.nav_buttons}>
        <Link href='/party_a'><div className="button-light">Party A</div></Link>
        <div className="button-dark" onClick={deleteSettlement}><FontAwesomeIcon icon={faArrowsSpin} /> Reset Settlement</div>
        <Link href='/party_b'><div className="button-light">Party B</div></Link>
      </div>
    </main>
  );
}
