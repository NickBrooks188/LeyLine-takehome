import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";

export default function Home() {
  return (
    <main className={styles.main}>
      <Link href={'/'}>
        <Image src='https://assets-global.website-files.com/6429b8ca66cfe6b6f88c2c07/6429c71369d01c2c4c258ce5_Type%3DTransparent%2C%20Color%3DCrusta.svg'
          width={183}
          height={100}
          alt="Cloudforge logo"
          className='logo'
        />
      </Link>
      <div className={styles.title_divider} />
      <div className={styles.nav_buttons}>
        <Link href='/dashboard'><div className="button-dark"><FontAwesomeIcon icon={faTableColumns} /> Dashboard</div></Link>
        <Link href='/quote'><div className="button-light"><FontAwesomeIcon icon={faSquarePlus} />Create Quote</div></Link>
      </div>
    </main>
  );
}
