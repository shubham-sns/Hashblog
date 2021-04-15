import * as React from "react";
import Link from "next/link";

function Navbar() {
  const username = null;
  const user = null;

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>
      </ul>

      {/* user is signed in as has username */}
      {username && (
        <>
          <li className="push-left">
            <Link href="/admin">
              <button className="btn-blue">Write Posts</button>
            </Link>
          </li>

          <li>
            <Link href={`/${username}`}>
              <img src={user?.photURL} />
            </Link>
          </li>
        </>
      )}

      {/* user is not signed in OR has not created username*/}
      {!username && (
        <>
          <li>
            <Link href="/enter">
              <button className="btn-blue">Login</button>
            </Link>
          </li>
        </>
      )}
    </nav>
  );
}

export { Navbar };
